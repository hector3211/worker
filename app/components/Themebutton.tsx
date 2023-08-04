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
        <Button onClick={() => setTheme("dark")}>
          <BsFillMoonFill />
        </Button>
      ) : (
        <Button
          className="dark:bg-white text-lg"
          onClick={() => setTheme("light")}
        >
          <BsSunFill />
        </Button>
      )}
    </div>
  );
}
