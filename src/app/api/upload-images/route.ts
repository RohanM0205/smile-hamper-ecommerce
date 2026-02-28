import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { images } = await req.json();

    // images = array of base64 strings
    const uploads = await Promise.all(
      images.map((img: string) =>
        cloudinary.uploader.upload(img, {
          folder: "products",
        })
      )
    );

    return NextResponse.json(
      uploads.map((u) => ({
        url: u.secure_url,
        public_id: u.public_id,
      }))
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
