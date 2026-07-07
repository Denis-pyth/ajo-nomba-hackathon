const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ajo-backend-ua6o.onrender.com";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  payoutSlot: number | null;
  hasReceivedPayout: boolean;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  mode: "CLASSIC" | "PURPOSE_BOUND" | "AGENT_LED";
  contributionAmount: number;
  cycleFrequency: "WEEKLY" | "MONTHLY";
  nombaVirtualAccountId: string | null;
  targetMerchantId: string | null;
  status: "PENDING" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  members?: GroupMember[];
  memberCount?: number;
  mySlot?: number;
  hasReceivedPayout?: boolean;
  joinedAt?: string;
}

export interface CreateGroupRequest {
  name: string;
  mode: "CLASSIC" | "PURPOSE_BOUND" | "AGENT_LED";
  contributionAmount: number;
  cycleFrequency: "WEEKLY" | "MONTHLY";
  targetMerchantId?: string;
}

export interface JoinGroupRequest {
  userId: string;
}

export interface UpdateBankDetailsRequest {
  bankCode: string;
  bankAccountNumber: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("ajo_token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If JSON parsing fails, use default message
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createGroup(data: CreateGroupRequest): Promise<Group> {
  return fetchApi<Group>("/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function joinGroup(id: string, data: JoinGroupRequest): Promise<GroupMember> {
  return fetchApi<GroupMember>(`/groups/${id}/join`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllGroups(): Promise<Group[]> {
  return fetchApi<Group[]>("/groups", {
    method: "GET",
  });
}

export async function updateBankDetails(data: UpdateBankDetailsRequest): Promise<{ message: string; bankCode: string; bankAccountNumber: string }> {
  return fetchApi<{ message: string; bankCode: string; bankAccountNumber: string }>("/users/profile/bank", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
