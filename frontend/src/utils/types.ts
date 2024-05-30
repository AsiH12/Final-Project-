export type User = {
    id?: number;
    username: string;
    password: string;
    confirmPassword?: string;
    email: string;
    age: number;
  };


  export type Shop = {
    id?: number;
    name: string;
    description: string;
    owner_id: number;
    categories: string[];
    managers: string[];
  };


