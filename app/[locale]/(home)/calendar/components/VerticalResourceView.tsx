import FullCalendar, { EventInput } from '@fullcalendar/react';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { useMemo } from 'react';
import { formatISO, startOfWeek, addDays, setHours, setMinutes ,addHours} from 'date-fns';

const VerticalResourceView = () => {
  const resources = useMemo(() => [
    { id: '1', title: 'Room 1' },
    { id: '2', title: 'Room 2' },
    { id: '3', title: 'Room 3' },
    { id: '4', title: 'Room 4' },
    { id: '5', title: 'Room 5' },
    { id: '6', title: 'Room 6' },
 
  ], []);

  const generateThisWeeksEvents = (): EventInput[] => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 }); // Start of the week (Monday)

    const eventColors = {
      same: 'blue',
      different: 'red',
    };

    return [
      {
        resourceId: '2',
        title: 'Long Event',
        start: formatISO(setHours(setMinutes(addDays(start, 1), 0), 9)), // Tuesday at 09:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 1), 0), 9), 2)), // Tuesday at 11:00
        backgroundColor: eventColors.same,
      },
      {
        resourceId: '1',
        title: 'Repeating Event',
        start: formatISO(setHours(setMinutes(addDays(start, 3), 0), 16)), // Thursday at 16:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 3), 0), 16), 2)), // Thursday at 18:00
        backgroundColor: eventColors.different,
      },
      {
        resourceId: '1',
        title: 'Conference',
        start: formatISO(setHours(setMinutes(addDays(start, 0), 0), 9)), // Monday at 09:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 0), 0), 9), 2)), // Monday at 11:00
        backgroundColor: eventColors.same,
      },
      {
        resourceId: '1',
        title: 'BGG',
        start: formatISO(setHours(setMinutes(addDays(start, 2), 0), 9)), // Wednesday at 09:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 2), 0), 9), 2)), // Wednesday at 11:00
        backgroundColor: eventColors.different,
      },
      {
        resourceId: '1',
        title: 'Auto',
        start: formatISO(setHours(setMinutes(addDays(start, 6), 0), 9)), // Sunday at 09:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 6), 0), 9), 2)), // Sunday at 11:00
        backgroundColor: eventColors.same,
      },
      {
        resourceId: '1',
        title: 'Fre',
        start: formatISO(setHours(setMinutes(addDays(start, 7), 0), 9)), // Next Monday at 09:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 7), 0), 9), 2)), // Next Monday at 11:00
        backgroundColor: eventColors.different,
      },
      {
        resourceId: '2',
        title: 'Meeting',
        start: formatISO(setHours(setMinutes(addDays(start, 1), 30), 10)), // Tuesday at 10:30
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 1), 30), 10), 2)), // Tuesday at 12:30
        backgroundColor: eventColors.same,
      },
      {
        resourceId: '1',
        title: 'Lunch',
        start: formatISO(setHours(setMinutes(addDays(start, 1), 0), 12)), // Tuesday at 12:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 1), 0), 12), 2)), // Tuesday at 14:00
        backgroundColor: eventColors.different,
      },
      {
        resourceId: '2',
        title: 'Birthday Party',
        start: formatISO(setHours(setMinutes(addDays(start, 2), 0), 7)), // Wednesday at 07:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 2), 0), 7), 2)), // Wednesday at 09:00
        backgroundColor: eventColors.same,
      },
      {
        resourceId: '2',
        title: 'Birthday Party',
        start: formatISO(setHours(setMinutes(addDays(start, 3), 0), 7)), // Thursday at 07:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 3), 0), 7), 2)), // Thursday at 09:00
        backgroundColor: eventColors.different,
      },
      {
        resourceId: '2',
        title: 'Birthday Party',
        start: formatISO(setHours(setMinutes(addDays(start, 4), 0), 7)), // Friday at 07:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 4), 0), 7), 2)), // Friday at 09:00
        backgroundColor: eventColors.same,
      },
      {
        resourceId: '2',
        title: 'Birthday Party',
        start: formatISO(setHours(setMinutes(addDays(start, 5), 0), 7)), // Saturday at 07:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 5), 0), 7), 2)), // Saturday at 09:00
        backgroundColor: eventColors.different,
      },
      {
        resourceId: '2',
        title: 'Birthday Party',
        start: formatISO(setHours(setMinutes(addDays(start, 6), 0), 7)), // Sunday at 07:00
        end: formatISO(addHours(setHours(setMinutes(addDays(start, 6), 0), 7), 2)), // Sunday at 09:00
        backgroundColor: eventColors.same,
      }
    ];
  };
  const events = useMemo(() => generateThisWeeksEvents(), []);

  return (
<FullCalendar

  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'resourceDayGridMonth,resourceTimeGridWeek,resourceTimeGridDay',
  }}
  plugins={[resourceDayGridPlugin, resourceTimeGridPlugin]}
  initialDate={new Date()}
  initialView='resourceTimeGridWeek'
  groupByResource={true}
  resources={(fetchInfo, successCallback) =>
    successCallback(resources)
  }
  dayMaxEventRows={true}
  editable={true}
  droppable={true}
  events={events}
  slotMinTime="09:00:00"
  slotMaxTime="21:00:00"
  scrollTime="09:00:00" // Set initial scroll time
  resourceAreaWidth="150px" // Adjust resource area width for better horizontal scrolling
  contentHeight="auto" // Set content height to auto for flexibility
  views={{
    resourceTimeGridWeek: {
      scrollable: true, // Enable horizontal scrolling for the week view
      columnHeaderFormat: { weekday:'short', day: 'numeric' } // Custom format for day title
    }
  }}
/>
  );
};

export default VerticalResourceView;