'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for demonstration
const usersActions = [
  {
    id: 1,
    name: "User X",
    actions: [
      { id: 1, type: "payment", description: "Got payment for student Adam", amount: 3000, currency: "DZD", date: "2024-09-29T14:00:00" },
      { id: 2, type: "create_student", description: "Created student Roger", subscription: 500, currency: "DZD", date: "2024-09-20T09:00:00" },
      { id: 3, type: "login", description: "Logged in", date: "2024-09-29T08:30:00" },
      { id: 4, type: "logout", description: "Logged out", date: "2024-09-29T17:45:00" },
    ]
  },
  {
    id: 2,
    name: "User Y",
    actions: [
      { id: 5, type: "payment", description: "Got payment for student Sarah", amount: 2500, currency: "DZD", date: "2024-09-28T10:30:00" },
      { id: 6, type: "create_student", description: "Created student Emma", subscription: 600, currency: "DZD", date: "2024-09-22T11:15:00" },
      { id: 7, type: "login", description: "Logged in", date: "2024-09-28T09:00:00" },
      { id: 8, type: "logout", description: "Logged out", date: "2024-09-28T18:00:00" },
    ]
  },
]

export default function AdminTrackRole() {
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date>()
  const [actionType, setActionType] = useState("all")

  const filterActions = (actions) => {
    return actions.filter(action => {
      const matchesSearch = action.description.toLowerCase().includes(searchTerm.toLowerCase())
      const actionDate = new Date(action.date)
      const matchesDate = date ? actionDate.toDateString() === date.toDateString() : true
      const matchesType = actionType === "all" || action.type === actionType
      return matchesSearch && matchesDate && matchesType
    })
  }

  const actionTypes = useMemo(() => {
    const types = new Set(usersActions.flatMap(user => user.actions.map(action => action.type)))
    return ["all", ...types]
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Track Role</h1>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          {usersActions.map(user => (
            <TabsTrigger key={user.id} value={user.id.toString()}>{user.name}</TabsTrigger>
          ))}
        </TabsList>

        <div className="my-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Search actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[280px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <TabsContent value="all">
          {usersActions.map(user => (
            <Card key={user.id} className="mb-6">
              <CardHeader>
                <CardTitle>{user.name}&apos;s Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-full justify-start">
                              Type <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {actionTypes.map((type) => (
                              <DropdownMenuItem key={type} onClick={() => setActionType(type)}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount/Subscription</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterActions(user.actions).map(action => (
                      <TableRow key={action.id}>
                        <TableCell className="font-medium">{action.type.charAt(0).toUpperCase() + action.type.slice(1)}</TableCell>
                        <TableCell>{action.description}</TableCell>
                        <TableCell>{action.amount || action.subscription} {action.currency}</TableCell>
                        <TableCell>{new Date(action.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {usersActions.map(user => (
          <TabsContent key={user.id} value={user.id.toString()}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{user.name}&apos;s Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-full justify-start">
                              Type <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {actionTypes.map((type) => (
                              <DropdownMenuItem key={type} onClick={() => setActionType(type)}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount/Subscription</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterActions(user.actions).map(action => (
                      <TableRow key={action.id}>
                        <TableCell className="font-medium">{action.type.charAt(0).toUpperCase() + action.type.slice(1)}</TableCell>
                        <TableCell>{action.description}</TableCell>
                        <TableCell>{action.amount || action.subscription} {action.currency}</TableCell>
                        <TableCell>{new Date(action.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}