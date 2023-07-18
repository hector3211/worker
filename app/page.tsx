import { getAllJobs, getRecentJobs } from "@/lib/dbactions";
import { Suspense } from "react";
import JobTable from "./components/jobtable";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Upload from "./Uploadthing";
import { DataTable } from "./jobs/Datatable";
import { columns } from "./jobs/columns";

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
      {recent && recent.length > 0 && (
        <Suspense fallback={<p>Loading...</p>}>
          <DataTable columns={columns} data={recent} />
        </Suspense>
      )}
      {all && (
        <Suspense fallback={<p>Loading...</p>}>
          <DataTable columns={columns} data={all} />
        </Suspense>
      )}
    </main>
  );
}
