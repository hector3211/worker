import { auth } from "@clerk/nextjs/dist/types/server-helpers.server";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("Authorized!", { status: 200 });
}
