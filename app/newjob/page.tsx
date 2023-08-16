import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import JobForm from "../components/Addjobform";
import { Suspense } from "react";
import Loading from "../loading";

export default async function NewJobPage() {
  const currUser = await getServerSession(authOptions);
  if (!currUser?.user.role) {
    redirect("/");
  }
  return (
    <main className="container py-20">
      <div className="px-6 lg:px-8">
        <div
          className="absolute inset-x-0 top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 sm:right-30"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-yellowprimary to-greenprimary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <JobForm />
      </Suspense>
    </main>
  );
}
