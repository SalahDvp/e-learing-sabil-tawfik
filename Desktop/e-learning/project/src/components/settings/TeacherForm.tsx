import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Level, Year, Branch, Teacher } from '../../types';

interface TeacherFormProps {
  levels: Level[];
  onAddTeacher: (teacher: Omit<Teacher, 'id'>) => void;
}

export function TeacherForm({ levels, onAddTeacher }: TeacherFormProps) {
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({});
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleSubmit = () => {
    if (newTeacher.name && newTeacher.email && selectedYear) {
      onAddTeacher({
        name: newTeacher.name,
        email: newTeacher.email,
        subjects: newTeacher.subjects || [],
        grade: selectedYear.name,
        level: selectedLevel?.name || '',
        branch: selectedBranch?.name,
      });
      setNewTeacher({});
      setSelectedLevel(null);
      setSelectedYear(null);
      setSelectedBranch(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Teacher</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Teacher Name"
          value={newTeacher.name || ''}
          onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={newTeacher.email || ''}
          onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Level Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Level</label>
        <div className="grid grid-cols-3 gap-2">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedYear(null);
                setSelectedBranch(null);
              }}
              className={`p-2 rounded-lg border ${
                selectedLevel?.id === level.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-500'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      {/* Year Selection */}
      {selectedLevel && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
          <div className="grid grid-cols-5 gap-2">
            {selectedLevel.years.map((year) => (
              <button
                key={year.id}
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedBranch(null);
                }}
                className={`p-2 rounded-lg border ${
                  selectedYear?.id === year.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-500'
                }`}
              >
                {year.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Branch Selection (only for High School) */}
      {selectedLevel?.name === 'High School' && selectedYear && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch</label>
          <div className="grid grid-cols-3 gap-2">
            {selectedYear.branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch)}
                className={`p-2 rounded-lg border ${
                  selectedBranch?.id === branch.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-500'
                }`}
              >
                {branch.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subject Selection */}
      {selectedYear && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Subjects</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(selectedBranch ? selectedBranch.subjects : selectedYear.subjects || []).map((subject) => (
              <label
                key={subject.id}
                className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:border-purple-500"
              >
                <input
                  type="checkbox"
                  checked={(newTeacher.subjects || []).includes(subject.name)}
                  onChange={(e) => {
                    const subjects = new Set(newTeacher.subjects || []);
                    if (e.target.checked) {
                      subjects.add(subject.name);
                    } else {
                      subjects.delete(subject.name);
                    }
                    setNewTeacher({
                      ...newTeacher,
                      subjects: Array.from(subjects),
                    });
                  }}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">{subject.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!newTeacher.name || !newTeacher.email || !selectedYear}
        className="mt-4 flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Teacher
      </button>
    </div>
  );
}