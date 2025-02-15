export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  grade: string;
  branch?: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  parentName: string;
  parentPhone: string;
}