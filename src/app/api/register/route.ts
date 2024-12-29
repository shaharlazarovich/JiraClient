import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { jiraUrl, jiraUser, jiraToken } = body;

  // Basic validation
  if (!jiraUrl || !jiraUser || !jiraToken) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  // Simulate registration success
  console.log("Jira Details:", { jiraUrl, jiraUser, jiraToken });
  return NextResponse.json(
    { message: "Registration successful." },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers: {
      Allow: "POST, OPTIONS",
    },
  });
}
