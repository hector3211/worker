import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "./components/ui/button";

export default async function Home() {
  const user = await getServerSession(authOptions);

  if (!user) {
    return (
      <main className="relative top-16">
        <h1>Not Signed in</h1>
      </main>
    );
  } else {
    return (
      <main className="relative top-16">
        <div className="flex flex-col justify-center items-center">
          <h1>Welcome</h1>
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }
}
