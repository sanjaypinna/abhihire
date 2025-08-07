import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://shop.abhihire.com/AbhiHire/sapanel/Get_TopVolunteers.php");
  const text = await response.text();
  const cleanText = text.replace(/^\uFEFF/, ""); // Remove BOM if it exists
  const data = JSON.parse(cleanText); // Parse the cleaned text as JSON

  return NextResponse.json(data); // Send the JSON response
}
