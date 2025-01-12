import { X, Check, UserCircle, BookOpen, School, Calendar } from 'lucide-react';

interface Subject {
  name: string;
  teacherId: string;
  teacherName: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  level: string;
  year: string;
  branch?: string;
  subjects: Subject[];
}

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
  onApprove: (studentId: string) => void;
  onReject: (studentId: string) => void;
}

export function StudentDetailsModal({
  student,
  onClose,
  onApprove,
  onReject,
}: StudentDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Student Info */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <UserCircle className="w-12 h-12 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                <p className="text-gray-500">{student.email}</p>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <School className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-medium text-gray-900">{student.level}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium text-gray-900">{student.year}</p>
                </div>
              </div>
              {student.branch && (
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-medium text-gray-900">{student.branch}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="font-medium text-gray-900">{student.registrationDate}</p>
                </div>
              </div>
            </div>

            {/* Subjects and Teachers */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Selected Subjects & Teachers</h4>
              <div className="space-y-3">
                {student.subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">{subject.name}</p>
                    <p className="text-sm text-gray-500">Teacher: {subject.teacherName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={() => onReject(student.id)}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(student.id)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Approve Student
          </button>
        </div>
      </div>
    </div>
  );
}