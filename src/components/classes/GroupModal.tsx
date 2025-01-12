import { useState } from 'react';
import { X, Upload, Video, Calendar } from 'lucide-react';
import { addGroup } from '../../lib/hooks/groups';
import type { Group, Document, Video as VideoType, LiveSession } from '../../types/groups';
import { levelData } from '../../data/levelData';

interface GroupModalProps {
  group?: Group;
  onClose: () => void;
  onSave: (group: Partial<Group>) => void;
}

export function GroupModal({ group, onClose, onSave,selectedClass }: GroupModalProps) {
  const [formData, setFormData] = useState<Partial<Group>>(group || {
    
    name: '',
    documents: [],
    videos: [],
    liveSessions: [],
  });

  console.log('formData',selectedClass.id);
  

  const [newDocument, setNewDocument] = useState({ name: '', url: '' });
  const [newVideo, setNewVideo] = useState({ title: '', url: '', duration: 0 });
  const [newSession, setNewSession] = useState({
    title: '',
    startTime: '',
    duration: 60,
    meetingUrl: '',
  });


  const handleAddDocument = () => {
    if (newDocument.name && newDocument.url) {
      setFormData({
        ...formData,
        documents: [
          ...(formData.documents || []),
          {
            id: Date.now().toString(),
            ...newDocument,
            uploadDate: new Date().toISOString(),
          },
        ],
      });
      setNewDocument({ name: '', url: '' });
    }
  };

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.url) {
      setFormData({
        ...formData,
        videos: [
          ...(formData.videos || []),
          {
            id: Date.now().toString(),
            ...newVideo,
            uploadDate: new Date().toISOString(),
          },
        ],
      });
      setNewVideo({ title: '', url: '', duration: 0 });
    }
  };

  const handleAddSession = () => {
    if (newSession.title && newSession.startTime && newSession.meetingUrl) {
      setFormData({
        ...formData,
        liveSessions: [
          ...(formData.liveSessions || []),
          {
            id: Date.now().toString(),
            ...newSession,
          },
        ],
      });
      setNewSession({
        title: '',
        startTime: '',
        duration: 60,
        meetingUrl: '',
      });
    }
  };

  const handleSaveGroup = async () => {
    try {
      const user = { role: 'admin' }; // Replace with actual user info
      await addGroup(formData, user,selectedClass.id); // This will now handle undefined values correctly
      onSave(formData); // Call the original onSave prop
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {group ? 'Edit Group' : 'Create New Group'}
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Documents</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Document Name"
                  value={newDocument.name}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, name: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Document URL"
                  value={newDocument.url}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, url: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handleAddDocument}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              {formData.documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span>{doc.name}</span>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Videos</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Video Title"
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, title: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Video URL"
                  value={newVideo.url}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, url: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={newVideo.duration}
                  onChange={(e) =>
                    setNewVideo({
                      ...newVideo,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-24 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handleAddVideo}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
              {formData.videos?.map((video) => (
                <div
                  key={video.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span>{video.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {video.duration} min
                    </span>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Watch
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Sessions Section */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Live Sessions</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Session Title"
                  value={newSession.title}
                  onChange={(e) =>
                    setNewSession({ ...newSession, title: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="datetime-local"
                  value={newSession.startTime}
                  onChange={(e) =>
                    setNewSession({ ...newSession, startTime: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={newSession.duration}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Meeting URL"
                  value={newSession.meetingUrl}
                  onChange={(e) =>
                    setNewSession({ ...newSession, meetingUrl: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handleAddSession}
                  className="col-span-2 px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Session
                </button>
              </div>
              {formData.liveSessions?.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(session.startTime).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {session.duration} min
                    </span>
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Join
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveGroup}
            className="px-4 py-2 text-white bg-purple-600 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
