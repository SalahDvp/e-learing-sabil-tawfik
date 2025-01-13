import { useState } from 'react';
import { X } from 'lucide-react';
import type { Student } from '../../types/student';
import { transformClassesData } from '../../utils/classesDataTransform';
import type { Level } from '../../types/level';
import { addStudent, addStudentToGroup } from '../../lib/hooks/student';

interface StudentModalProps {
  student?: Student;
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
  egroup: Record<string, Level>;
}

export function StudentModal({ student, onClose, onSave, egroup }: StudentModalProps) {
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
      subGroup: '',
      groupId:'',
      subGroupid:''
      
    }
  );

  const classesData = transformClassesData(egroup);


  // Get unique levels
  const levels = Array.from(new Set(classesData.map(c => c.level)));
 
  // Get grades based on selected level
  const grades = Array.from(
    new Set(
      classesData
        .filter(c => c.level === formData.level)
        .map(c => c.grade)
    )
  );


  // Get available classes (with subgroups) based on selected level and grade
  const availableClasses = classesData.filter(
    c => c.level === formData.level && c.grade === formData.grade 
  );
 
  const handleClassSelection = (selectedClassId: string) => {
    setFormData(prev => ({
      ...prev,
      groupId: selectedClassId, // Assign the selected class id directly
    }));
  };

  
  console.log("Updated Form Data:", formData);


  // Save function that calls backend to add the student and then add them to a group
  const handleSave = async () => {
    console.log("Form Data:", formData);
    try {
      const data = await addStudent(formData);
      await addStudentToGroup(data.studentId, data.studentName, formData.subGroupid, formData.groupId);
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

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
            {/* Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    level: e.target.value,
                    grade: '',
                    subGroup: [''],
                    subGroupid:''
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <select
                value={formData.grade}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    grade: e.target.value,
                    subGroup:[''],
                    subGroupid:''
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={!formData.level}
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Class and Subgroup Selection */}
            {formData.level && formData.grade && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class & Subgroup
                </label>
                <select
  value={formData.subGroup}
  onChange={(e) => {
    const selectedClass = availableClasses.find(cls =>
      Array.isArray(cls.subGroups) &&
      cls.subGroups.some(group => group.id === e.target.value)
    );

    setFormData({
      ...formData,
      subGroup: [e.target.value],
      subGroupid:e.target.value,
      branch: selectedClass?.branch || ''
    });

    handleClassSelection(selectedClass?.id || ''); // Ensure the class ID is passed
  }}
  className="w-full px-3 py-2 border rounded-lg"
>
  <option value="">Select Class & Subgroup</option>
  {availableClasses.map((cls) => (
    <optgroup key={cls.id} label={cls.description}>
      {Array.isArray(cls.subGroups) && cls.subGroups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      ))}
    </optgroup>
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
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {student ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
}
