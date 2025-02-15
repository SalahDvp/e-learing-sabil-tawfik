import { useState } from 'react';
import { X } from 'lucide-react';
import type { Student } from '../../types/student';
import { levelData } from '../../data/levelData';

interface StudentModalProps {
  student?: Student;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
}

export function StudentModal({ student, onClose, onSave }: StudentModalProps) {
  const [formData, setFormData] = useState<Partial<Student>>(
    student || {
      name: '',
      email: '',
      phone: '',
      level: '',
      grade: '',
      branch: '',
      status: 'active',
      parentName: '',
      parentPhone: '',
    }
  );

  const [selectedLevel, setSelectedLevel] = useState(formData.level || '');
  const [selectedGrade, setSelectedGrade] = useState(formData.grade || '');

  const levels = Object.entries(levelData);
  const grades = selectedLevel
    ? levelData[selectedLevel as keyof typeof levelData]?.grades || []
    : [];
  const branches =
    selectedLevel === 'high-school' && selectedGrade
      ? grades.find((g) => g.name === selectedGrade)?.branches || []
      : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'active' | 'inactive',
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Parent Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Name
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) =>
                  setFormData({ ...formData, parentName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone
              </label>
              <input
                type="tel"
                value={formData.parentPhone}
                onChange={(e) =>
                  setFormData({ ...formData, parentPhone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setSelectedGrade('');
                  setFormData({
                    ...formData,
                    level: levelData[e.target.value as keyof typeof levelData]?.title,
                    grade: '',
                    branch: '',
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Level</option>
                {levels.map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setFormData({
                    ...formData,
                    grade: e.target.value,
                    branch: '',
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={!selectedLevel}
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.name}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedLevel === 'high-school' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={!selectedGrade}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {student ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
}