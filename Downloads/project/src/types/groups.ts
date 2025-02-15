export interface Document {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
}

export interface LiveSession {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  meetingUrl: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: number;
  uploadDate: string;
}

export interface Group {
  id: string;
  name: string;
  levelId: string;
  gradeId: string;
  branchId?: string;
  subjectId: string;
  teacherId: string;
  documents: Document[];
  videos: Video[];
  liveSessions: LiveSession[];
  studentCount: number;
  
}
export interface Session {
  id: string
  title: string
  date: string
  time: string
  status: "upcoming" | "live" | "ended"
}

export interface User {
  id: string
  name: string
  email: string
}
