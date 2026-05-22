export interface SignupRequest {
     name: string,
     email: string,
     password: string,
     role?: 'contributor' | 'maintainer';
}


export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: 'contributor' | 'maintainer';
  created_at: string;
  updated_at: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponse {
  token: string;
  user: UserResponse;
}