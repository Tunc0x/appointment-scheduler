"use client";
import { useCategories, usePatients } from "@/hooks/useMeta";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AppointmentFilter() {
  const { data: cats = [] } = useCategories();
  const { data: pats = [] } = usePatients();

  const sp      = useSearchParams();
  const router  = useRouter();

  /** aktuell aktive Filter aus der URL */
  const categoryId = sp.get("cat") || undefined;
  const patientId  = sp.get("pat") || undefined;

  /** Hilfsfunktion → Query-Param setzen / löschen */
  function setParam(key: string, value?: string) {
    const params = new URLSearchParams(sp);
    value && value !== "all" ? params.set(key, value) : params.delete(key);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-4 py-2">
      {/* Kategorie */}
      <Select
        value={categoryId ?? "all"}
        onValueChange={(val) => setParam("cat", val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Kategorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Kategorien</SelectItem>
          {cats.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Patient */}
      <Select
        value={patientId ?? "all"}
        onValueChange={(val) => setParam("pat", val)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Patient" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Patienten</SelectItem>
          {pats.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.firstname} {p.lastname}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
