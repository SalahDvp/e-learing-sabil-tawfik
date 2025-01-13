import { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus } from 'lucide-react';
import { ClassData } from '../../types/classes';
import { useMemo } from 'react';
interface GetColumnsProps {
  onViewGroups: (classData: ClassData) => void;
  onAddGroup: (classData: ClassData) => void;
}


export const getClassesColumns = ({
  onViewGroups,
  onAddGroup,
}: GetColumnsProps): ColumnDef<ClassData>[] => [
  
  {
    accessorKey: 'level',
    header: 'المستوى',
    cell: (info) => {
      let level = '';
      const schoolLevel = info.getValue() as string;
  
      if (schoolLevel === 'Primary School') level = 'الابتدائية';
      if (schoolLevel === 'Middle School') level = 'المتوسطة';
      if (schoolLevel === 'High School') level = 'الثانوية';
  
      return level;
    },
  }
,  
  {
    accessorKey: 'grade',
    header: 'السنة',
    cell: (info) => {
      let grade = '';
      const yearPart = info.getValue() as string;
  
      if (yearPart === 'First Year') grade = 'السنة الأولى';    
      if (yearPart === 'Second Year') grade = 'السنة الثانية';
      if (yearPart === 'Third Year') grade = 'السنة الثالثة';
      if (yearPart === 'Fourth Year') grade = 'السنة الرابعة';
      if (yearPart === 'Fifth Year') grade = 'السنة الخامسة';
  
      return grade;
    
  }
}
  ,
  {
    accessorKey: 'branch',
    header: 'الشعبة',
    cell: ({ row }) => row.original.branch || '-',
  },
  {
    accessorKey: 'subject',
    header: 'المادة',
    cell: (info) => {

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
    
  
      const subjectId = info.getValue() as string;
      return subjectMapping[subjectId] || 'غير معروف'; // Default to 'غير معروف' if the ID is not in the mapping
    },
  },
  
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onViewGroups(row.original)}
          className="p-1 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-100"
          title="View Groups"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onAddGroup(row.original)}
          className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
          title="Add Group"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];