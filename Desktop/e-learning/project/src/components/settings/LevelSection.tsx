import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Level } from '../../types';
import { YearSection } from './YearSection';

interface LevelSectionProps {
  level: Level;
  onAddYear: (levelId: string) => void;
  onUpdateLevel: (levelId: string, name: string) => void;
  onAddBranch: (levelId: string, yearId: string) => void;
  onAddSubject: (levelId: string, yearId: string, branchId?: string) => void;
  onRemoveSubject: (levelId: string, yearId: string, subjectId: string, branchId?: string) => void;
  onUpdateBranch: (levelId: string, yearId: string, branchId: string, name: string) => void;
}

export function LevelSection({
  level,
  onAddYear,
  onUpdateLevel,
  onAddBranch,
  onAddSubject,
  onRemoveSubject,
  onUpdateBranch,
}: LevelSectionProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        {editing ? (
          <input
            type="text"
            value={level.name}
            onChange={(e) => onUpdateLevel(level.id, e.target.value)}
            onBlur={() => setEditing(false)}
            className="px-3 py-1 border border-gray-300 rounded-md"
            autoFocus
          />
        ) : (
          <h3 
            className="text-lg font-medium text-gray-900 cursor-pointer hover:text-purple-600"
            onClick={() => setEditing(true)}
          >
            {level.name}
          </h3>
        )}
        <button
          onClick={() => onAddYear(level.id)}
          className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Year
        </button>
      </div>

      <div className="grid gap-4">
        {level.years.map((year) => (
          <YearSection
            key={year.id}
            level={level}
            year={year}
            onAddBranch={onAddBranch}
            onAddSubject={onAddSubject}
            onRemoveSubject={onRemoveSubject}
            onUpdateBranch={onUpdateBranch}
          />
        ))}
      </div>
    </div>
  );
}