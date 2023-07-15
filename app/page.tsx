import { seed } from "@/lib/drizzle";
import UploadThing from "./example-uploader";
import { getAllJobs, getRecentJobs } from "@/lib/dbactions";
import Recentjobs from "@/components/Recentjobs";

async function fetchRecentJobs() {
  // const recentJobs = await getRecentJobs();
  const recentJobs = await getAllJobs();
  return recentJobs;
}

export default async function Home() {
  const jobs = await fetchRecentJobs();
  return (
    <main className="relative">
      <UploadThing />
      <Recentjobs jobs={jobs} />
    </main>
  );
} // this up there is actually disgusting
