// app/api/jobs/route.ts
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  try {
    const jsonData = await request.json();

    const { volunteer_id, month } = jsonData;

    // Create a FormData object instead of JSON
    const formData = new FormData();

    formData.append("volunteer_id", volunteer_id);
    formData.append("month", month);  

    const apiEndpoint = "https://shop.abhihire.com/AbhiHire/sapanel/GetVolunteer_MonthStats.php";

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
