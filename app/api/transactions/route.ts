import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://powerapps.sbs/AbhiHire/sapanel/GetAllTransactions.php");
  const text = await response.text();
  const cleanText = text.replace(/^\uFEFF/, ""); // Remove BOM if it exists
  const data = JSON.parse(cleanText); // Parse the cleaned text as JSON

  return NextResponse.json(data); // Send the JSON response
}
