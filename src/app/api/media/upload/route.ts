import { NextResponse } from "next/server";
import ImageKit, { toFile } from "@imagekit/nodejs";
import { v2 as cloudinary } from "cloudinary";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getSession();

  if (
    !session ||
    (session.role !== "VENDOR_OWNER" &&
      session.role !== "VENDOR_STAFF" &&
      session.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedCdn = (formData.get("cdn") as string) || "imagekit";
    const customFolder = (formData.get("folder") as string) || "/bloom-bakes/addons";

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or AVIF image." },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const cleanBaseName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "-")
      .toLowerCase();
    const fileName = `addon-${Date.now()}-${cleanBaseName}`;

    // Upload to Cloudinary if requested
    if (requestedCdn === "cloudinary") {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json(
          { error: "Cloudinary credentials not configured on server." },
          { status: 500 }
        );
      }

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });

      const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;
      const clRes = await cloudinary.uploader.upload(base64Data, {
        folder: customFolder.replace(/^\//, ""),
        public_id: fileName.replace(/\.[^/.]+$/, ""),
        resource_type: "image",
        overwrite: true,
      });

      return NextResponse.json({
        success: true,
        url: clRes.secure_url,
        cdn: "cloudinary",
        fileName: file.name,
        width: clRes.width,
        height: clRes.height,
      });
    }

    // Default to ImageKit
    const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const ikUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!ikPrivateKey || !ikUrlEndpoint) {
      return NextResponse.json(
        { error: "ImageKit credentials not configured on server." },
        { status: 500 }
      );
    }

    const ikClient = new ImageKit({
      privateKey: ikPrivateKey,
    });

    const ikFile = await toFile(buffer, fileName);
    const ikRes = await ikClient.files.upload({
      file: ikFile,
      fileName,
      folder: customFolder,
      useUniqueFileName: true,
      tags: ["bloom-bakes", "addon", session.role.toLowerCase()],
    });

    const finalUrl =
      ikRes.url ||
      `${ikUrlEndpoint.replace(/\/$/, "")}/${ikRes.filePath?.replace(/^\//, "") || fileName}`;

    return NextResponse.json({
      success: true,
      url: finalUrl,
      cdn: "imagekit",
      fileName: file.name,
      fileId: ikRes.fileId,
    });
  } catch (err: unknown) {
    console.error("Media upload error:", err);
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
