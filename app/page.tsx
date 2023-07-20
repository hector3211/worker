import Link from "next/link";
import { Button } from "./components/ui/button";
import { getAllJobs, getRecentJobs } from "@/lib/dbactions";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { DataTable } from "./jobs/Datatable";
import { columns } from "./jobs/columns";
import { seed } from "@/lib/drizzle";
import { Card, CardContent } from "./components/ui/card";

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
    <main className="relative">
      {all && (
        <Suspense fallback={<p>Loading...</p>}>
          <DataTable columns={columns} data={all} />
        </Suspense>
      )}
    </main>
  );
}
