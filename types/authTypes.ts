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
