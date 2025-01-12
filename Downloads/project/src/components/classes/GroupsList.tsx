import { useState, useCallback } from 'react'
import { Trash2, Video, Calendar, FileText, Upload, Plus, X } from 'lucide-react'
import type { Group } from '../../types/groups'

interface GroupsListProps {
  groups: Group[]
  onDeleteGroup: (groupId: string) => void
  selectedClass: any
}

type SectionType = 'documents' | 'videos' | 'sessions' | null

export function GroupsList({ groups, onDeleteGroup, selectedClass }: GroupsListProps) {
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null)
  const [activeSection, setActiveSection] = useState<SectionType>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSectionClick = (subGroup: any, section: SectionType) => {
    setSelectedGroup(subGroup)
    setActiveSection(section)
  }

  const handleClose = () => {
    setSelectedGroup(null)
    setActiveSection(null)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (!files.length || !activeSection) return

    console.log(`Uploading files to ${activeSection}:`, files)
    
    files.forEach(file => {
      const fileDetails = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleString()
      }
      console.log('File details:', fileDetails)
    })
  }, [activeSection])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    console.log(`Uploading files to ${activeSection}:`, files)
  }

  const handleNewSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const sessionData = {
      title: formData.get('title'),
      date: formData.get('date'),
      time: formData.get('time'),
    }
    
    console.log('New session data:', sessionData)
    e.currentTarget.reset()
  }

  const renderDropZone = () => {
    if (activeSection === 'sessions') return null

    const colors = {
      documents: 'border-indigo-500 bg-indigo-50 hover:border-indigo-600',
      videos: 'border-rose-500 bg-rose-50 hover:border-rose-600'
    }

    return (
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 transition-all ${
          isDragging
            ? colors[activeSection as 'documents' | 'videos']
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex flex-col items-center">
          <Upload className={`mb-4 h-10 w-10 ${
            activeSection === 'documents' ? 'text-indigo-500' : 'text-rose-500'
          }`} />
          <p className="mb-2 text-sm text-gray-600">
            Drag and drop your {activeSection === 'documents' ? 'documents' : 'videos'} here
          </p>
          <p className="mb-4 text-xs text-gray-500">or</p>
          <label className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
            activeSection === 'documents' 
              ? 'bg-indigo-500 hover:bg-indigo-600' 
              : 'bg-rose-500 hover:bg-rose-600'
          }`}>
            <Plus className="mr-2 h-4 w-4" />
            Choose Files
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileInput}
              accept={activeSection === 'documents' ? '.pdf,.doc,.docx,.txt' : 'video/*'}
            />
          </label>
        </div>
      </div>
    )
  }

  const renderSideSheetContent = () => {
    if (!selectedGroup) return null

    switch (activeSection) {
      case 'documents':
        return (
          <div className="space-y-6">
            {renderDropZone()}
            <div className="space-y-4">
              {selectedGroup.documents?.map((doc: any) => (
                <div
                  key={doc.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <div className="flex gap-2 text-sm text-gray-500">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'videos':
        return (
          <div className="space-y-6">
            {renderDropZone()}
            <div className="space-y-4">
              {selectedGroup.videos?.map((video: any) => (
                <div
                  key={video.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-rose-200"
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <span className="text-sm text-gray-500">{video.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'sessions':
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Schedule New Session</h3>
              <form onSubmit={handleNewSession} className="space-y-4">
                <div>
                  <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                    Session Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="mb-1 block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
                >
                  Schedule Session
                </button>
              </form>
            </div>
            <div className="space-y-4">
              {selectedGroup.liveSessions?.map((session: any) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-emerald-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <div className="flex gap-2 text-sm text-gray-500">
                        <span>{session.date}</span>
                        <span>•</span>
                        <span>{session.time}</span>
                      </div>
                      <span className={`text-sm ${
                        session.status === 'upcoming' ? 'text-emerald-500' : 'text-gray-500'
                      }`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="space-y-4">
        {selectedClass.subGroups.map((subGroup: any) => (
          <div
            key={subGroup.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{subGroup.name}</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {subGroup.studentCount} students
                </span>
                <button
                  onClick={() => onDeleteGroup(subGroup.id)}
                  className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleSectionClick(subGroup, 'documents')}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-indigo-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
              >
                <FileText className="h-5 w-5" />
                Documents
              </button>
              <button
                onClick={() => handleSectionClick(subGroup, 'videos')}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-rose-500 transition-all hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm"
              >
                <Video className="h-5 w-5" />
                Videos
              </button>
              <button
                onClick={() => handleSectionClick(subGroup, 'sessions')}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-emerald-500 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm"
              >
                <Calendar className="h-5 w-5" />
                Sessions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Side Sheet */}
      {selectedGroup && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-gray-200 bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
            <h2 className="text-lg font-medium text-gray-900">{selectedGroup.name}</h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
            {renderSideSheetContent()}
          </div>
        </div>
      )}
    </>
  )
}
