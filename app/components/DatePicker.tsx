import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    onDateChange(date); // Update the selected date in the parent component
    setIsDatePickerOpen(false); // Close the date picker
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={
          selectedDate
            ? format(selectedDate, "dd MMMM yyyy", { locale: id })
            : ""
        }
        onClick={() => setIsDatePickerOpen(true)} // Open the date picker on click
        placeholder="Select a date"
        className="pl-10 pr-4 py-2 w-48 border-violet-300 focus:ring-violet-500 focus:border-violet-500 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
        readOnly
      />
      <Calendar
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500"
        size={20}
      />

      {isDatePickerOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-violet-200 rounded-lg shadow-lg">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange} // Handle date selection
            locale={id}
            modifiersClassNames={{
              selected: "bg-violet-500 text-white",
              today: "font-bold text-violet-500",
            }}
            className="p-4"
          />
        </div>
      )}
    </div>
  );
}
