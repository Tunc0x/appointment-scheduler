"use client";

import { useState, Fragment } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { useCalendarRange } from "@/hooks/useCalendarRange";
import AppointmentBlock from "./AppointmentBlock";
import AppointmentDialog from "@/components/appointments/AppointmentDialog";
import type { Appointment } from "@/types/appointments";
import { dayjs } from "@/lib/date";

type Filters = { categoryId?: string; patientId?: string };
type Range   = { fromIso?: string; toIso?: string };

export default function WeekView({ date, filters, range }: {
  date: string; filters?: Filters; range?: Range;
}) {
  const { matrix, start, end } = useCalendarRange(date, "week");
  const days = matrix[0];

  const from = range?.fromIso ?? start.toISOString();
  const to   = range?.toIso   ?? end.toISOString();

  const { appointments, loading } = useAppointments(from, to, filters);
  const [selected, setSelected] = useState<Appointment | null>(null);

  if (loading) return <p>Lade Termine …</p>;

  const HOURS = Array.from({ length: 14 }, (_, i) => 6 + i); // 06–19 Uhr

  return (
    <>
      <div
        className="grid rounded-lg overflow-hidden bg-border"
        style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
      >
        {/* Kopfzeile */}
        <div className="bg-accent" />
        {days.map((d) => (
          <div key={d.toString()} className="bg-accent p-1 text-center text-sm font-semibold">
            {d.format("ddd DD.MM.")}
          </div>
        ))}

        {/* Stundenraster */}
        {HOURS.map((h) => (
          <Fragment key={h}>
            <div className="bg-muted/40 px-2 py-4 text-right text-xs font-medium">
              {String(h).padStart(2,"0")}:00
            </div>

            {days.map((day) => (
              <div key={day.toString()} className="relative h-24 bg-background">
                {appointments
                  .filter(
                    (a) =>
                      dayjs(a.start).hour() === h &&
                      dayjs(a.start).isSame(day,"day")
                  )
                  .map((a) => (
                    <AppointmentBlock
                      key={a.id}
                      appt={a}
                      onSelect={setSelected}
                    />
                  ))}
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <AppointmentDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        defaultValues={selected ?? undefined}
      />
    </>
  );
}
