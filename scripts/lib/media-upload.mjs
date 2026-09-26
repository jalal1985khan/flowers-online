import crypto from "crypto";
import ImageKit, { toFile } from "@imagekit/nodejs";
import { v2 as cloudinary } from "cloudinary";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80";

function blockedImageHosts() {
  const raw = process.env.BLOCKED_IMAGE_HOSTS || "";
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
}

export function isBlockedImageHost(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return blockedImageHosts().some((b) => host === b || host.endsWith(`.${b}`));
  } catch {
    return true;
  }
}

export function isManagedCdnUrl(url) {
  if (!url) return false;
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || "";
  if (endpoint && url.startsWith(endpoint)) return true;
  if (cloud && url.includes(`res.cloudinary.com/${cloud}/`)) return true;
  return false;
}

export function buildBloomFileBase(productSlug, index) {
  const safe = productSlug.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").toLowerCase();
  const idx = String(index + 1).padStart(2, "0");
  return `bnb-${safe}-${idx}`;
}

function extFromContentType(contentType, fallback = "jpg") {
  if (!contentType) return fallback;
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  return fallback;
}

function extFromUrl(url) {
  try {
    const path = new URL(url).pathname;
    const match = path.match(/\.([a-zA-Z0-9]{2,5})$/);
    return match ? match[1].toLowerCase() : "jpg";
  } catch {
    return "jpg";
  }
}

export function mediaStorageConfigured() {
  const ik =
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT;
  const cl =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;
  return { imagekit: Boolean(ik), cloudinary: Boolean(cl), ready: Boolean(ik && cl) };
}

function getImageKitClient() {
  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function downloadImage(sourceUrl, timeoutMs = 90_000) {
  const res = await fetch(sourceUrl, {
    headers: { "User-Agent": "BloomBakesMediaSync/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = res.headers.get("content-type") || "";
  const ext = extFromContentType(contentType, extFromUrl(sourceUrl));
  return { buffer, contentType, ext };
}

/**
 * Upload one image to ImageKit + Cloudinary with a Bloom-branded file name.
 * Returns { imagekitUrl, cloudinaryUrl, fileName }.
 */
export async function uploadProductImageBuffer({
  buffer,
  contentType,
  ext,
  productSlug,
  index,
}) {
  const { imagekit, cloudinary: hasCloudinary, ready } = mediaStorageConfigured();
  if (!ready) {
    throw new Error(
      "Set IMAGEKIT_* and CLOUDINARY_* env vars before uploading (see .env.example)."
    );
  }

  const fileBase = buildBloomFileBase(productSlug, index);
  const fileName = `${fileBase}.${ext}`;
  const folder = `/bloom-bakes/products/${productSlug}`;
  const hash = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 8);
  const fileNameHashed = `${fileBase}-${hash}.${ext}`;

  let imagekitUrl = null;
  let cloudinaryUrl = null;

  if (imagekit) {
    const client = getImageKitClient();
    const ikRes = await client.files.upload({
      file: await toFile(buffer, fileNameHashed),
      fileName: fileNameHashed,
      folder,
      useUniqueFileName: false,
      overwriteFile: true,
      tags: ["bloom-bakes", "product", productSlug],
    });
    imagekitUrl = ikRes.url;
  }

  if (hasCloudinary) {
    configureCloudinary();
    const clRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `bloom-bakes/products/${productSlug}`,
          public_id: fileBase,
          overwrite: true,
          resource_type: "image",
          format: ext,
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });
    cloudinaryUrl = clRes.secure_url;
  }

  return { imagekitUrl, cloudinaryUrl, fileName: fileNameHashed };
}

export async function rehostProductImageUrl(sourceUrl, productSlug, index) {
  if (!sourceUrl) return { imagekitUrl: null, cloudinaryUrl: null };
  if (isManagedCdnUrl(sourceUrl)) {
    return { imagekitUrl: sourceUrl, cloudinaryUrl: null, skipped: true };
  }
  const { buffer, contentType, ext } = await downloadImage(sourceUrl);
  return uploadProductImageBuffer({ buffer, contentType, ext, productSlug, index });
}

export async function rehostProductImages(urls, productSlug, options = {}) {
  const { allowBlockedSources = false } = options;
  const imagekitUrls = [];
  const cloudinaryUrls = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (!url) continue;
    if (!allowBlockedSources && isBlockedImageHost(url)) {
      if (isManagedCdnUrl(url)) {
        imagekitUrls.push(url);
      }
      continue;
    }
    if (isManagedCdnUrl(url)) {
      imagekitUrls.push(url);
      continue;
    }
    try {
      const { imagekitUrl, cloudinaryUrl } = await rehostProductImageUrl(url, productSlug, i);
      if (imagekitUrl) imagekitUrls.push(imagekitUrl);
      if (cloudinaryUrl) cloudinaryUrls.push(cloudinaryUrl);
    } catch (err) {
      console.warn(`    ⚠ image ${i + 1} failed: ${err.message}`);
    }
  }

  if (imagekitUrls.length === 0) {
    imagekitUrls.push(FALLBACK_IMAGE);
  }

  return { imagekitUrls, cloudinaryUrls };
}

export { FALLBACK_IMAGE };
