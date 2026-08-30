import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Appointment } from "@/types/appointments";

type FilterOpts = {
  categoryId?: string;
  patientId?: string;
};

export function useAppointments(
  fromIso?: string,
  toIso?: string,
  opts: FilterOpts = {}
) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  
  const fetchAppointments = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("appointments")
      .select(`
        id,
        start_time,
        end_time,
        title,
        location,
        notes,
        categories:category ( id, label, color ),
        patients:patient   ( id, firstname, lastname )
      `)
      .order("start_time", { ascending: true });

  
    if (fromIso && toIso) {
      query = query
        .gte("start_time", fromIso)
        .lte("start_time", toIso);
    }

   
    if (opts.categoryId) query = query.eq("category", opts.categoryId);
    if (opts.patientId)  query = query.eq("patient",  opts.patientId);

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      const mapped = (data ?? []).map((row: any) => ({
        ...row,
        start: row.start_time,
        end:   row.end_time,
        category: row.categories,
        patient:  row.patients,
      })) as Appointment[];
      setAppointments(mapped);
    }
    setLoading(false);
  }, [fromIso, toIso, opts.categoryId, opts.patientId]);   

  
  useEffect(() => {
    fetchAppointments();
    
  }, [fetchAppointments]);
  
  useEffect(() => {
  function refresh() {
    fetchAppointments();
  }
  window.addEventListener("appointments:refresh", refresh);
  return () => window.removeEventListener("appointments:refresh", refresh);
}, [fetchAppointments]);

  return { appointments, loading, error };
}
