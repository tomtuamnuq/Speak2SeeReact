import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AuthService from "./services/AuthService";
import ApiService from "./services/ApiService";
import { getConfig } from "./services/Config";
import LoginPage from "./components/LoginPage";
import MainLayout from "./components/MainLayout";
import { ThemeProvider } from "./contexts/ThemeContext";

const config = getConfig();
const authService = new AuthService(config.userPoolId, config.userPoolClientId);
const apiService = new ApiService(
  authService,
  config.apiEndpoint,
  config.userMockApi // TODO this is only for demonstration purposes and not for production
);

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authorized = await authService.isAuthorized();
    setIsAuthorized(authorized);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
  };

  return (
    <ThemeProvider>
      <Router>
        {!isAuthorized ? (
          <LoginPage
            authService={authService}
            onLoginSuccess={() => setIsAuthorized(true)}
          />
        ) : (
          <MainLayout
            apiService={apiService}
            authService={authService}
            onLogout={handleLogout}
          />
        )}
      </Router>
    </ThemeProvider>
  );
};
export default App;
