export type RoleName = "admin" | "user";

export type Session = {
  user: {
    id: string;
    email: string;
    role: RoleName;
  };
};
