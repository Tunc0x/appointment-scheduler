"use client";

import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { useCalendarRange } from "@/hooks/useCalendarRange";
import AppointmentDialog from "@/components/appointments/AppointmentDialog";
import DateCell from "./DateCell";
import type { Appointment } from "@/types/appointments";
import { dayjs } from "@/lib/date";

type Filters = { categoryId?: string; patientId?: string };
type Range   = { fromIso?: string; toIso?: string };

export default function MonthView({ date, filters, range }: {
  date: string; filters?: Filters; range?: Range;
}) {
  const { matrix, start, end } = useCalendarRange(date, "month");

  const from = range?.fromIso ?? start.toISOString();
  const to   = range?.toIso   ?? end.toISOString();

  const { appointments, loading } = useAppointments(from, to, filters);
  const [selected, setSelected] = useState<Appointment | null>(null);

  if (loading) return <p>Lade Termine …</p>;

  return (
    <>
      <div className="grid grid-cols-7 gap-px rounded-lg overflow-hidden bg-border">
        {/* Kopfzeile */}
        {["Mo","Di","Mi","Do","Fr","Sa","So"].map((d) => (
          <div key={d} className="p-2 text-center text-sm font-semibold bg-accent">
            {d}
          </div>
        ))}

        
        {matrix.flat().map((d) => {
          const list = appointments.filter((a) => dayjs(a.start).isSame(d,"day"));
          return (
            <DateCell
              key={d.toString()}
              day={d.toISOString()}
              appointments={list}
              isCurrentMonth={d.month() === dayjs(date).month()}
              onSelect={setSelected}
            />
          );
        })}
      </div>

      <AppointmentDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        defaultValues={selected ?? undefined}
      />
    </>
  );
}
