import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const jsonData = await request.json();

        const { Name, EmailId, MobileNo, Pincode, UserId, Password } = jsonData;

        // Create a FormData object instead of JSON
        const formData = new FormData();

        formData.append("Name", Name);
        formData.append("EmailId", EmailId);
        formData.append("MobileNo", MobileNo);
        formData.append("Pincode", Pincode);
        formData.append("UserId", UserId);
        formData.append("Password", Password);

        const apiEndpoint = "https://powerapps.sbs/AbhiHire/sapanel/AddVolunteer.php";

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
