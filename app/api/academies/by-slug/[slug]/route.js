import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    
    // Try by slug first, then by id
    let academy = await Academy.findOne({ slug }).lean();
    if (!academy) {
      academy = await Academy.findOne({ id: slug }).lean();
    }
    
    if (!academy) {
      return NextResponse.json({ error: "Academy not found" }, { status: 404 });
    }
    
    return NextResponse.json(academy);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
