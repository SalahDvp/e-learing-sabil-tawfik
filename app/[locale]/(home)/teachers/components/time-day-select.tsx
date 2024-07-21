/**
 * v0 by Vercel.
 * @see https://v0.dev/t/izR8PFNkT0o
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function Dayselection() {
  const [schedule, setSchedule] = useState([
    {
      day: "Monday",
      startTime: "09:00",
      endTime: "17:30",
    },
    {
       day: "Monday",
       startTime: "09:00",
       endTime: "17:30",
     },
     {
       day: "Monday",
       startTime: "09:00",
       endTime: "17:30",
     },
     {
       day: "Monday",
       startTime: "09:00",
       endTime: "17:30",
     },
     {
       day: "Monday",
       startTime: "09:00",
       endTime: "17:30",
     },
  ])
  const addDay = () => {
    setSchedule([
      ...schedule,
      {
        day: "New Day",
        startTime: "09:00",
        endTime: "17:30",
      },
    ])
  }
  const removeDay = (index) => {
    const newSchedule = [...schedule]
    newSchedule.splice(index, 1)
    setSchedule(newSchedule)
  }
  const updateStartTime = (index, hours, minutes) => {
    const newSchedule = [...schedule]
    newSchedule[index].startTime = `${hours.toString().padStart(2, "0")}:${(Math.floor(minutes / 5) * 5)
      .toString()
      .padStart(2, "0")}`
    setSchedule(newSchedule)
  }
  const updateEndTime = (index, hours, minutes) => {
    const newSchedule = [...schedule]
    newSchedule[index].endTime = `${hours.toString().padStart(2, "0")}:${(Math.floor(minutes / 5) * 5)
      .toString()
      .padStart(2, "0")}`
    setSchedule(newSchedule)
  }
  const updateDay = (index, day) => {
    const newSchedule = [...schedule]
    newSchedule[index].day = day
    setSchedule(newSchedule)
  }
  const clearSchedule = () => {
    setSchedule([])
  }
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Schedule Availability</CardTitle>
        <CardDescription>Select the days and times you are available to meet.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto">
        <div className="grid gap-6">
          {schedule.map((day, index) => (
            <div key={index} className="grid grid-cols-[1fr_auto] items-center gap-4">
              <div className="grid gap-2">
                <div className="font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2">
                      {day.day}
                      <ChevronDownIcon className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => updateDay(index, "Monday")}>Monday</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateDay(index, "Tuesday")}>Tuesday</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateDay(index, "Wednesday")}>Wednesday</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateDay(index, "Thursday")}>Thursday</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateDay(index, "Friday")}>Friday</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateDay(index, "Saturday")}>Saturday</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateDay(index, "Sunday")}>Sunday</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Select
                      value={parseInt(day.startTime.split(":")[0])}
                      onValueChange={(hours) => updateStartTime(index, hours, parseInt(day.startTime.split(":")[1]))}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-auto">
                        {[...Array(24)].map((_, i) => (
                          <SelectItem key={i} value={i}>
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Separator orientation="vertical" />
                    <Select
                      value={parseInt(day.startTime.split(":")[1])}
                      onValueChange={(minutes) =>
                        updateStartTime(index, parseInt(day.startTime.split(":")[0]), minutes)
                      }
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-auto">
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i * 5} value={i * 5}>
                            {(i * 5).toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex items-center gap-2">
                    <Select
                      value={parseInt(day.endTime.split(":")[0])}
                      onValueChange={(hours) => updateEndTime(index, hours, parseInt(day.endTime.split(":")[1]))}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-auto">
                        {[...Array(24)].map((_, i) => (
                          <SelectItem key={i} value={i}>
                            {i.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Separator orientation="vertical" />
                    <Select
                      value={parseInt(day.endTime.split(":")[1])}
                      onValueChange={(minutes) => updateEndTime(index, parseInt(day.endTime.split(":")[0]), minutes)}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-auto">
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i * 5} value={i * 5}>
                            {(i * 5).toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDay(index)}
                className="text-red-500 hover:bg-red-500/10"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="sr-only">Remove day</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="outline" onClick={addDay}>
          <PlusIcon className="w-5 h-5" />
          <span className="sr-only">Add Day</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={clearSchedule}>
            Clear Schedule
          </Button>
          <Button type="submit">Save Schedule</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}