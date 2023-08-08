import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }
  return (
    <div>
      {theme === "light" ? (
        <Button
          className="hover:bg-gray-300"
          variant={"ghost"}
          onClick={() => setTheme("dark")}
        >
          <BsFillMoonFill />
        </Button>
      ) : (
        <Button
          variant={"ghost"}
          className="dark:text-white text-lg hover:dark:bg-gray-900"
          onClick={() => setTheme("light")}
        >
          <BsSunFill />
        </Button>
      )}
    </div>
  );
}
