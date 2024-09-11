import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AttendanceItem = {
  id: string;
  group: string;
  name: string;
  status: 'present' | 'absent';
};

type AttendanceRecord = {
  date: string;
  group: string;
  start: string;
  end: string;
  status: 'present' | 'absent';
};

const columnHelper = createColumnHelper<AttendanceRecord>();

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('group', {
    header: 'Group',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <span className="flex justify-center">
        {info.getValue() === 'present' ? (
          <Check className="text-green-500" />
        ) : (
          <X className="text-red-500" />
        )}
      </span>
    ),
  }),
  columnHelper.accessor('start', {
    header: 'Start Time',
    cell: info => new Date(info.getValue()).toLocaleTimeString(),
  }),
  columnHelper.accessor('end', {
    header: 'End Time',
    cell: info => new Date(info.getValue()).toLocaleTimeString(),
  }),
];

const AttendanceTable: React.FC<{ data: AttendanceRecord[] }> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function StudentAttendance({ student, classes }) {
  const registeredClasses = student.classesUIDs.map((classUID) => ({
    group: classUID.group,
    id: classUID.id,
  }));

  // Set the first group as the default
  const [selectedGroup, setSelectedGroup] = useState(registeredClasses[0]?.group || '');

  const handleTabClick = (group) => {
    setSelectedGroup(group);
  };

  const filteredClass = registeredClasses.find(classUID => classUID.group === selectedGroup);
  const classData = classes.find(classData => classData.id === filteredClass?.id);

  // Extract attendance data for the selected class
  const attendanceField = classData?.Attendance || {};

  const attendanceRecords: AttendanceRecord[] = Object.keys(attendanceField).map(date => {
    const { attendanceList, start, end ,group} = attendanceField[date];
    const isPresent = attendanceList?.some(record => record.id === student.id);

    return {
      date,  // The date as a string (e.g., yyyy-mm-dd)
      group: group || 'Unknown',
      status: isPresent ? 'present' : 'absent',
      start: start.toDate().toISOString(),  // Convert timestamp to string
      end: end.toDate().toISOString(),
    };
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{student.name}'s Attendance</h1>

      <Tabs value={selectedGroup} onValueChange={handleTabClick}>
        <div className="flex items-center">
          <TabsList>
            {registeredClasses.map((classUID, index) => (
              <TabsTrigger
                key={index}
                value={classUID.group}
              >
                {classUID.group}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Render only the selected group's attendance */}
        {registeredClasses.map(({ group, id }) => (
          <TabsContent key={id} value={group}>
            <h2 className="text-xl font-semibold mb-4">Group: {group}</h2>
            <AttendanceTable data={attendanceRecords} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}