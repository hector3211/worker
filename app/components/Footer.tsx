import Link from "next/link";

export default function Footer() {
  return (
    <div className="relative bottom-0 w-full flex items-center pl-5 h-14">
      Built by
      <Link
        href={"https://www.hectororopesa.com"}
        target="_blank"
        className="ml-1 underline underline-offset-2 font-medium"
      >
        Hector Oropesa
      </Link>
    </div>
  );
}
