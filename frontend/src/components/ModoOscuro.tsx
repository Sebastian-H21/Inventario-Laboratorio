import { useEffect, useState } from "react";

const ModoOscuro = () => {
  const [themeIcon, setThemeIcon] = useState("moon");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    const theme = storedTheme ?? "dark";
    const isDark = theme === "dark";

    
    document.documentElement.classList.toggle("dark", isDark);
    setThemeIcon(isDark ? "sun" : "moon");

    
    if (!storedTheme) {
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const handleToggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    const newTheme = isDark ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setThemeIcon(isDark ? "sun" : "moon");
  };

  return (
    <button
      onClick={handleToggleDarkMode}
      className="absolute top-4 right-4 p-2 z-50 cursor-pointer"
    >
      <img src={`/Inventario/${themeIcon}.png`} alt="Toggle dark mode" />
    </button>
  );
};

export default ModoOscuro;
