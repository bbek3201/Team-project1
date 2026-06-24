export type Creator = {
  username: string;
  name: string;
  avatar: string;
  about: string;
  socialMediaURL: string;
  backgroundImage: string;
  successMessage: string;
};

export type Supporter = {
  id: number;
  name: string;
  avatar: string;
  socialURL: string;
  amount: number;
  message: string;
  createdAt: string;
};

export const AMOUNTS = [1, 2, 5, 10];
