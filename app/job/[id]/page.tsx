import { getJob } from "@/lib/dbactions";

type PageProps = {
  params: {
    id: number;
  };
};

export default async function JobHome({ params: { id } }: PageProps) {
  const job = await getJob(id);
  console.log(`Job picutes: ${job?.picture}`);
  return (
    <main className="relative top-16">
      <h1>job</h1>
      <p>Invoice: {job?.invoice}</p>
      <p>Sink: {job?.sink}</p>
      {job?.picture?.map((pic) => (
        <img
          src={`${pic}`}
          alt={`${job?.invoice} picture`}
          className="w-[350px]"
        />
      ))}
    </main>
  );
}
