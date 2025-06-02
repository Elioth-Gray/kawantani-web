export type TRegister = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: number | null;
  password: string;
  confirmPassword: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type DecodedToken = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  iat: number;
  exp: number;
};
