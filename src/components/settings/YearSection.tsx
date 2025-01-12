import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Level, Year } from '../../types';
import { BranchSection } from './BranchSection';

interface YearSectionProps {
  level: Level;
  year: Year;
  onAddBranch: (levelId: string, yearId: string) => void;
  onAddSubject: (levelId: string, yearId: string, branchId?: string) => void;
  onRemoveSubject: (levelId: string, yearId: string, subjectId: string, branchId?: string) => void;
  onUpdateBranch: (levelId: string, yearId: string, branchId: string, name: string) => void;
}

export function YearSection({
  level,
  year,
  onAddBranch,
  onAddSubject,
  onRemoveSubject,
  onUpdateBranch,
}: YearSectionProps) {
  const [newSubject, setNewSubject] = useState('');

  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800">{year.name}</h4>
        {level.name === 'High School' && (
          <button
            onClick={() => onAddBranch(level.id, year.id)}
            className="flex items-center px-2 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Branch
          </button>
        )}
      </div>

      {year.branches.length > 0 ? (
        <div className="space-y-4">
          {year.branches.map((branch) => (
            <BranchSection
              key={branch.id}
              level={level}
              year={year}
              branch={branch}
              onAddSubject={onAddSubject}
              onRemoveSubject={onRemoveSubject}
              onUpdateBranch={onUpdateBranch}
            />
          ))}
        </div>
      ) : (
        <div>
          <div className="mt-2">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Add subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md"
              />
              <button
                onClick={() => {
                  if (newSubject.trim()) {
                    onAddSubject(level.id, year.id);
                    setNewSubject('');
                  }
                }}
                className="p-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {year.subjects?.map((subject) => (
                <span
                  key={subject.id}
                  className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                >
                  {subject.name}
                  <button
                    onClick={() => onRemoveSubject(level.id, year.id, subject.id)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}