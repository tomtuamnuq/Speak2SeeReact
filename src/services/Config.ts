export interface AppConfig {
  apiEndpoint: string;
  userPoolId: string;
  userPoolClientId: string;
  userMockApi: boolean;
}

export function getConfig(): AppConfig {
  return {
    apiEndpoint: import.meta.env.VITE_REACT_APP_API_ENDPOINT,
    userPoolId: import.meta.env.VITE_REACT_APP_USER_POOL_ID,
    userPoolClientId: import.meta.env.VITE_REACT_APP_USER_POOL_CLIENT_ID,
    userMockApi: import.meta.env.VITE_REACT_APP_USE_MOCK_API === "true",
  };
}
