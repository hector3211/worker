import { getJobs, getTodaysJobs } from "../_serverActions";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { DataTable } from "../jobs/Datatable";
import { columns } from "../jobs/columns";
import Footer from "../components/Footer";

async function fetchJobs() {
  // const recentJobs = await getTodaysJobs();
  const allJobs = await getJobs();
  return {
    // recent: recentJobs,
    all: allJobs,
  };
}

export default async function DashBoard() {
  const { all } = await fetchJobs();
  const user = await getServerSession(authOptions);

  return (
    <main className="pb-10">
      {all && <DataTable columns={columns} data={all} />}
    </main>
  );
}
