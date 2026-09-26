"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("admin_theme");
    const container = document.getElementById("admin-root-container");
    if (saved === "dark") {
      setTheme("dark");
      container?.classList.add("dark");
    } else {
      setTheme("light");
      container?.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("admin_theme", next);

    const container = document.getElementById("admin-root-container");
    if (next === "dark") {
      container?.classList.add("dark");
    } else {
      container?.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 text-xs font-medium h-8"
      >
        <Sun className="h-3.5 w-3.5" />
        <span>Light Mode</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-full justify-between gap-2 text-xs font-medium h-8 border-border bg-card hover:bg-muted text-card-foreground"
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
    >
      <div className="flex items-center gap-2">
        {theme === "light" ? (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-blue-400" />
        )}
        <span>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
      </div>
      <span className="text-[10px] uppercase font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
        {theme}
      </span>
    </Button>
  );
}
