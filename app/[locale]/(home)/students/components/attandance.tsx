import React , {useState} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Tabs, TabsList, TabsTrigger,TabsContent } from "@/components/ui/tabs";

import { Check, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AttendanceRecord = {
  id: string
  date: string
  status: 'present' | 'absent'
  group: string
}

type ClassAttendance = {
 
    date: string 
    id: string
    group: string
    attendanceList: any
    start: any
    end: any

}

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('id', {
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
]

const AttendanceTable: React.FC<{ data: any }> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
  )
}
export default function StudentAttendance({ student, classes }) {
    console.log('classessss', classes);
  
    // Step 1: Extract registered classes and groups from student's registered classes
    const registeredClasses = student.classesUIDs.map((classUID) => ({
      group: classUID.group,
      id: classUID.id,
    }));
  
    // Step 2: State to manage the selected group
    const [selectedGroup, setSelectedGroup] = useState('All');
  
    // Step 3: Function to handle tab click
    const handleTabClick = (group) => {
      setSelectedGroup(group);
    };
  
    // Step 4: Filtered classes based on selected tab
    const filteredClasses = selectedGroup === 'All'
      ? registeredClasses
      : registeredClasses.filter((classUID) => classUID.group === selectedGroup);
  
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">{student.name}'s Attendance</h1>
  
        <Tabs defaultValue="All">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="All" onClick={() => handleTabClick('All')}>
                Tout
              </TabsTrigger>
              {registeredClasses.map((group, index) => (
                <TabsTrigger
                  key={index}
                  value={group.group}
                  onClick={() => handleTabClick(group.group)}
                >
                  {group.group}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
  
          {/* Step 5: Render attendance tables based on the selected tab */}
          <TabsContent value="All">
            {filteredClasses.map(({ group, id }) => {
              const filteredClass = classes.find((classData) => classData.id === id);
  
              if (!filteredClass) return null;
  
              const attendanceRecords = [
                {
                  id: filteredClass.id,
                  group: filteredClass.group,
                  status:
                    filteredClass.attendanceList?.find((a) => a.id === student.id)
                      ?.status || 'absent',
                },
              ];
  
              return (
                <div key={id}>
                  <h2 className="text-xl font-semibold mb-4">Group: {group}</h2>
                  <AttendanceTable data={attendanceRecords} />
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    );
  }
