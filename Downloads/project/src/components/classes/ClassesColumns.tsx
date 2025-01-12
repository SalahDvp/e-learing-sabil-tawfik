import { ColumnDef } from '@tanstack/react-table';
import { Eye, Plus } from 'lucide-react';
import { ClassData } from '../../types/classes';

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
  
      if (schoolLevel === 'Primary School') level = 'المدرسة الابتدائية';
      if (schoolLevel === 'Middle School') level = 'المدرسة المتوسطة';
      if (schoolLevel === 'High School') level = 'المدرسة الثانوية';
  
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
  
  },
  {
    accessorKey: 'description',
    header: 'الوصف',
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