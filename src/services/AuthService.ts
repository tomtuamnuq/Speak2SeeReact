import {
  fetchAuthSession,
  signIn,
  getCurrentUser,
  signOut,
} from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";

export interface UserInfo {
  username: string;
  email: string;
}

class AuthService {
  idToken: string | undefined;
  private currentUser: UserInfo | null = null;
  constructor(userPoolId: string, userPoolClientId: string) {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: userPoolId,
          userPoolClientId: userPoolClientId,
        },
      },
    });
  }

  public async isAuthorized() {
    if (this.idToken) {
      return true;
    }
    const session = await fetchAuthSession();
    if (session.tokens?.idToken) {
      await this.setIdToken();
      return true;
    }
    return false;
  }

  private async setIdToken() {
    const session = await fetchAuthSession();
    this.idToken = session.tokens?.idToken?.toString();
  }

  public async login(userName: string, password: string): Promise<boolean> {
    if (this.idToken) {
      return true;
    }
    try {
      await signIn({
        username: userName,
        password: password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });
      await this.setIdToken();
      await this.fetchUserInfo(); // Fetch user info after successful login
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async logout(): Promise<void> {
    await signOut();
    this.idToken = undefined;
    this.currentUser = null;
  }
  public async fetchUserInfo(): Promise<UserInfo | null> {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;

      if (!idToken) {
        return null;
      }

      // Parse JWT token to get user attributes
      const payload = JSON.parse(atob(idToken.toString().split(".")[1]));

      this.currentUser = {
        username: user.username,
        email: payload.email,
      };

      return this.currentUser;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }

  public getCurrentUserInfo(): UserInfo | null {
    return this.currentUser;
  }

  public getIdToken() {
    return this.idToken;
  }
}

export default AuthService;
