import AuthService from "./AuthService";
import {
  ProcessingItem,
  ItemDetails,
  GetAllResponse,
} from "../../shared/types";
import {
  mockGetAllResponse,
  mockGetResponseFailed,
  mockGetResponseFinished,
  mockGetResponseUnFinished,
  mockUploadResponse,
} from "./Mocks";

class ApiService {
  private authService: AuthService;
  private apiEndpoint: string;
  private useMockApi: boolean;
  constructor(
    authService: AuthService,
    apiEndpoint: string,
    useMockApi: boolean
  ) {
    this.authService = authService;
    this.apiEndpoint = apiEndpoint;
    this.useMockApi = useMockApi;
  }
  private authorizationHeader() {
    const idToken = this.authService.getIdToken();
    if (!idToken) {
      throw new Error("IDToken does not exist yet...");
    }
    return `Bearer ${idToken}`;
  }
  async uploadAudio(audioBlob: Blob): Promise<ProcessingItem> {
    if (this.useMockApi) {
      return mockUploadResponse;
    }
    const response = await fetch(`${this.apiEndpoint}upload`, {
      method: "POST",
      body: audioBlob,
      headers: {
        Authorization: this.authorizationHeader(),
        "Content-Type": "audio/wav",
      },
    });
    return response.json();
  }

  async getAllItems(): Promise<ProcessingItem[]> {
    if (this.useMockApi) {
      return mockGetAllResponse;
    }
    const response = await fetch(`${this.apiEndpoint}getAll`, {
      headers: {
        Authorization: this.authorizationHeader(),
        "Content-Type": "application/json",
      },
    });
    const data = (await response.json()) as GetAllResponse;
    return data.items;
  }

  async getItemDetails(id: string): Promise<ItemDetails> {
    if (this.useMockApi) {
      if (id === "mock-finished") {
        return mockGetResponseFinished;
      }
      if (id === "mock-failed") {
        return mockGetResponseFailed;
      }
      return mockGetResponseUnFinished;
    }
    const response = await fetch(`${this.apiEndpoint}get/${id}`, {
      headers: {
        Authorization: this.authorizationHeader(),
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
}

export default ApiService;
