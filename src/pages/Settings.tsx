import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Level, Teacher } from '../types';
import { LevelSection } from '../components/settings/LevelSection';
import { TeacherForm } from '../components/settings/TeacherForm';
import { TeacherList } from '../components/settings/TeacherList';

export function Settings() {
  const [levels, setLevels] = useState<Level[]>([
    {
      id: '1',
      name: 'Elementary School',
      years: Array.from({ length: 5 }, (_, i) => ({
        id: `e${i + 1}`,
        name: `Year ${i + 1}`,
        branches: [],
        subjects: [
          { id: `e${i + 1}_math`, name: 'Mathematics' },
          { id: `e${i + 1}_sci`, name: 'Science' },
          { id: `e${i + 1}_eng`, name: 'English' },
          { id: `e${i + 1}_arab`, name: 'Arabic' },
          { id: `e${i + 1}_soc`, name: 'Social Studies' },
        ],
      })),
    },
    {
      id: '2',
      name: 'Middle School',
      years: Array.from({ length: 5 }, (_, i) => ({
        id: `m${i + 1}`,
        name: `Year ${i + 1}`,
        branches: [],
        subjects: [
          { id: `m${i + 1}_math`, name: 'Mathematics' },
          { id: `m${i + 1}_sci`, name: 'Science' },
          { id: `m${i + 1}_eng`, name: 'English' },
          { id: `m${i + 1}_arab`, name: 'Arabic' },
          { id: `m${i + 1}_phys`, name: 'Physics' },
          { id: `m${i + 1}_chem`, name: 'Chemistry' },
          { id: `m${i + 1}_bio`, name: 'Biology' },
        ],
      })),
    },
    {
      id: '3',
      name: 'High School',
      years: Array.from({ length: 3 }, (_, i) => ({
        id: `h${i + 1}`,
        name: `Year ${i + 1}`,
        branches: [
          {
            id: 'sci',
            name: 'Scientific',
            subjects: [
              { id: `h${i + 1}_sci_math`, name: 'Advanced Mathematics' },
              { id: `h${i + 1}_sci_phys`, name: 'Physics' },
              { id: `h${i + 1}_sci_chem`, name: 'Chemistry' },
              { id: `h${i + 1}_sci_bio`, name: 'Biology' },
            ],
          },
          {
            id: 'math',
            name: 'Mathematical',
            subjects: [
              { id: `h${i + 1}_math_calc`, name: 'Calculus' },
              { id: `h${i + 1}_math_alg`, name: 'Advanced Algebra' },
              { id: `h${i + 1}_math_stat`, name: 'Statistics' },
              { id: `h${i + 1}_math_phys`, name: 'Physics' },
            ],
          },
          {
            id: 'eng',
            name: 'Engineering',
            subjects: [
              { id: `h${i + 1}_eng_math`, name: 'Engineering Mathematics' },
              { id: `h${i + 1}_eng_phys`, name: 'Applied Physics' },
              { id: `h${i + 1}_eng_mech`, name: 'Mechanics' },
              { id: `h${i + 1}_eng_draw`, name: 'Technical Drawing' },
            ],
          },
          {
            id: 'lang',
            name: 'Foreign Language',
            subjects: [
              { id: `h${i + 1}_lang_eng`, name: 'Advanced English' },
              { id: `h${i + 1}_lang_fr`, name: 'French' },
              { id: `h${i + 1}_lang_ger`, name: 'German' },
              { id: `h${i + 1}_lang_lit`, name: 'World Literature' },
            ],
          },
          {
            id: 'phil',
            name: 'Philosophy',
            subjects: [
              { id: `h${i + 1}_phil_log`, name: 'Logic' },
              { id: `h${i + 1}_phil_eth`, name: 'Ethics' },
              { id: `h${i + 1}_phil_his`, name: 'History of Philosophy' },
              { id: `h${i + 1}_phil_arab`, name: 'Arabic Literature' },
            ],
          },
        ],
      })),
    },
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [activeTab, setActiveTab] = useState<'structure' | 'teachers'>('structure');

  const handleAddLevel = () => {
    const newLevel: Level = {
      id: Date.now().toString(),
      name: 'New Level',
      years: [],
    };
    setLevels([...levels, newLevel]);
  };

  const handleUpdateLevel = (levelId: string, name: string) => {
    setLevels(
      levels.map((level) =>
        level.id === levelId ? { ...level, name } : level
      )
    );
  };

  const handleAddYear = (levelId: string) => {
    setLevels(
      levels.map((level) => {
        if (level.id === levelId) {
          const newYear = {
            id: Date.now().toString(),
            name: `Year ${level.years.length + 1}`,
            branches: [],
            subjects: [],
          };
          return { ...level, years: [...level.years, newYear] };
        }
        return level;
      })
    );
  };

  const handleAddBranch = (levelId: string, yearId: string) => {
    setLevels(
      levels.map((level) => {
        if (level.id === levelId) {
          return {
            ...level,
            years: level.years.map((year) => {
              if (year.id === yearId) {
                const newBranch = {
                  id: Date.now().toString(),
                  name: 'New Branch',
                  subjects: [],
                };
                return { ...year, branches: [...year.branches, newBranch] };
              }
              return year;
            }),
          };
        }
        return level;
      })
    );
  };

  const handleAddSubject = (levelId: string, yearId: string, branchId?: string) => {
    setLevels(
      levels.map((level) => {
        if (level.id === levelId) {
          return {
            ...level,
            years: level.years.map((year) => {
              if (year.id === yearId) {
                if (branchId) {
                  return {
                    ...year,
                    branches: year.branches.map((branch) => {
                      if (branch.id === branchId) {
                        const newSubject = {
                          id: Date.now().toString(),
                          name: 'New Subject',
                        };
                        return {
                          ...branch,
                          subjects: [...branch.subjects, newSubject],
                        };
                      }
                      return branch;
                    }),
                  };
                } else {
                  const newSubject = {
                    id: Date.now().toString(),
                    name: 'New Subject',
                  };
                  return {
                    ...year,
                    subjects: [...(year.subjects || []), newSubject],
                  };
                }
              }
              return year;
            }),
          };
        }
        return level;
      })
    );
  };

  const handleRemoveSubject = (
    levelId: string,
    yearId: string,
    subjectId: string,
    branchId?: string
  ) => {
    setLevels(
      levels.map((level) => {
        if (level.id === levelId) {
          return {
            ...level,
            years: level.years.map((year) => {
              if (year.id === yearId) {
                if (branchId) {
                  return {
                    ...year,
                    branches: year.branches.map((branch) => {
                      if (branch.id === branchId) {
                        return {
                          ...branch,
                          subjects: branch.subjects.filter(
                            (s) => s.id !== subjectId
                          ),
                        };
                      }
                      return branch;
                    }),
                  };
                } else {
                  return {
                    ...year,
                    subjects: (year.subjects || []).filter(
                      (s) => s.id !== subjectId
                    ),
                  };
                }
              }
              return year;
            }),
          };
        }
        return level;
      })
    );
  };

  const handleUpdateBranch = (
    levelId: string,
    yearId: string,
    branchId: string,
    name: string
  ) => {
    setLevels(
      levels.map((level) => {
        if (level.id === levelId) {
          return {
            ...level,
            years: level.years.map((year) => {
              if (year.id === yearId) {
                return {
                  ...year,
                  branches: year.branches.map((branch) =>
                    branch.id === branchId ? { ...branch, name } : branch
                  ),
                };
              }
              return year;
            }),
          };
        }
        return level;
      })
    );
  };

  const handleAddTeacher = (teacher: Omit<Teacher, 'id'>) => {
    setTeachers([
      ...teachers,
      {
        ...teacher,
        id: Date.now().toString(),
      },
    ]);
  };

  const handleRemoveTeacher = (teacherId: string) => {
    setTeachers(teachers.filter((t) => t.id !== teacherId));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'structure'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          School Structure
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'teachers'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Teachers
        </button>
      </div>

      {activeTab === 'structure' ? (
        <div className="space-y-6">
          {/* School Structure */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                School Structure
              </h2>
              <button
                onClick={handleAddLevel}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Level
              </button>
            </div>

            <div className="space-y-6">
              {levels.map((level) => (
                <LevelSection
                  key={level.id}
                  level={level}
                  onAddYear={handleAddYear}
                  onUpdateLevel={handleUpdateLevel}
                  onAddBranch={handleAddBranch}
                  onAddSubject={handleAddSubject}
                  onRemoveSubject={handleRemoveSubject}
                  onUpdateBranch={handleUpdateBranch}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <TeacherForm levels={levels} onAddTeacher={handleAddTeacher} />
          <TeacherList teachers={teachers} onRemoveTeacher={handleRemoveTeacher} />
        </div>
      )}
    </div>
  );
}