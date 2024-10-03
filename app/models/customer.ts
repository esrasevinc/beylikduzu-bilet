export interface Customer {
    id?: string;
    name: string;
    email: string;
    phone: string;
    TCNumber: string;
    address: string;
    birthDate: Date | null;
}

export interface CustomerFormValues {
    name: string;
    TCNumber: string;
    phone: string;
    email: string;
    address: string;
    birthDate: Date; 
  }