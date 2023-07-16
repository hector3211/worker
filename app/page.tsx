import { seed } from "@/lib/drizzle";
import { getAllJobs, getRecentJobs } from "@/lib/dbactions";
import { Suspense } from "react";
import JobTable from "@/components/jobtable";

async function fetchJobs() {
  const recentJobs = await getRecentJobs();
  const allJobs = await getAllJobs();
  return {
    recent: recentJobs,
    all: allJobs,
  };
}

export default async function Home() {
  const { recent, all } = await fetchJobs();
  return (
    <main className="relative top-10">
      {recent && recent.length && (
        <Suspense fallback={<p>Loading...</p>}>
          <JobTable category="recent" jobs={recent} />
        </Suspense>
      )}
      <Suspense fallback={<p>Loading...</p>}>
        <JobTable category="all" jobs={all} />
      </Suspense>
    </main>
  );
} // this up there is actually disgusting
