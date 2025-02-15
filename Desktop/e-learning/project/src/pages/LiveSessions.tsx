import { useState } from 'react';
import { Calendar, Clock, Plus, Users, ChevronRight, X } from 'lucide-react';
import type { Level, Year, Branch, Subject, Teacher, LiveSession } from '../types';




export function LiveSessions() {
 
  
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

  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', subjects: ['Mathematics'], grade: 'Year 1', level: 'Elementary School' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', subjects: ['Physics'], grade: 'Year 2', level: 'Middle School' },
  ]);

  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([
    {
      id: '1',
      teacherId: '1',
      teacherName: 'John Doe',
      subject: 'Mathematics',
      grade: 'Year 1',
      startTime: '2024-03-20T10:00',
      duration: 60,
      status: 'live',
      students: [
        { id: '1', name: 'Alice Johnson', grade: 'Year 1', status: 'active' },
        { id: '2', name: 'Bob Smith', grade: 'Year 1', status: 'active' },
      ],
      waitingStudents: [
        { id: '3', name: 'Charlie Brown', grade: 'Year 1', status: 'waiting' },
        { id: '4', name: 'Diana Prince', grade: 'Year 1', status: 'waiting' },
      ],
    },
  ]);

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedYear, setSelectedYear] = useState<Year | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [newSession, setNewSession] = useState({
    startTime: '',
    duration: 60,
  });

  const handleScheduleSession = () => {
    if (!selectedTeacher || !selectedSubject || !newSession.startTime) return;

    const session: LiveSession = {
      id: Date.now().toString(),
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      subject: selectedSubject.name,
      grade: selectedYear?.name || '',
      branch: selectedBranch?.name,
      startTime: newSession.startTime,
      duration: newSession.duration,
      status: 'scheduled',
      students: [],
      waitingStudents: [],
    };

    setLiveSessions([...liveSessions, session]);
    setShowNewSessionForm(false);
    setNewSession({ startTime: '', duration: 60 });
  };

  const handleApproveStudent = (sessionId: string, studentId: string) => {
    setLiveSessions(sessions =>
      sessions.map(session => {
        if (session.id === sessionId) {
          const student = session.waitingStudents.find(s => s.id === studentId);
          if (student) {
            return {
              ...session,
              students: [...session.students, { ...student, status: 'active' }],
              waitingStudents: session.waitingStudents.filter(s => s.id !== studentId),
            };
          }
        }
        return session;
      })
    );
  };

  const handleRemoveStudent = (sessionId: string, studentId: string, fromWaitingList: boolean = false) => {
    setLiveSessions(sessions =>
      sessions.map(session => {
        if (session.id === sessionId) {
          if (fromWaitingList) {
            return {
              ...session,
              waitingStudents: session.waitingStudents.filter(s => s.id !== studentId),
            };
          }
          return {
            ...session,
            students: session.students.filter(s => s.id !== studentId),
          };
        }
        return session;
      })
    );
  };

  const getTeachersForSubject = (subject: Subject) => {
    return teachers.filter(teacher => teacher.subjects.includes(subject.name));
  };

  const getSessionsForTeacher = (teacher: Teacher) => {
    return liveSessions.filter(video => video.teacherId === teacher.id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Sessions</h1>

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

      {/* Teachers and Sessions */}
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
                  Live Sessions by {selectedTeacher.name}
                </h3>
                <button
                  onClick={() => setShowNewSessionForm(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Session
                </button>
              </div>

              {/* Schedule Session Form */}
              {showNewSessionForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Schedule New Session</h4>
                    <button
                      onClick={() => setShowNewSessionForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        value={newSession.startTime}
                        onChange={(e) =>
                          setNewSession({ ...newSession, startTime: e.target.value })
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
                        value={newSession.duration}
                        onChange={(e) =>
                          setNewSession({
                            ...newSession,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleScheduleSession}
                    className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Schedule Session
                  </button>
                </div>
              )}

              {/* Sessions List */}
              <div className="space-y-4">
                {getSessionsForTeacher(selectedTeacher).map(session => (
                  <div
                    key={session.id}
                    className="bg-white rounded-lg border border-gray-200"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {session.subject}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(session.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm">{session.duration} min</span>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              session.status === 'live'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {session.status}
                          </div>
                        </div>
                      </div>

                      {/* Student Management (only shown for live sessions) */}
                      {session.status === 'live' && (
                        <div className="border-t border-gray-100 pt-4">
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Active Students</h5>
                            <div className="space-y-2">
                              {session.students.map(student => (
                                <div
                                  key={student.id}
                                  className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                                >
                                  <span className="text-sm text-gray-900">{student.name}</span>
                                  <button
                                    onClick={() => handleRemoveStudent(session.id, student.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Waiting Students</h5>
                            <div className="space-y-2">
                              {session.waitingStudents.map(student => (
                                <div
                                  key={student.id}
                                  className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg"
                                >
                                  <span className="text-sm text-gray-900">{student.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleApproveStudent(session.id, student.id)}
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRemoveStudent(session.id, student.id, true)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
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