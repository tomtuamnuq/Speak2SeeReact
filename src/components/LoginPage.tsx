import React, { useState } from "react";
import AuthService from "../services/AuthService";

interface LoginPageProps {
  authService: AuthService;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  authService,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await authService.login(username, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Welcome to Speak2See
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Turn your speech into stunning images
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg font-medium text-white
                       transition-colors duration-200
                       ${
                         isLoading
                           ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                           : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                       }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
              >
                Contact your administrator
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Protected by AWS Cognito. By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
