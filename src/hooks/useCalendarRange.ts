import { useMemo } from "react";
import { dayjs } from "@/lib/date";

export type ViewMode = "month" | "week";

/**
 * Liefert:
 *  - Matrix der Tage für eine Monatsansicht  (6 Wochen × 7 Tage)
 *  - Array der Tage für eine Wochenansicht   (7 Tage)
 *  - Start/End-Timestamps  →  Supabase-Query
 */
export function useCalendarRange(date: string, view: ViewMode) {
  const base = dayjs.utc(date);

  return useMemo(() => {
    if (view === "week") {
      const start = base.startOf("isoWeek");
      const days = Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
      return {
        view,
        start,
        end: start.endOf("isoWeek"),
        matrix: [days],
      };
    }

    // Monats-Raster (immer 6 Wochen à 7 Tage)
    const monthStart = base.startOf("month").startOf("isoWeek");
    const matrix = Array.from({ length: 6 }, (_, week) =>
      Array.from({ length: 7 }, (_, day) =>
        monthStart.add(week * 7 + day, "day")
      )
    );

    return {
      view,
      start: matrix[0][0],                           // erster sichtbarer Tag
      end: matrix[5][6].endOf("day"),               // letzter sichtbarer Tag
      matrix,
    };
  }, [base, view]);
}
