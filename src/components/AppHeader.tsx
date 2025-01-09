import React from "react";
import { Sidebar, Sun, Moon, Settings, HelpCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import AuthService from "../services/AuthService";
import UserProfile from "./UserProfile";

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  authService: AuthService;
  onLogout: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  authService,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Sidebar className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center gap-3">
          {/* App Logo */}
          <div className="relative w-8 h-8">
            <img
              src="/speak2see-logo.svg"
              alt="Speak2See"
              className="w-full h-full"
            />
            <div className="absolute inset-0 animate-spin-slow opacity-30">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path
                  className="text-blue-500 dark:text-blue-400"
                  fill="currentColor"
                  d="M50,0 C55,25 75,35 95,50 C75,65 55,75 50,100 C45,75 25,65 5,50 C25,35 45,25 50,0"
                />
              </svg>
            </div>
          </div>

          {/* App Title */}
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Speak2See
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Turn Speech into Images
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Help Button */}
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Settings Button */}
        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* User Profile */}
        <UserProfile authService={authService} onLogout={onLogout} />
      </div>
    </header>
  );
};

export default AppHeader;
