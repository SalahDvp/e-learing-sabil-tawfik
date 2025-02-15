import { useState } from 'react';
import { Video, Plus, Upload, X } from 'lucide-react';
import type { Level, Year, Branch, Subject, Teacher, RecordedVideo } from '../types';

interface RecordedVideo {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  branch?: string;
  title: string;
  duration: number;
  uploadDate: string;
  url: string;
}

export function RecordedContent() {
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
        ],
      })),
    },
  ]);

  // Mock teachers data
  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', subjects: ['Mathematics'], grade: 'Year 1', level: 'Elementary School' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', subjects: ['Physics'], grade: 'Year 2', level: 'Middle School' },
  ]);

  // Mock recorded videos data
  const [recordedVideos, setRecordedVideos] = useState<RecordedVideo[]>([
    {
      id: '1',
      teacherId: '1',
      teacherName: 'John Doe',
      subject: 'Mathematics',
      grade: 'Year 1',
      title: 'Introduction to Algebra',
      duration: 45,
      uploadDate: '2024-03-19',
      url: 'https://example.com/video1',
    },
  ]);

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    duration: 0,
  });

  const handleUploadVideo = () => {
    if (!selectedTeacher || !selectedSubject || !newVideo.title || !newVideo.url) return;

    const video: RecordedVideo = {
      id: Date.now().toString(),
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      subject: selectedSubject.name,
      grade: selectedYear?.name || '',
      branch: selectedBranch?.name,
      title: newVideo.title,
      duration: newVideo.duration,
      uploadDate: new Date().toISOString().split('T')[0],
      url: newVideo.url,
    };

    setRecordedVideos([...recordedVideos, video]);
    setShowUploadForm(false);
    setNewVideo({ title: '', url: '', duration: 0 });
  };

  const getTeachersForSubject = (subject: Subject) => {
    return teachers.filter(teacher => teacher.subjects.includes(subject.name));
  };

  const getVideosForTeacher = (teacher: Teacher) => {
    return recordedVideos.filter(video => video.teacherId === teacher.id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recorded Content</h1>

      {/* School Structure Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Levels */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="font-semibold text-gray-700 mb-3">Levels</h2>
          <div className="space-y-2">
            {levels.map(level => (
              <button
                key={level.id}
                onClick={() => {
                  setSelectedLevel(level);
                  setSelectedYear(null);
                  setSelectedBranch(null);
                  setSelectedSubject(null);
                  setSelectedTeacher(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  selectedLevel?.id === level.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* Years */}
        {selectedLevel && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-gray-700 mb-3">Years</h2>
            <div className="space-y-2">
              {selectedLevel.years.map(year => (
                <button
                  key={year.id}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedBranch(null);
                    setSelectedSubject(null);
                    setSelectedTeacher(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    selectedYear?.id === year.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {year.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Branches (if applicable) or Subjects */}
        {selectedYear && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {selectedYear.branches.length > 0 ? (
              <>
                <h2 className="font-semibold text-gray-700 mb-3">Branches</h2>
                <div className="space-y-2">
                  {selectedYear.branches.map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => {
                        setSelectedBranch(branch);
                        setSelectedSubject(null);
                        setSelectedTeacher(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        selectedBranch?.id === branch.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {branch.name}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-gray-700 mb-3">Subjects</h2>
                <div className="space-y-2">
                  {selectedYear.subjects?.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setSelectedTeacher(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        selectedSubject?.id === subject.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Subjects for selected branch */}
        {selectedBranch && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-gray-700 mb-3">Subjects</h2>
            <div className="space-y-2">
              {selectedBranch.subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject);
                    setSelectedTeacher(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    selectedSubject?.id === subject.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Teachers and Videos */}
      {selectedSubject && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Teachers for {selectedSubject.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTeachersForSubject(selectedSubject).map(teacher => (
              <div
                key={teacher.id}
                className={`p-4 rounded-lg border ${
                  selectedTeacher?.id === teacher.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-500'
                }`}
              >
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="w-full text-left"
                >
                  <h3 className="font-medium text-gray-900">{teacher.name}</h3>
                  <p className="text-sm text-gray-500">{teacher.email}</p>
                </button>
              </div>
            ))}
          </div>

          {selectedTeacher && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recorded Videos by {selectedTeacher.name}
                </h3>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </button>
              </div>

              {/* Upload Video Form */}
              {showUploadForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Upload New Video</h4>
                    <button
                      onClick={() => setShowUploadForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={newVideo.title}
                        onChange={(e) =>
                          setNewVideo({ ...newVideo, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={newVideo.url}
                        onChange={(e) =>
                          setNewVideo({ ...newVideo, url: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={newVideo.duration}
                        onChange={(e) =>
                          setNewVideo({
                            ...newVideo,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUploadVideo}
                    className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Upload Video
                  </button>
                </div>
              )}

              {/* Videos List */}
              <div className="space-y-4">
                {getVideosForTeacher(selectedTeacher).map(video => (
                  <div
                    key={video.id}
                    className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <Video className="w-5 h-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {video.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Uploaded on {video.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500">
                        <span className="text-sm">{video.duration} min</span>
                      </div>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >
                        Watch
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}