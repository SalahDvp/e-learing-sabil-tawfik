import { useState } from "react"
import { X } from "lucide-react"
import { addGroup } from "../../lib/hooks/groups"
import type { Group } from "../../types/groups"

interface GroupModalProps {
  group?: Group
  onClose: () => void
  onSave: (group: Partial<Group>) => void
  selectedClass: { id: string }
}

export function GroupModal({ group, onClose, onSave, selectedClass }: GroupModalProps) {
  const [formData, setFormData] = useState<Partial<Group>>(
    group || {
      name: "",
      teacherName: "",
    },
  )

  const handleSaveGroup = async () => {
    try {
      const user = { role: "admin" } // Replace with actual user info
      await addGroup(formData, user, selectedClass.id)
      onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error saving group:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{group ? "Edit Group" : "Create New Group"}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg">
            Cancel
          </button>
          <button onClick={handleSaveGroup} className="px-4 py-2 text-white bg-purple-600 rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

