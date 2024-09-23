export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Users = {
  items: User[];
};
