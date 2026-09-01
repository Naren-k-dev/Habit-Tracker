import { apiRequest } from "./api";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}


// ==========================================
// LOGIN
// ==========================================

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {

  return apiRequest<LoginResponse>(
    "/api/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
}


// ==========================================
// CURRENT USER
// ==========================================

export async function getCurrentUser(): Promise<CurrentUser> {

  return apiRequest<CurrentUser>(
    "/api/auth/me"
  );
}


// ==========================================
// LOGOUT
// ==========================================

export function logout(): void {

  localStorage.removeItem(
    "access_token"
  );

}