// src/components/appointments/AppointmentList.tsx
"use client";

import { useState, Fragment } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import AppointmentDialog from "./AppointmentDialog";
import type { Appointment } from "@/types/appointments";

import { Clock, MapPin, MessageSquare } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/de";          // deutsches Locale

type Props = {
  filters?: { categoryId?: string; patientId?: string };
  range?:   { fromIso?: string; toIso?: string };
};

export default function AppointmentList({ filters, range }: Props) {
  const { appointments, loading, error } = useAppointments(
    range?.fromIso,
    range?.toIso,
    filters
  );
  const [selected, setSelected] = useState<Appointment | null>(null);

  if (loading) return <p>Lade Termine …</p>;
  if (error)   return <p className="text-destructive">{error}</p>;
  if (!appointments.length) return <p>Keine Termine gefunden.</p>;

  /* -------- Termine nach Tag gruppieren -------- */
  const groups = appointments.reduce<Record<string, Appointment[]>>((acc, appt) => {
    const key = dayjs(appt.start).format("YYYY-MM-DD");
    (acc[key] ||= []).push(appt);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groups).map(([dateKey, list]) => {
        const d = dayjs(dateKey);
        const isToday = d.isSame(dayjs(), "day");
        return (
          <Fragment key={dateKey}>
            {/* --- Datums-Header -------------------------------------- */}
            <div className="mb-1 flex items-center justify-between px-1 text-sm font-semibold">
              {d.locale("de").format("dddd, DD. MMMM")}
              {isToday && (
                <span className="rounded-md bg-emerald-200/50 px-2 py-0.5 text-xs font-medium text-emerald-900">
                  Heute
                </span>
              )}
            </div>

            {/* --- Tages-Termine ------------------------------------- */}
            <ul className="space-y-3 mb-6">
              {list.map((a) => {
                const accent = a.category?.color ?? "#888";
                return (
                  <HoverCard key={a.id}>
                    <HoverCardTrigger asChild>
                      <li>
                        <button
                          onClick={() => setSelected(a)}
                          className="w-full rounded-xl bg-card p-4 text-left shadow transition
                                     hover:shadow-md focus-visible:outline-none
                                     focus-visible:ring-2 focus-visible:ring-ring
                                     focus-visible:ring-offset-2"
                          aria-label={`Termin ${a.title ?? a.category?.label} öffnen`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Accent-Dot */}
                            <span
                              className="mt-1.5 size-3 shrink-0 rounded-full"
                              style={{ background: accent }}
                              aria-hidden="true"
                            />

                            <div className="flex-1 space-y-1 text-sm">
                              <p className="font-semibold leading-none">
                                {a.title ?? a.category?.label}
                              </p>

                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="size-4" aria-hidden="true" />
                                {dayjs(a.start).format("HH:mm")} – 
                                {dayjs(a.end).format("HH:mm")}
                              </div>

                              {a.location && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="size-4" aria-hidden="true" />
                                  <span className="truncate">{a.location}</span>
                                </div>
                              )}

                              {a.notes && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MessageSquare className="size-4" aria-hidden="true" />
                                  <span className="truncate">{a.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    </HoverCardTrigger>

                    {/* Quick-Info */}
                    <HoverCardContent side="right" className="w-72">
                      <p className="font-semibold">
                        {a.title ?? a.category?.label}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <Clock className="size-4" />{" "}
                        {dayjs(a.start).format("HH:mm")} – {dayjs(a.end).format("HH:mm")}
                      </p>
                      {a.location && (
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="size-4" /> {a.location}
                        </p>
                      )}
                      <p className="text-sm mt-1">
                        Patient: {a.patient?.firstname} {a.patient?.lastname}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </ul>
          </Fragment>
        );
      })}

      {/* Edit-Dialog */}
      <AppointmentDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        defaultValues={selected ?? undefined}
      />
    </>
  );
}
