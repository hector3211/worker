import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserForm from "../components/Userform";

export default async function Register() {
  const user = await getServerSession();
  // if (user?.user.role !== process.env.ADMIN_SECRET) {
  //   redirect("/");
  // }
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <UserForm />
    </div>
  );
}
