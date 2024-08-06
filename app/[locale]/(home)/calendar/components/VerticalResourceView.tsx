import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { AttandenceDataModel } from './attendance-sheet';
import { useData } from '@/context/admin/fetchDataContext';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'; // Import the resourceTimeline plugin
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { fr } from 'date-fns/locale'; // Import French locale
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

import { useCallback,useMemo} from 'react';
import {
  Eventcalendar,
  MbscCalendarColor,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscResource,
  setOptions,
  locale,
} from '@mobiscroll/react';
import { FC} from 'react';
import './style.css'
// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper function to format time strings to ISO datetime strings
const formatTimeToDateTime = (timeString: string, date: string) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return null;
  const dateTime = new Date(`${date}T${hours}:${minutes}:00`);
  return dateTime.toISOString();
};

// Function to map days to RRule compatible weekdays
const mapDayToRRule = (day: string) => {
  const daysMap: { [key: string]: number } = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
  };
  return daysMap[day];
};

const generateRecurringEvents = (startDateTime: string, endDateTime: string, day: string, room: string, subject: string, id: string) => {
  const events = [];
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const recurrenceEndDate = new Date('2025-06-20');

  while (startDate <= recurrenceEndDate) {
    const event: any  = {
      title: subject,
      id:id,
      resourceId: room.trim(),  // Ensure this matches the resources' ids
      start: new Date(startDate),
      end: new Date(endDate),
      backgroundColor: getRandomColor(),
      extendedProps: {
        day,
        room,
        subject,
        
      }
    };
    events.push(event);

    // Move to the same day in the next week
    startDate.setDate(startDate.getDate() + 7);
    endDate.setDate(endDate.getDate() + 7);
  }

  return events;
};
setOptions({
  theme: 'ios',
  themeVariant: 'light'
});
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
  const day = date.getDate().toString().padStart(2, '0'); // Pad day with leading zero if needed

  return `${year}-${month}-${day}`;
};
const dayToWeekDay = {
  "Sunday": "SU",
  "Monday": "MO",
  "Tuesday": "TU",
  "Wednesday": "WE",
  "Thursday": "TH",
  "Friday": "FR",
  "Saturday": "SA"
};
const now = new Date();
const day = now.getDay();
const month = 7; // August (0-based index)
const year = now.getFullYear() - 1; // One year before the current year
const monday = now.getDate() - day + (day == 0 ? -6 : 1);
const extractRoomNumber = (room:string) => {
  const match = room.match(/(\d+)$/); // Match the last number in the string
  return match ? parseInt(match[1], 10) : 1; // Default to 1 if no number is found
};

const VerticalResourceView = () => {
  const {classes}=useData()
  const [events,setEvents]=useState<MbscCalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [openCard, setOpenCard] = useState(false);
  useEffect(() => {
    const fetchAndFormatData = async () => {
      console.log('Fetched classes:', classes); // Log the fetched data
      const formattedEvents = classes.flatMap((classItem) => {
        // Extract groups array and other necessary fields
        const groups = classItem.groups || [];
        const classId = classItem.id; // Extract the class ID from classItem
        const color=getRandomColor()
        return groups.flatMap((group) => {
          const { day, start, end, room, subject } = group;
  
          if (!start || !end || !room || !subject) {
            console.error('Missing required event properties:', group);
            return []; // Skip this event if any required property is missing
          }
   
          const targetDayAbbreviation = dayToWeekDay[day];
                      
                       
          if (!targetDayAbbreviation) {
            console.log("dddddd",classId);
            throw new Error("Invalid day provided");
          }
          const firstDayOfMonth = new Date(year, month, 1);
          let targetDate = new Date(firstDayOfMonth);
          while (targetDate.getDay() !== Object.keys(dayToWeekDay).indexOf(day)) {
            targetDate.setDate(targetDate.getDate() + 1);
          }
          const offset = new Date().getTimezoneOffset() * 60000; // Offset in milliseconds
          const startDate = new Date(year, month, targetDate.getDate(), ...start.split(':').map(Number));
          startDate.setTime(startDate.getTime() - offset); // Adjust for timezone offset
          
          const endDate = new Date(year, month, targetDate.getDate(), ...end.split(':').map(Number));
          endDate.setTime(endDate.getTime() - offset); // Adjust for timezone offset
          const resourceNumber = extractRoomNumber(room);
          return {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            title: subject, // Add your event title here
            resource: resourceNumber, // Set your resource ID if needed
            color:color,
            recurring: {
              repeat: 'weekly',
              until: '2025-07-25',
              weekDays: targetDayAbbreviation,
              interval: 1
            },
            extraInfo:{
              classId:classItem.id,
              group:group.group,
              subject:classItem.subject,
              year:classItem.year,
              teacher:classItem.teacherName
            }
          }
        });
      });
  
      setEvents(formattedEvents);
    };
  
    fetchAndFormatData();
  }, [classes]);
  const handleEventClick =(args) => {
    try {
      // Validate the event object
      if (!args || !args.event || !args.event.start || !args.event.extraInfo) {
        throw new Error('Invalid event data provided');
      }
  
      // Validate extraInfo
      const { classId, group } = args.event.extraInfo;
      if (typeof classId !== 'string' || typeof group !== 'string') {
        throw new Error('Invalid extraInfo data');
      }
  
      // Format the date
      const formattedDate = formatDateToYYYYMMDD(args.event.start);
  
      // Find the attendance object for the class
      const attendance = classes.find((cls) => cls.id === classId);
  console.log("attendaaacne",attendance);
  
      // Ensure attendance is defined before accessing its properties
      if (!attendance) {
        throw new Error(`Attendance object not found for classId: ${classId}`);
      }
  
      // Use optional chaining and default value for safety
      const attendanceDetail = attendance.Attendance?.[`${formattedDate}-${group}`] || { attendanceList: [] };
 
      // Update the selected event with details and extra info
      setSelectedEvent({ ...args.event.extraInfo, ...attendanceDetail });
  
      // Open the event card
      setOpenCard(true);
  
      
    } catch (error) {
      // Log the error for debugging
      console.error('Error handling event click:', error);
  
      // Display a user-friendly message
      alert(`An error occurred while processing the event. Please try again. ${error.message}`);
  
      // Optionally, you can also send error details to a logging service
      // sendErrorToLoggingService(error);
    }
  }

  const myResources = useMemo<MbscResource[]>(
    () => [
      {
        id: 1,
        name: 'room 1',
        color: '#f7c4b4',
      },
      {
        id: 2,
        name: 'room 2',
        color: '#c6f1c9',

      },
      {
        id: 3,
        name: 'room 3',
        color: '#e8d0ef',
      },
      {
        id: 4,
        name: 'room 4',
        color: '#edeaba',
      },
      {
        id: 5,
        name: 'room 5',
        color: '#bacded',
      },
      {
        id:6,
        name: 'room 6',
        color: '#bacded',
      },
      {
        id:7,
        name: 'room 7',
        color: '#bacded',
      },
      {
        id:8,
        name: 'room 8',
        color: '#bacded',
      },
    ],
    [],
  );

  const myView = useMemo<MbscEventcalendarView>(
    () => ({
      schedule: {
        type: 'week',
        allDay: false,
        startDay: 0,
        endDay: 6,
        startTime: '07:00',
        endTime: '22:00',
      },
    }),
    [],
  );

  const myColors = useMemo<MbscCalendarColor[]>(
    () => [
      {
        start: '05:00',
        end: '22:00',
        recurring: {
          repeat: 'daily',
        },
        resource: 2,
        background: '#d3b9711a',
      },
    ],
    [],
  );
  return (
    <div>
 <Eventcalendar
      view={myView}
      data={events}
      resources={myResources}
      colors={myColors}
      onEventClick={handleEventClick}
      groupBy='date'
      locale={locale['fr']}
    />

        <AttandenceDataModel
          open={openCard}
          setOpen={setOpenCard}
          selectedEvent={selectedEvent}

        />

    </div>
    
  );
};

export default VerticalResourceView;