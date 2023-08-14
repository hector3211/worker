import { getJob } from "@/app/_serverActions";
import { Label } from "@/app/components/ui/label";
import { IoWarningOutline } from "react-icons/io5";

type PageProps = {
  params: {
    id: number;
  };
};

export default async function JobHome({ params: { id } }: PageProps) {
  const job = await getJob(id);
  return (
    <main className="min-h-screen">
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            {job?.pictures && job.pictures.length > 0 ? (
              <div className="flex overflow-x-auto scroll-smooth max-w-full p-4 space-x-2 bg-neutral rounded-box">
                {job?.pictures?.map((pic, idx) => (
                  <img
                    key={idx}
                    alt={`picture #${idx}`}
                    className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                    src={`${pic}`}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full">
                <div className="flex space-x-3">
                  <div className="flex justify-center items-center bg-gray-700 animate-pulse w-[600px] h-[270px] rounded-md ">
                    <IoWarningOutline className="text-orange-500 md:text-3xl" />
                  </div>
                  <div className="flex justify-center items-center bg-gray-700 animate-pulse w-[600px] h-[270px] rounded-md ">
                    <IoWarningOutline className="text-orange-500 md:text-3xl" />
                  </div>
                </div>
                <p className="text-rose-600">No Pictures Were Provided</p>
              </div>
            )}
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <div className="flex  justify-between items-start">
                <div className="flex flex-col">
                  <Label className="font-meduim underline underline-offset-2 text-md">
                    Invoice
                  </Label>
                  <p className="text-center">{job?.invoice}</p>
                </div>
                <div className=" flex flex-col">
                  <Label className="font-meduim underline underline-offset-2 text-md">
                    Sinks
                  </Label>
                  <div className="flex flex-col">
                    {job &&
                      job.sink?.map((sink, idx) => <p key={idx}>{sink}</p>)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label className="font-meduim underline underline-offset-2 text-md">
                    Edges
                  </Label>
                  <div className="flex flex-col">
                    {job &&
                      job.edge?.map((edge, idx) => (
                        <p key={idx} className="text-center">
                          {edge}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label className="font-meduim  underline underline-offset-2 text-md">
                    Cutters
                  </Label>
                  <div className="flex flex-col text-center">
                    {job &&
                      job.user?.map((user, idx) => (
                        <p key={idx}>{user.userName.split(" ")[0]}</p>
                      ))}
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  <Label className="font-medium underline underline-offset-2 text-md">
                    Sent
                  </Label>
                  <p className="text-center">
                    {job?.created_at.toISOString().slice(0, 10)}
                  </p>
                </div>
                <div className="flex flex-col text-center">
                  <Label className="font-meduim underline underline-offset-2 text-md">
                    Due
                  </Label>
                  <p className="text-center">{job?.due_date}</p>
                </div>
                <div className="flex flex-col">
                  <Label className="font-meduim underline underline-offset-2 text-md">
                    Completed
                  </Label>
                  <p className="text-center">
                    {job?.completed === false ? "⚠️" : "✅"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
