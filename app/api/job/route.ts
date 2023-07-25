import { getAllJobs, insertNewJob } from "@/lib/Dbactions";
import { Job } from "@/lib/drizzle";
import { NextResponse } from "next/server";

export async function GET() {
  const allJobs = await getAllJobs();

  if (!allJobs) {
    return new Response("Error getting all jobs!").body;
  }
}

export async function POST(req: Request) {
  const body: Job = await req.json();
  const job = await insertNewJob(body);

  if (!job) {
    return new Response("Error saving job to DataBase!").body;
  }

  return NextResponse.json({ job }).ok;
}
