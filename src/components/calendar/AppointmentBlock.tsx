"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Clock, MapPin } from "lucide-react";
import { dayjs } from "@/lib/date";
import type { Appointment } from "@/types/appointments";

export default function AppointmentBlock({
  appt,
  onSelect,
}: {
  appt: Appointment;
  onSelect?: (a: Appointment) => void;
}) {
  const color = appt.category?.color ?? "#666";
  const tint  = `${color}22`;            

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          onClick={() => onSelect?.(appt)}
          style={{ background: tint, borderLeftColor: color }}
          className="absolute inset-0 m-0.5 overflow-hidden rounded-lg border-l-4 p-2 text-left
                     text-[11px]/4 ring-offset-background transition-shadow
                     hover:shadow focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Termin "${appt.title ?? appt.category?.label}" öffnen`}
        >
          <p className="font-semibold truncate">
            {appt.title ?? appt.category?.label}
          </p>

          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="size-3" aria-hidden="true" />
            {dayjs(appt.start).format("HH:mm")}–{dayjs(appt.end).format("HH:mm")}
          </div>

          {appt.location && (
            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="size-3" aria-hidden="true" />
              <span className="truncate">{appt.location}</span>
            </div>
          )}
        </button>
      </HoverCardTrigger>

      {/* Für Screen-Reader & Schnell-Infos */}
      <HoverCardContent side="right" className="w-72">
        <p className="font-semibold">{appt.title ?? appt.category?.label}</p>
        <p className="text-sm flex items-center gap-1">
          <Clock className="size-4" />{" "}
          {dayjs(appt.start).format("HH:mm")} – {dayjs(appt.end).format("HH:mm")}
        </p>
        {appt.location && (
          <p className="text-sm flex items-center gap-1">
            <MapPin className="size-4" /> {appt.location}
          </p>
        )}
        <p className="text-sm mt-1">
          Patient: {appt.patient?.firstname} {appt.patient?.lastname}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

