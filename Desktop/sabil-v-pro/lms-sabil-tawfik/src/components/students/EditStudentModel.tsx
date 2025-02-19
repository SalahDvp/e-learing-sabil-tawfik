import { X } from 'lucide-react';
import type { Student } from '../../types/student';
import { transformClassesData } from '../../utils/classesDataTransform';
import type { Level } from '../../types/level';

interface EditStudentModalProps {
  student: Student;
  onClose: () => void;
  onSave: (student: Student) => void;
  egroup: Record<string, Level>;
  setEStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  eStudents: Student[];
}

const levelMapping: Record<string, string> = {
  elementary: 'Elementary',
  middle: 'Middle School',
  high: 'High School'
};

const subjectMapping = {
  'math': 'الرياضيات 📐',
  'Mathematics': 'الرياضيات 📐',
  ' math': 'الرياضيات 📐',
  'physics': 'الفيزياء ⚡',
  'civil-engineering': 'هندسة مدنية 🏗️',
  'electrical-engineering': 'هندسة كهربائية 🔌',
  'process-engineering': 'هندسة الطرائق 🛠️',
  'mechanical-engineering': 'هندسة ميكانيكية ⚙️',
  'history': 'التاريخ 🌍',
  'geography': 'الجغرافيا 🗺️',
  'history-geography': 'تاريخ و جغرافيا 🌍🗺️',
  'french': 'فرنسية 🇫🇷',
  'english': 'إنجليزية 🇬🇧',
  'arabic': 'عربية 🖋️',
  'civil': 'تربية مدنية 🏛️',
  'islamic': 'تربية إسلامية 🕌',
  'science': 'العلوم 🧪',
  'biology': 'علوم الطبيعة والحياة 🌱',
  'chemistry': 'الكيمياء 🧫',
  'philosophy': 'الفلسفة 📜',
  'economics': 'الاقتصاد 💰',
  'management': 'التسيير 🧾',
  'computing': 'الإعلام الآلي 💻',
  'literature': 'الآداب 📖',
  'arts': 'الفنون 🎨',
  'music': 'الموسيقى 🎼',
  'sports': 'التربية البدنية والرياضية 🏅',
  'sociology': 'علم الاجتماع 🧑‍🤝‍🧑',
  'psychology': 'علم النفس 🧠',
  'statistics': 'الإحصاء 📊',
  'logic': 'المنطق 🔢',
  'environment': 'علوم البيئة 🌳',
  'astronomy': 'علم الفلك 🌌',
  'computer-science': 'علوم الكمبيوتر 💾',
  'business-administration': 'إدارة الأعمال 📂',
  'foreign-languages': 'لغات أجنبية 🌏',
  'media-studies': 'علوم الإعلام 📰',
  'electrotechnics': 'تقنيات كهربائية ⚡',
  'mechanical-systems': 'أنظمة ميكانيكية ⚙️',
  'materials-science': 'علوم المواد 🧱',
  'robotics': 'الروبوتات 🤖',
  'cultural-studies': 'الدراسات الثقافية 🏺',
  'international-relations': 'العلاقات الدولية 🌍',
  'law': 'القانون ⚖️'
};

const translateDescription = (description: string): string => {
  return description
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function EditStudentModal({ student, onClose, onSave, egroup, setEStudents, eStudents }: EditStudentModalProps) {
  const [formData, setFormData] = useState<Student>(student);

  const classesData = transformClassesData(egroup);
  const levels = Array.from(new Set(classesData.map(c => c.level)));
 
  const grades = Array.from(
    new Set(
      classesData
        .filter(c => c.level === formData.level)
        .map(c => c.grade)
    )
  ).sort((a, b) => {
    const gradeOrder = Object.keys(subjectMapping);
    return gradeOrder.indexOf(a) - gradeOrder.indexOf(b);
  });

  const availableClasses = classesData.filter(
    c => c.level === formData.level && c.grade === formData.grade 
  );
 
  const handleClassSelection = (selectedClassId: string, selected: boolean) => {
    setFormData(prev => ({
      ...prev,
      groupIds: selected 
        ? [...(prev.groupIds || []), selectedClassId]
        : (prev.groupIds || []).filter(id => id !== selectedClassId),
    }));
  };

  const handleSubgroupSelection = (classId: string, subgroupId: string, selected: boolean) => {
    if (selected) {
      setFormData(prev => ({
        ...prev,
        groupIds: [...new Set([...(prev.groupIds || []), classId])],
        subGroups: [...new Set([...(prev.subGroups || []), subgroupId])],
        subGroupIds: [...new Set([...(prev.subGroupIds || []), subgroupId])]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subGroups: (prev.subGroups || []).filter(id => id !== subgroupId),
        subGroupIds: (prev.subGroupIds || []).filter(id => id !== subgroupId)
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Update the student in Firestore
      await updateStudent(formData.id, formData);
      
      // Update the students list in the frontend
      setEStudents(prevStudents => 
        prevStudents.map(s => s.id === formData.id ? formData : s)
      );
      
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Student: {student.name}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Student Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="student@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Branch"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Name
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Parent Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone
              </label>
              <input
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Parent Phone"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    level: e.target.value,
                    grade: '',
                    groupIds: [],
                    subGroups: [],
                    subGroupIds: [],
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Level</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {levelMapping[level] || level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <select
                value={formData.grade}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    grade: e.target.value,
                    groupIds: [],
                    subGroups: [],
                    subGroupIds: [],
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={!formData.level}
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {subjectMapping[grade] || grade}
                  </option>
                ))}
              </select>
            </div>

            {formData.level && formData.grade && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classes & Subgroups
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {availableClasses.map((cls) => (
                    <div key={cls.id} className="space-y-2">
                      <div className="font-medium text-gray-700">
                        {translateDescription(cls.description)}
                      </div>
                      <div className="ml-4 space-y-1">
                        {Array.isArray(cls.subGroups) && cls.subGroups.map((group) => (
                          <label key={group.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={(formData.subGroups || []).includes(group.id)}
                              onChange={(e) => handleSubgroupSelection(cls.id, group.id, e.target.checked)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{group.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditStudentModal;