import React, { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import AuthService, { UserInfo } from "../services/AuthService";

interface UserProfileProps {
  authService: AuthService;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ authService, onLogout }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      const info = await authService.fetchUserInfo();
      setUserInfo(info);
    };

    loadUserInfo();
  }, [authService]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {userInfo?.username || "Loading..."}
          </span>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {userInfo?.username ? (
            getInitials(userInfo.username)
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {userInfo?.username}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {userInfo?.email}
            </div>
          </div>
          {/* Add menu items here */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
