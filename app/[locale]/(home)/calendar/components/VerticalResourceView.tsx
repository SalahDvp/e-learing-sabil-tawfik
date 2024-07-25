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

const now = new Date();
const day = now.getDay();
const monday = now.getDate() - day + (day == 0 ? -6 : 1);
const VerticalResourceView = () => {
  const myEvents = useMemo<MbscCalendarEvent[]>(
    () => [
      {
        start: new Date(now.getFullYear(), now.getMonth(), monday + 1, 11),
        end: new Date(now.getFullYear(), now.getMonth(), monday + 1, 12, 30),
        title: 'Product team mtg.',
        resource: 1,
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), monday + 3, 15),
        end: new Date(now.getFullYear(), now.getMonth(), monday + 3, 17),
        title: 'Decision Making mtg.',
        resource: 1,
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), monday + 2, 12),
        end: new Date(now.getFullYear(), now.getMonth(), monday + 2, 15, 30),
        title: 'Shaping the Future',
        resource: 2,
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), monday + 3, 9),
        end: new Date(now.getFullYear(), now.getMonth(), monday + 3, 12),
        title: 'Innovation mtg.',
        resource: 3,
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), monday + 3, 11),
        end: new Date(now.getFullYear(), now.getMonth(), monday + 3, 16),
        title: 'Decision Making mtg.',
        resource: 4,
      },
      {
        start: new Date(now.getFullYear(), now.getMonth(), monday + 3, 11),
        end: new Date(now.getFullYear(), now.getMonth(), monday + 3, 13),
        title: 'Stakeholder mtg.',
        resource: 5,
      },
    ],
    [],
  );
  const myResources = useMemo<MbscResource[]>(
    () => [
      {
        id: 1,
        name: 'Flatiron Room',
        color: '#f7c4b4',
      },
      {
        id: 2,
        name: 'The Capital City (locked)',
        color: '#c6f1c9',
        eventCreation: false,
      },
      {
        id: 3,
        name: 'Heroes Square',
        color: '#e8d0ef',
      },
      {
        id: 4,
        name: 'Thunderdome',
        color: '#edeaba',
      },
      {
        id: 5,
        name: 'King’s Landing',
        color: '#bacded',
      },
      {
        id:6,
        name: 'King’s Landing',
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
        startDay: 1,
        endDay: 6,
        startTime: '08:00',
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
      clickToCreate={true}
      dragToCreate={true}
      dragToMove={true}
      dragToResize={true}
      eventDelete={true}
      view={myView}
      data={myEvents}
      resources={myResources}
      colors={myColors}
    />
    </div>
  );
};

export default VerticalResourceView;