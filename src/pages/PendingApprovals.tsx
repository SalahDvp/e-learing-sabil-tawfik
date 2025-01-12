import { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { StudentDetailsModal } from '../components/StudentDetailsModal';
import { Check, X, Eye } from 'lucide-react';

interface Subject {
  name: string;
  teacherId: string;
  teacherName: string;
}

interface PendingStudent {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  level: string;
  year: string;
  branch?: string;
  subjects: Subject[];
}

export function PendingApprovals() {
  const [selectedStudent, setSelectedStudent] = useState<PendingStudent | null>(null);

  // Mock data for pending students
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      registrationDate: '2024-03-19',
      level: 'High School',
      year: 'Year 2',
      branch: 'Scientific',
      subjects: [
        { name: 'Physics', teacherId: '1', teacherName: 'Dr. Robert Brown' },
        { name: 'Chemistry', teacherId: '2', teacherName: 'Dr. Sarah Wilson' },
      ],
    },
    {
      id: '2',
      name: 'Emma Johnson',
      email: 'emma.j@example.com',
      registrationDate: '2024-03-20',
      level: 'Middle School',
      year: 'Year 3',
      subjects: [
        { name: 'Mathematics', teacherId: '3', teacherName: 'Prof. Michael Lee' },
        { name: 'English', teacherId: '4', teacherName: 'Ms. Jennifer Parker' },
      ],
    },
  ]);

  const handleApprove = (studentId: string) => {
    setPendingStudents(students => students.filter(s => s.id !== studentId));
    setSelectedStudent(null);
  };

  const handleReject = (studentId: string) => {
    setPendingStudents(students => students.filter(s => s.id !== studentId));
    setSelectedStudent(null);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'level', label: 'Level' },
    { key: 'year', label: 'Year' },
    { key: 'registrationDate', label: 'Registration Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (student: PendingStudent) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedStudent(student)}
            className="p-1 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-100"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleApprove(student.id)}
            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
            title="Approve"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleReject(student.id)}
            className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
            title="Reject"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
          {pendingStudents.length} Students Waiting
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable<PendingStudent>
          columns={columns}
          data={pendingStudents}
        />
      </div>

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}