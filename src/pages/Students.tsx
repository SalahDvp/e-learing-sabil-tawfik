import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { ClassesTable } from '../components/classes/ClassesTable';
import { getStudentsColumns } from '../components/students/StudentsColumns';
import { StudentModal } from '../components/students/StudentModal';
import type { Student } from '../types/student';

export function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);

  const columns = useMemo(
    () =>
      getStudentsColumns({
        onViewStudent: (student) => {
          setSelectedStudent(student);
          setShowModal(true);
        },
        onDeleteStudent: (studentId) => {
          setStudents(students.filter((s) => s.id !== studentId));
        },
      }),
    []
  );

  const handleSaveStudent = (studentData: Partial<Student>) => {
    if (selectedStudent) {
      // Update existing student
      setStudents(
        students.map((s) =>
          s.id === selectedStudent.id ? { ...s, ...studentData } : s
        )
      );
    } else {
      // Add new student
      const newStudent: Student = {
        id: Date.now().toString(),
        registrationDate: new Date().toISOString(),
        ...studentData,
      } as Student;
      setStudents([...students, newStudent]);
    }
    setShowModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">الطلاب</h1>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setShowModal(true);
          }}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          إضافة طالب
        </button>
      </div>

      <ClassesTable data={students} columns={columns} />

      {showModal && (
        <StudentModal
          student={selectedStudent || undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedStudent(null);
          }}
          onSave={handleSaveStudent}
        />
      )}
    </div>
  );
}