import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import ImageKit from "@imagekit/nodejs";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "ALL"; // ALL, UNUSED, USED
    const cdn = searchParams.get("cdn") || "ALL"; // ALL, IMAGEKIT, CLOUDINARY
    const search = (searchParams.get("q") || "").toLowerCase().trim();

    // 1. Gather all image references from Database to detect usage
    const [products, addons, categories, occasions] = await Promise.all([
      prisma.product.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          images: true,
          cloudinaryImages: true,
        },
      }),
      prisma.addon.findMany({
        select: {
          id: true,
          title: true,
          image: true,
        },
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          image: true,
        },
      }),
      prisma.occasion.findMany({
        select: {
          id: true,
          name: true,
          bannerImage: true,
        },
      }),
    ]);

    // Build lookup map for fast checking
    const dbRefs: Array<{ url: string; label: string }> = [];

    for (const p of products) {
      for (const img of p.images || []) {
        if (img) dbRefs.push({ url: img, label: `Product: "${p.title}"` });
      }
      for (const img of p.cloudinaryImages || []) {
        if (img) dbRefs.push({ url: img, label: `Product: "${p.title}"` });
      }
    }

    for (const a of addons) {
      if (a.image) dbRefs.push({ url: a.image, label: `Add-on: "${a.title}"` });
    }

    for (const c of categories) {
      if (c.image) dbRefs.push({ url: c.image, label: `Category: "${c.name}"` });
    }

    for (const o of occasions) {
      if (o.bannerImage) dbRefs.push({ url: o.bannerImage, label: `Occasion: "${o.name}"` });
    }

    // Helper to check usage against DB references
    const checkUsage = (cdnUrl: string, filePath?: string, name?: string, publicId?: string) => {
      const matched = dbRefs.filter((ref) => {
        if (ref.url === cdnUrl) return true;
        if (filePath && ref.url.includes(filePath)) return true;
        if (name && ref.url.includes(name)) return true;
        if (publicId && ref.url.includes(publicId)) return true;
        return false;
      });
      return {
        isUsed: matched.length > 0,
        usedIn: Array.from(new Set(matched.map((m) => m.label))),
      };
    };

    const mediaItems: Array<{
      id: string;
      name: string;
      url: string;
      thumbnail: string;
      cdn: "imagekit" | "cloudinary";
      size: number;
      width?: number;
      height?: number;
      createdAt: string;
      isUsed: boolean;
      usedIn: string[];
      publicId?: string;
    }> = [];

    // 2. Fetch from ImageKit
    const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (ikPrivateKey) {
      try {
        const ikClient = new ImageKit({ privateKey: ikPrivateKey });
        const ikAssets = (await ikClient.assets.list({ limit: 100 })) as any[];
        if (Array.isArray(ikAssets)) {
          for (const item of ikAssets) {
            if (item.type !== "file") continue;
            const fileUrl = String(item.url || "");
            if (!fileUrl) continue;
            const usage = checkUsage(fileUrl, item.filePath, item.name);
            mediaItems.push({
              id: String(item.fileId || fileUrl),
              name: String(item.name || "Untitled"),
              url: fileUrl,
              thumbnail: String(item.thumbnail || fileUrl),
              cdn: "imagekit",
              size: Number(item.size || 0),
              width: item.width ? Number(item.width) : undefined,
              height: item.height ? Number(item.height) : undefined,
              createdAt: String(item.createdAt || new Date().toISOString()),
              isUsed: usage.isUsed,
              usedIn: usage.usedIn,
            });
          }
        }
      } catch (e) {
        console.error("Failed to list ImageKit assets:", e);
      }
    }

    // 3. Fetch from Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (cloudName && apiKey && apiSecret) {
      try {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true,
        });

        const clRes = await cloudinary.api.resources({
          type: "upload",
          max_results: 100,
        });

        if (clRes.resources && Array.isArray(clRes.resources)) {
          for (const res of clRes.resources) {
            const usage = checkUsage(res.secure_url || res.url, undefined, undefined, res.public_id);
            mediaItems.push({
              id: res.asset_id || res.public_id,
              name: res.public_id.split("/").pop() || res.public_id,
              url: res.secure_url || res.url,
              thumbnail: res.secure_url || res.url,
              cdn: "cloudinary",
              size: res.bytes || 0,
              width: res.width,
              height: res.height,
              createdAt: res.created_at,
              isUsed: usage.isUsed,
              usedIn: usage.usedIn,
              publicId: res.public_id,
            });
          }
        }
      } catch (e) {
        console.error("Failed to list Cloudinary resources:", e);
      }
    }

    // 4. Compute statistics
    const totalCount = mediaItems.length;
    const usedCount = mediaItems.filter((m) => m.isUsed).length;
    const unusedCount = mediaItems.filter((m) => !m.isUsed).length;
    const unusedBytes = mediaItems
      .filter((m) => !m.isUsed)
      .reduce((sum, m) => sum + m.size, 0);
    const totalBytes = mediaItems.reduce((sum, m) => sum + m.size, 0);
    const imagekitCount = mediaItems.filter((m) => m.cdn === "imagekit").length;
    const cloudinaryCount = mediaItems.filter((m) => m.cdn === "cloudinary").length;

    // 5. Apply filters
    let filtered = mediaItems;

    if (filter === "UNUSED") {
      filtered = filtered.filter((m) => !m.isUsed);
    } else if (filter === "USED") {
      filtered = filtered.filter((m) => m.isUsed);
    }

    if (cdn === "IMAGEKIT") {
      filtered = filtered.filter((m) => m.cdn === "imagekit");
    } else if (cdn === "CLOUDINARY") {
      filtered = filtered.filter((m) => m.cdn === "cloudinary");
    }

    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.url.toLowerCase().includes(search) ||
          m.usedIn.some((u) => u.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      items: filtered,
      stats: {
        totalCount,
        usedCount,
        unusedCount,
        totalBytes,
        unusedBytes,
        imagekitCount,
        cloudinaryCount,
      },
    });
  } catch (err: unknown) {
    console.error("Media list error:", err);
    return NextResponse.json({ error: "Failed to list media files" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const body = await req.json();
    const { items } = body as {
      items?: Array<{ id: string; cdn: "imagekit" | "cloudinary"; publicId?: string }>;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided for deletion" }, { status: 400 });
    }

    const ikPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const ikClient = ikPrivateKey ? new ImageKit({ privateKey: ikPrivateKey }) : null;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let deletedCount = 0;
    const errors: string[] = [];

    for (const item of items) {
      try {
        if (item.cdn === "imagekit" && ikClient) {
          await ikClient.files.delete(item.id);
          deletedCount++;
        } else if (item.cdn === "cloudinary") {
          const targetId = item.publicId || item.id;
          await cloudinary.uploader.destroy(targetId);
          deletedCount++;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Failed to delete ${item.id}: ${msg}`);
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: unknown) {
    console.error("Delete media error:", err);
    return NextResponse.json({ error: "Failed to delete media items" }, { status: 500 });
  }
}
