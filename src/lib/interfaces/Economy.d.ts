export interface UserData {
  id: string;
  balance: number;
  bank: number;
  bankCap: number;
  gangId: string;
}

export interface TopTenUser {
  id: string;
  summed: number;
}

export interface Gang {
  id?: string;
  name: string;
  members: string[];
  balance: number;
}
