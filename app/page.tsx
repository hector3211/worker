import { seed } from "@/lib/drizzle";
import UploadThing from "./example-uploader";

export default async function Home() {
  return (
    <main className="">
      <UploadThing />
    </main>
  );
}
