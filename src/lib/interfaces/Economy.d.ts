export interface UserData {
  id: string;
  balance: bigint;
  bank: bigint;
  bankCap: bigint;
  gangId?: string;
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
