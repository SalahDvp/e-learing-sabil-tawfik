import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { levelData } from '../data/levelData';
import { ClassesTable } from '../components/classes/ClassesTable';
import { getClassesColumns } from '../components/classes/ClassesColumns';
import { transformClassesData } from '../utils/classesDataTransform';
import { GroupModal } from '../components/classes/GroupModal';
import { GroupsList } from '../components/classes/GroupsList';
import type { ClassData } from '../types/classes';
import type { Group } from '../types/groups';
import { useData } from '../contexts/fetchDataContext';

export function Classes() {
 
    
  // Debugging `egroup`
  const { egroup } = useData();
  console.log('egroup:', egroup);
  
  const flattenedData = useMemo(() => transformClassesData(egroup), [egroup]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);

  console.log('selectedClass',selectedClass);
  
  const columns = useMemo(
    () =>
      getClassesColumns({
        onViewGroups: (classData) => {
          setSelectedClass(classData);
          setShowGroups(true);
        },
        onAddGroup: (classData) => {
          setSelectedClass(classData);
          setShowGroupModal(true);
        },
      }),
    []
  );

  const handleSaveGroup = (groupData: Partial<Group>) => {
    if (selectedClass) {
      const newGroup: Group = {
        id: selectedClass.id,
        name: groupData.name || '',
        levelId: selectedClass.level,
        gradeId: selectedClass.grade,
        branchId: selectedClass.branch,
        subjectId: selectedClass.subject,
        teacherId: '1', // This should come from the actual teacher selection
        documents: groupData.documents || [],
        videos: groupData.videos || [],
        liveSessions: groupData.liveSessions || [],
        studentCount: 0,
      };

      setGroups([...groups, newGroup]);
      setShowGroupModal(false);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter((group) => group.id !== groupId));
  };

  return (
    <div className="space-y-6 p-6">
      {showGroups ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Groups for {selectedClass?.subject}
              </h1>
              <p className="text-gray-500">
                {selectedClass?.level} - {selectedClass?.grade}
                {selectedClass?.branch ? ` - ${selectedClass.branch}` : ''}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowGroups(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Back to Classes
              </button>
              <button
                onClick={() => setShowGroupModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </button>
            </div>
          </div>

          <GroupsList groups={groups} onDeleteGroup={handleDeleteGroup} selectedClass={selectedClass} />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">الحصص الدراسية</h1>
          </div>

          <ClassesTable data={flattenedData} columns={columns} />
        </>
      )}

      {showGroupModal && (
        <GroupModal
        selectedClass={selectedClass}
          onClose={() => setShowGroupModal(false)}
          onSave={handleSaveGroup}
        />
      )}
    </div>
  );
}