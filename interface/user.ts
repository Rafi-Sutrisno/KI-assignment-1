export interface UserLoginParams {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  password_AES: string;
  aes_iv: Buffer;
  health_data_RC4: string;
  income_DES: string;
  des_iv: Buffer;
}
