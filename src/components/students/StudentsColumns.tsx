import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';
import type { Student } from '../../types/student';

interface GetColumnsProps {
  onViewStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const getStudentsColumns = ({
  onViewStudent,
  onDeleteStudent,
}: GetColumnsProps): ColumnDef<Student>[] => [
  {
    accessorKey: 'name',
    header: 'الإسم',
  },
  {
    accessorKey: 'email',
    header: 'البريد الإلكتروني',
  },
  {
    accessorKey: 'phone',
    header: 'رقم الهاتف',
  },
  {
    accessorKey: 'level',
    header: 'المستوى',
  },
  {
    accessorKey: 'grade',
    header: 'السنة',
  },
  {
    accessorKey: 'branch',
    header: 'الشعبة',
    cell: ({ row }) => row.original.branch || '-',
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.original.status === 'active' ? 'نشط' : 'غير نشط'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onViewStudent(row.original)}
          className="p-1 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-100"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDeleteStudent(row.original.id)}
          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
          title="Delete Student"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];