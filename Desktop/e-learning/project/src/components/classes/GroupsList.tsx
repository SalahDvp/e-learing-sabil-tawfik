"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Trash2, Video, Calendar, FileText, Upload, Plus, X, Check, AlertCircle } from "lucide-react"
import type { Group, Session, User } from "../../types/groups"

interface GroupsListProps {
  groups: Group[]
  onDeleteGroup: (groupId: string) => void
  selectedClass: any
}

type SectionType = "documents" | "videos" | "sessions" | null

export function GroupsList({ groups, onDeleteGroup, selectedClass }: GroupsListProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [activeSection, setActiveSection] = useState<SectionType>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [acceptedUsers, setAcceptedUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSectionClick = (subGroup: Group, section: SectionType) => {
    setSelectedGroup(subGroup)
    setActiveSection(section)
  }

  const handleClose = () => {
    setSelectedGroup(null)
    setActiveSection(null)
    setCurrentSession(null)
    setPendingUsers([])
    setAcceptedUsers([])
    setError(null)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (!files.length || !activeSection) return

      console.log(`Uploading files to ${activeSection}:`, files)

      files.forEach((file) => {
        const fileDetails = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type,
          lastModified: new Date(file.lastModified).toLocaleString(),
        }
        console.log("File details:", fileDetails)
      })
    },
    [activeSection],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    console.log(`Uploading files to ${activeSection}:`, files)
  }

  const handleNewSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string

    if (!title || !date || !time) {
      setError("Please fill in all fields")
      return
    }

    if (selectedGroup?.liveSessions?.some((session) => session.status === "live")) {
      setError("A session is currently live. You can't create a new session until the current one ends.")
      return
    }

    const sessionData: Session = {
      id: Date.now().toString(),
      title,
      date,
      time,
      status: "live",
    }

    setCurrentSession(sessionData)
    setError(null)
    e.currentTarget.reset()

    // Update the selectedGroup with the new session
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        liveSessions: [...(selectedGroup.liveSessions || []), sessionData],
      }
      setSelectedGroup(updatedGroup)
    }
  }

  const handleAcceptUser = (user: User) => {
    setPendingUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
    setAcceptedUsers((prevUsers) => [...prevUsers, user])
  }

  const handleRejectUser = (userId: string) => {
    setPendingUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
  }

  const handleEndSession = () => {
    if (currentSession && selectedGroup) {
      const updatedSessions = selectedGroup.liveSessions?.map((session) =>
        session.id === currentSession.id ? { ...session, status: "ended" } : session,
      )
      const updatedGroup = { ...selectedGroup, liveSessions: updatedSessions }
      setSelectedGroup(updatedGroup)
    }
    setCurrentSession(null)
    setAcceptedUsers([])
    setPendingUsers([])
  }

  const handleViewLiveSession = (session: Session) => {
    setCurrentSession(session)
    // Reset users when viewing a different session
    setAcceptedUsers([])
    setPendingUsers([])
  }

  useEffect(() => {
    if (currentSession) {
      const timer = setInterval(() => {
        const newUser: User = {
          id: Date.now().toString(),
          name: `User ${Math.floor(Math.random() * 1000)}`,
          email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        }
        setPendingUsers((prevUsers) => [...prevUsers, newUser])
      }, 5000) // Add a new pending user every 5 seconds

      return () => clearInterval(timer)
    }
  }, [currentSession])

  const renderDropZone = () => {
    if (activeSection === "sessions") return null

    const colors = {
      documents: "border-indigo-500 bg-indigo-50 hover:border-indigo-600",
      videos: "border-rose-500 bg-rose-50 hover:border-rose-600",
    }

    return (
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-8 transition-all ${
          isDragging ? colors[activeSection as "documents" | "videos"] : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-center">
          <Upload className={`mb-4 h-10 w-10 ${activeSection === "documents" ? "text-indigo-500" : "text-rose-500"}`} />
          <p className="mb-2 text-sm text-gray-600">
            Drag and drop your {activeSection === "documents" ? "documents" : "videos"} here
          </p>
          <p className="mb-4 text-xs text-gray-500">or</p>
          <label
            className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
              activeSection === "documents" ? "bg-indigo-500 hover:bg-indigo-600" : "bg-rose-500 hover:bg-rose-600"
            }`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Choose Files
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileInput}
              accept={activeSection === "documents" ? ".pdf,.doc,.docx,.txt" : "video/*"}
            />
          </label>
        </div>
      </div>
    )
  }

  const renderSessionContent = () => {
    const hasLiveSession = selectedGroup?.liveSessions?.some((session) => session.status === "live")

    if (!currentSession) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Session Management</h3>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          {hasLiveSession ? (
            <div className="mb-4 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    A session is currently live. You can't create a new session until the current one ends.
                  </h3>
                </div>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Current Session: {currentSession.title}</h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Date: {currentSession.date}</p>
          <p className="text-sm text-gray-600">Time: {currentSession.time}</p>
          <p className="text-sm font-medium text-emerald-600">Status: {currentSession.status}</p>
        </div>
        <div className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Accepted Users ({acceptedUsers.length})</h4>
          {acceptedUsers.length > 0 ? (
            <ul className="max-h-40 space-y-2 overflow-y-auto">
              {acceptedUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                  <span>{user.name}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No accepted users yet</p>
          )}
        </div>
        <div className="mb-6">
          <h4 className="mb-2 font-medium text-gray-700">Pending Users ({pendingUsers.length})</h4>
          {pendingUsers.length > 0 ? (
            <ul className="max-h-40 space-y-2 overflow-y-auto">
              {pendingUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                  <span>{user.name}</span>
                  <div>
                    <button
                      onClick={() => handleAcceptUser(user)}
                      className="mr-2 rounded-full bg-green-100 p-1 text-green-600 hover:bg-green-200"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRejectUser(user.id)}
                      className="rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No pending users</p>
          )}
        </div>
        <button
          onClick={handleEndSession}
          className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          End Session
        </button>
      </div>
    )
  }

  const renderSideSheetContent = () => {
    if (!selectedGroup) return null

    switch (activeSection) {
      case "documents":
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

      case "videos":
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
                      src={video.thumbnail || "/placeholder.svg"}
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

      case "sessions":
        return (
          <div className="space-y-6">
            {renderSessionContent()}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">All Sessions</h3>
              {selectedGroup.liveSessions?.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">{session.title}</h4>
                        <div className="flex gap-2 text-sm text-gray-500">
                          <span>{session.date}</span>
                          <span>•</span>
                          <span>{session.time}</span>
                        </div>
                        <span className={`text-sm ${session.status === "live" ? "text-emerald-500" : "text-gray-500"}`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {session.status === "live" && (
                      <button
                        onClick={() => handleViewLiveSession(session)}
                        className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-200"
                      >
                        View
                      </button>
                    )}
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
          <div key={subGroup.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{subGroup.name}</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{subGroup.studentCount} students</span>
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
                onClick={() => handleSectionClick(subGroup, "documents")}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-indigo-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm"
              >
                <FileText className="h-5 w-5" />
                Documents
              </button>
              <button
                onClick={() => handleSectionClick(subGroup, "videos")}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium text-rose-500 transition-all hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm"
              >
                <Video className="h-5 w-5" />
                Videos
              </button>
              <button
                onClick={() => handleSectionClick(subGroup, "sessions")}
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
          <div className="h-[calc(100vh-4rem)] overflow-y-auto p-6">{renderSideSheetContent()}</div>
        </div>



      )}
    </>
  )
}

