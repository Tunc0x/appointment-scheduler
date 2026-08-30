import { useQuery } from "@tanstack/react-query";   // brauchst react-query
import { supabase } from "@/lib/supabaseClient";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id,label,color");
      return data ?? [];
    },
  });
}

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data } = await supabase.from("patients").select("id,firstname,lastname");
      return data ?? [];
    },
  });
}
