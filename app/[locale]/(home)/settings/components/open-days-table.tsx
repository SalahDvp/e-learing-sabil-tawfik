"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    FormControl,
    FormField,
    FormItem,
  } from "@/components/ui/form";
 export  const generateTimeOptions = (startTime: string, endTime: string, interval: number): string[] => {
    const timeOptions: string[] = [];
    let [startHour, startMinute] = startTime.split(':').map(Number);
    let [endHour, endMinute] = endTime.split(':').map(Number);

    while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
        const formattedHour = startHour.toString().padStart(2, '0'); // Ensure two digits for hours
        const formattedMinute = startMinute.toString().padStart(2, '0'); // Ensure two digits for minutes
        const time = `${formattedHour}:${formattedMinute}`;
        timeOptions.push(time);

        // Add interval minutes
        startMinute += interval;
        if (startMinute >= 60) {
            startHour++;
            startMinute -= 60;
        }
    }

    return timeOptions;
};

interface OpenDay {
    day: string;
    start: string;
    end: string;
    state: string;
    id:any,
}

interface DashboardProps {
    openDays: OpenDay[];
    form:any
}
const OpenDaysTable: React.FC<DashboardProps> = ({ openDays, form }) => {
    const timeOptions = generateTimeOptions("07:00","18:00", 30);
  return (
   <>
    <Card x-chunk="dashboard-07-chunk-1">
         <CardHeader>
                    <CardTitle>Open Hours</CardTitle>
                    <CardDescription>
                      manage opening dates and hours of your school or organization
                    </CardDescription>
                  </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Day</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>end</TableHead>
              <TableHead className="w-[100px]">Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openDays.map((field, index) => (
              <TableRow key={index}>
                <TableCell className="font-semibold">
                  {field.day}
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`openDays.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`start-${index}`}
                              aria-label={`Select start time`}
                            >
                              <SelectValue placeholder="Select Start time" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`openDays.${index}.end`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`end-${index}`}
                              aria-label={`Select end time`}
                            >
                              <SelectValue placeholder="Select End time" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`openDays.${index}.state`}
                    render={({ field }) => (
                      <FormItem>
               
                          <FormControl>
                          <ToggleGroup
                          type="single"
                          defaultValue={field.value}
                          variant="outline"
                          onValueChange={field.onChange}
                        >
                            <ToggleGroupItem value="open">
                              Open
                            </ToggleGroupItem>
                            <ToggleGroupItem value="close">
                              Close
                            </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
               
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </>
  );
}
export default OpenDaysTable;
