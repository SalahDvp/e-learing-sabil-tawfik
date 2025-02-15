import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Level, Year, Branch } from '../../types';

interface BranchSectionProps {
  level: Level;
  year: Year;
  branch: Branch;
  onAddSubject: (levelId: string, yearId: string, branchId?: string) => void;
  onRemoveSubject: (levelId: string, yearId: string, subjectId: string, branchId?: string) => void;
  onUpdateBranch: (levelId: string, yearId: string, branchId: string, name: string) => void;
}

export function BranchSection({
  level,
  year,
  branch,
  onAddSubject,
  onRemoveSubject,
  onUpdateBranch,
}: BranchSectionProps) {
  const [editing, setEditing] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-white">
      <div className="flex justify-between items-center mb-2">
        {editing ? (
          <input
            type="text"
            value={branch.name}
            onChange={(e) => onUpdateBranch(level.id, year.id, branch.id, e.target.value)}
            onBlur={() => setEditing(false)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
            autoFocus
          />
        ) : (
          <h5 
            className="font-medium text-gray-700 cursor-pointer hover:text-purple-600"
            onClick={() => setEditing(true)}
          >
            {branch.name}
          </h5>
        )}
      </div>

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
                onAddSubject(level.id, year.id, branch.id);
                setNewSubject('');
              }
            }}
            className="p-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {branch.subjects.map((subject) => (
            <span
              key={subject.id}
              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
            >
              {subject.name}
              <button
                onClick={() => onRemoveSubject(level.id, year.id, subject.id, branch.id)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}