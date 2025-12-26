export type RoleName = "admin" | "user";

export type Session = {
    user: {
    id: string;
    rut: string;
    email: string;
    role: RoleName;
  };
};
