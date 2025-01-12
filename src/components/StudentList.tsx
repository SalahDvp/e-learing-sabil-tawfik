import React from 'react';
import { Check, X, UserCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'active' | 'waiting';
}

interface StudentListProps {
  students: Student[];
  onApprove?: (studentId: string) => void;
  onRemove?: (studentId: string) => void;
}

export function StudentList({ students, onApprove, onRemove }: StudentListProps) {
  const activeStudents = students.filter((s) => s.status === 'active');
  const waitingStudents = students.filter((s) => s.status === 'waiting');

  return (
    <div className="space-y-6">
      {/* Waiting Students */}
      {waitingStudents.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Waiting for Approval ({waitingStudents.length})
          </h3>
          <div className="space-y-2">
            {waitingStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
              >
                <div className="flex items-center">
                  <UserCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500">{student.grade}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onApprove?.(student.id)}
                    className="p-1 hover:bg-green-100 rounded text-green-600"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemove?.(student.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Students */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Active Students ({activeStudents.length})
        </h3>
        <div className="space-y-2">
          {activeStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <div className="flex items-center">
                <UserCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500">{student.grade}</p>
                </div>
              </div>
              <button
                onClick={() => onRemove?.(student.id)}
                className="p-1 hover:bg-red-100 rounded text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}