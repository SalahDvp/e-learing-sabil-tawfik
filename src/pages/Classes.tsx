import { useMemo, useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { ClassesTable } from "../components/classes/ClassesTable"
import { getClassesColumns } from "../components/classes/ClassesColumns"
import { transformClassesData } from "../utils/classesDataTransform"
import { GroupModal } from "../components/classes/GroupModal"
import { GroupsList } from "../components/classes/GroupsList"
import type { ClassData } from "../types/classes"
import type { Group } from "../types/groups"
import { useData } from "../contexts/fetchDataContext"

export function Classes() {
  const { egroup, setEgroup } = useData()
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showGroups, setShowGroups] = useState(false)

  const flattenedData = useMemo(() => transformClassesData(egroup), [egroup])

  const columns = useMemo(
    () =>
      getClassesColumns({
        onViewGroups: (classData) => {
          setSelectedClass(classData)
          setShowGroups(true)
        },
        onAddGroup: (classData) => {
          setSelectedClass(classData)
          setShowGroupModal(true)
        },
      }),
    [],
  )

  const handleSaveGroup = useCallback(
    (groupData: Group) => {
      console.log("Saving new group:", groupData)

      setEgroup((prevEgroup) => {
        return prevEgroup.map((classItem) => {
          if (classItem.id === selectedClass?.id) {
            return {
              ...classItem,
              subGroups: [...(classItem.subGroups || []), groupData],
            }
          }
          return classItem
        })
      })

      setShowGroupModal(false)
    },
    [selectedClass, setEgroup],
  )

  const handleDeleteGroup = useCallback(
    (groupId: string) => {
      setEgroup((prevEgroup) => {
        return prevEgroup.map((classItem) => {
          if (classItem.id === selectedClass?.id) {
            return {
              ...classItem,
              subGroups: classItem.subGroups?.filter((group) => group.id !== groupId) || [],
            }
          }
          return classItem
        })
      })
    },
    [selectedClass, setEgroup],
  )

  const filteredGroups = useMemo(() => {
    if (!selectedClass) {
      console.log("No class selected")
      return []
    }

    const classData = egroup.find((c) => c.id === selectedClass.id)
    console.log("Selected class:", selectedClass)
    console.log("Filtered groups:", classData?.subGroups || [])

    return classData?.subGroups || []
  }, [selectedClass, egroup])

  return (
    <div className="space-y-6 p-6">
      {showGroups ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Groups for {selectedClass?.name}</h1>
              <p className="text-gray-500">
                {selectedClass?.level} - {selectedClass?.grade}
                {selectedClass?.branch ? ` - ${selectedClass.branch}` : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowGroups(false)} className="px-4 py-2 text-gray-700 hover:text-gray-900">
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

          <GroupsList groups={filteredGroups} onDeleteGroup={handleDeleteGroup} selectedClass={selectedClass} />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">الحصص الدراسية</h1>
          </div>

          <ClassesTable data={flattenedData} columns={columns} />
        </>
      )}

      {showGroupModal && selectedClass && (
        <GroupModal selectedClass={selectedClass} onClose={() => setShowGroupModal(false)} onSave={handleSaveGroup} />
      )}
    </div>
  )
}

