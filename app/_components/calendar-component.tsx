"use client";

import * as React from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "./ui/calendar";
import { Card, CardContent } from "./ui/card";
import { ptBR } from "date-fns/locale";

interface CalendarProps {
  selectedRange: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
}

const CalendarComponent = ({ selectedRange, onRangeChange }: CalendarProps) => {
  return (
    <Card className="w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          className="flex w-full"
          mode="range"
          locale={ptBR}
          selected={selectedRange}
          onSelect={onRangeChange}
          numberOfMonths={1}
          disabled={(date) => {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const limiteFuturo = addDays(hoje, 5);
            return date > limiteFuturo || date < new Date("1900-01-01");
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarComponent;
