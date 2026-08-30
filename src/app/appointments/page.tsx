'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import DateRangeFilter from '@/components/appointments/DateRangeFilter';
import AppointmentFilter from '@/components/appointments/AppointmentFilter';
import AppointmentList from '@/components/appointments/AppointmentList';


export const dynamic = 'force-dynamic';


function AppointmentsPageInner() {
  const sp = useSearchParams();
  const categoryId = sp.get('cat') ?? undefined;
  const patientId = sp.get('pat') ?? undefined;
  const fromIso = sp.get('from') ?? undefined;
  const toIso = sp.get('to') ?? undefined;

  return (
    <>
      <header className="flex flex-wrap items-center gap-6 rounded-xl bg-card px-4 py-3 shadow">
        <h1 className="text-xl font-semibold tracking-tight">Termin­liste</h1>
        <DateRangeFilter />
      </header>

      <section className="rounded-xl bg-card p-4 shadow space-y-4">
        <AppointmentFilter />

        <AppointmentList
          filters={{ categoryId, patientId }}
          range={{ fromIso, toIso }}
        />
      </section>
    </>
  );
}

export default function AppointmentsPage() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <Suspense>
        <AppointmentsPageInner />
      </Suspense>
    </main>
  );
}
