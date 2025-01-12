export interface Subject {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface Year {
  id: string;
  name: string;
  branches: Branch[];
  subjects: Subject[];
}

export interface Level {
  id: string;
  name: string;
  years: Year[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  level: string;
  grade: string;
  branch?: string;
}

export interface LiveSession {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  branch?: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'live' | 'completed';
}

export interface RecordedVideo {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  branch?: string;
  title: string;
  duration: number;
  uploadDate: string;
  url: string;
}