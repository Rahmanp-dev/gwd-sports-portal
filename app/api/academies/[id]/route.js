import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    const academy = await Academy.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!academy) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json(academy);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const academy = await Academy.findOneAndDelete({ id });
    
    if (!academy) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json({ deleted: id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

