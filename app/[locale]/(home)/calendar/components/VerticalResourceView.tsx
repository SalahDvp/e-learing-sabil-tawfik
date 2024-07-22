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
const mapDayToRRule = (day: string) => {
};
const generateRecurringEvents = (startDateTime: string, endDateTime: string, day: string, room: string, subject: string) => {
  const events = [];
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const recurrenceEndDate = new Date('2025-06-20');

  while (startDate <= recurrenceEndDate) {
    const event: any = {
      title: subject,
      resourceId: room.trim(),  // Ensure this matches the resources' ids
      start: new Date(startDate),
      end: new Date(endDate),
      backgroundColor: getRandomColor(),
    };
    events.push(event);

    // Move to the same day in the next week
    startDate.setDate(startDate.getDate() + 7);
    endDate.setDate(endDate.getDate() + 7);
  }

  return events;
};
const VerticalResourceView = () => {
  const { classes } = useData();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [openCard, setOpenCard] = useState(false);

  // Define resources with exact IDs
  const resources = [
    { id: 'room 1', title: 'Room 1' },
    { id: 'room 2', title: 'Room 2' },
    { id: 'room 3', title: 'Room 3' },
    { id: 'room 4', title: 'Room 4' },
    { id: 'room 5', title: 'Room 5' },
    { id: 'room 6', title: 'Room 6' },
  ];
  useEffect(() => {
    const fetchAndFormatData = async () => {
      console.log('Fetched classes:', classes); // Log the fetched data

      // Use a default date if necessary
      const todayDate = new Date().toISOString().split('T')[0]; // Use today's date

      const formattedEvents = classes.flatMap((classItem) => {
        // Extract groups array
        const groups = classItem.groups || [];
        return groups.flatMap((group) => {
          const { day, start, end, room, subject } = group;

          // Basic validation
          if (!start || !end || !room || !subject) {
            console.error('Missing required event properties:', group);
            return []; // Skip this event if any required property is missing
          }

          // Convert time strings to ISO datetime strings
          const startDateTime = formatTimeToDateTime(start, todayDate);
          const endDateTime = formatTimeToDateTime(end, todayDate);

          if (!startDateTime || !endDateTime) {
            console.error(`Invalid time for event: ${group}`, { start, end });
            return []; // Skip this event if time is invalid
          }

          console.log('Event data:', { title: subject, resourceId: room, start: startDateTime, end: endDateTime });

          return generateRecurringEvents(startDateTime, endDateTime, day, room, subject);
        });
      });

      console.log('Formatted events:', formattedEvents); // Log the formatted events

      setEvents(formattedEvents);
    };

    fetchAndFormatData();
  }, [classes]);



  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setOpenCard(true); // Open the sheet
  };

  return (
    <div>
 {events && ( <FullCalendar
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth',
      }}
      plugins={[resourceTimelinePlugin, dayGridPlugin, timeGridPlugin]}
      initialDate={new Date()}
      initialView='resourceTimelineDay'
      resources={(fetchInfo, successCallback) =>
        successCallback(resources)
      }
      dayMaxEventRows={true}
      editable={true}
      droppable={true}
      events={events}
      slotMinTime="09:00:00"
      slotMaxTime="23:00:00"
      scrollTime="09:00:00"
      resourceAreaWidth="150px"
      contentHeight='auto'
      views={{
        resourceTimelineWeek: {
          columnHeaderFormat: { weekday: 'short', day: 'numeric' },
          slotDuration: '00:30:00' // Set slot duration to 30 minutes
        },
        resourceTimelineDay: {
          slotDuration: '00:30:00' // Set slot duration to 30 minutes
        },
        resourceTimelineMonth: {
          slotDuration: '00:30:00' // Set slot duration to 30 minutes
        },
        timeGridWeek: {
          slotDuration: '00:30:00' // Set slot duration to 30 minutes
        },
        timeGridDay: {
          slotDuration: '00:30:00' // Set slot duration to 30 minutes
        },
      }}
      locale='fr'
      eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false, locale: fr }} // Use French locale for time formatting
      eventClick={handleEventClick} // Add event click handler
    />)}
      {selectedEvent && (
        <AttandenceDataModel
          open={openCard}
          setOpen={setOpenCard}
          teacher={selectedEvent.extendedProps} // Pass the extendedProps to the sheet
        />
      )}
    </div>
  );
};

export default VerticalResourceView;