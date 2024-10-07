export interface UserLoginParams {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  password_AES: string;
  health_data_RC4: string;
  income_DES: string;
}
