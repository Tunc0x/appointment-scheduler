"use client";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Clock, MapPin } from "lucide-react";
import { dayjs } from "@/lib/date";
import type { Appointment } from "@/types/appointments";

type Props = {
  day: string;
  appointments: Appointment[];
  isCurrentMonth: boolean;
  onSelect?(a: Appointment): void;
};

export default function DateCell({
  day,
  appointments,
  isCurrentMonth,
  onSelect,
}: Props) {
  return (
    <div
      className={`h-24 overflow-hidden border bg-background/60 p-1
                  ${!isCurrentMonth && "bg-muted/20"}`}
    >
      <div className="text-right text-[11px] text-muted-foreground">
        {dayjs(day).date()}
      </div>

      {appointments.slice(0, 3).map((a) => {
        const clr = a.category?.color ?? "#888";
        return (
          <HoverCard key={a.id}>
            <HoverCardTrigger asChild>
              <button
                onClick={() => onSelect?.(a)}
                style={{ background: clr }}
                className="mt-0.5 truncate rounded px-1 text-[10px]/3 text-white
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {/* ↑ Chip-Inhalt zeigt jetzt Uhrzeit + Titel */}
                {dayjs(a.start).format("HH:mm")}&nbsp;·&nbsp;
                {a.title ?? a.category?.label}
              </button>
            </HoverCardTrigger>

            <HoverCardContent side="right" className="w-72">
              <p className="font-semibold">
                {a.title ?? a.category?.label}
              </p>

              <p className="text-sm flex items-center gap-1">
                <Clock className="size-4" aria-hidden="true" />
                {dayjs(a.start).format("HH:mm")} –{" "}
                {dayjs(a.end).format("HH:mm")}
              </p>

              {a.location && (
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="size-4" aria-hidden="true" />
                  {a.location}
                </p>
              )}

              <p className="text-sm mt-1">
                Patient: {a.patient?.firstname} {a.patient?.lastname}
              </p>
            </HoverCardContent>
          </HoverCard>
        );
      })}

      {appointments.length > 3 && (
        <div className="mt-0.5 text-center text-[10px] text-muted-foreground">
          +{appointments.length - 3} mehr
        </div>
      )}
    </div>
  );
}
