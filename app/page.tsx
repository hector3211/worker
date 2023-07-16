import { getAllJobs, getRecentJobs } from "@/lib/dbactions";
import { Suspense } from "react";
import JobTable from "./components/jobtable";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

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
  const user = await getServerSession(authOptions);

  return (
    <main className="relative top-16">
      <h1 className="text-2xl">{user?.user.role}</h1>
      {recent && recent.length > 0 && (
        <Suspense fallback={<p>Loading...</p>}>
          <JobTable category="recent" jobs={recent} />
        </Suspense>
      )}
      <Suspense fallback={<p>Loading...</p>}>
        <JobTable category="all" jobs={all} />
      </Suspense>
    </main>
  );
}
