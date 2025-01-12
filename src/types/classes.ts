export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Branch {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface Grade {
  id: string;
  name: string;
  branches?: Branch[];
  subjects?: Subject[];
}

export interface Level {
  id:any;
  title: string;
  grades: Grade[];
}

export interface ClassData {
  level: string;
  id:any;
  grade: string;
  branch?: string;
  subject: string;
  icon: string;
  description: string;
}