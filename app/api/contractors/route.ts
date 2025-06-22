// app/api/jobs/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://powerapps.sbs/AbhiHire/sapanel/Get_AllContractors.php");
  const text = await response.text();
  const cleanText = text.replace(/^\uFEFF/, ""); // Remove BOM if it exists
  const data = JSON.parse(cleanText); // Parse the cleaned text as JSON

  return NextResponse.json(data); // Send the JSON response
}

export async function POST(request: Request) {
    try {
      const jsonData = await request.json();
  
      const { SNo, Status } = jsonData;
  
      // Create a FormData object instead of JSON
      const formData = new FormData();
  
      formData.append("SNo", SNo);
      formData.append("Status", Status);
  
      const apiEndpoint = "https://powerapps.sbs/AbhiHire/sapanel/Update_Contractor.php";
  
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData, // Send as FormData
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
  
      const result = await response.json();
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  