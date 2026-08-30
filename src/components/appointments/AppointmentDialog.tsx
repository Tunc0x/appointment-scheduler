"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { AlertCircle, Trash2 } from "lucide-react";
import { useCategories, usePatients } from "@/hooks/useMeta";
import { dayjs } from "@/lib/date";

type Props = { open: boolean; onClose(): void; defaultValues?: any };

export default function AppointmentDialog({
  open,
  onClose,
  defaultValues,
}: Props) {
  const isEdit = Boolean(defaultValues);

  /* ----- Meta-Daten ------------------------------------------------- */
  const { data: cats = [] } = useCategories();
  const { data: pats = [] } = usePatients();

  /* ----- Formular-Status ------------------------------------------- */
  const [form, setForm] = useState({
    title: "",
    notes: "",
    location: "",
    start: dayjs().startOf("hour").toISOString(),
    end:   dayjs().startOf("hour").add(1,"hour").toISOString(),
    categoryId: "",
    patientId:  "",
  });

  /* Prefill, wenn Dialog öffnet / Termin wechselt */
  useEffect(() => {
    if (open && defaultValues) {
      setForm({
        title:      defaultValues.title      ?? "",
        notes:      defaultValues.notes      ?? "",
        location:   defaultValues.location   ?? "",
        start:      defaultValues.start,
        end:        defaultValues.end,
        categoryId: defaultValues.category?.id ?? "",
        patientId:  defaultValues.patient?.id  ?? "",
      });
    } else if (open) {
      setForm({
        title: "",
        notes: "",
        location: "",
        start: dayjs().startOf("hour").toISOString(),
        end:   dayjs().startOf("hour").add(1,"hour").toISOString(),
        categoryId: "",
        patientId:  "",
      });
    }
  }, [open, defaultValues]);

  const [error,  setError]  = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* Helper: Eingabeänderungen */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const ready =
    !!form.categoryId && !!form.patientId && !!form.start && !!form.end;

  /* ----- Speichern -------------------------------------------------- */
  async function handleSubmit() {
    if (!ready) { setError("Bitte Kategorie, Patient sowie Start/Ende angeben."); return; }
    setSaving(true); setError(null);

    /* ISO-Strings sicherstellen */
    const payload = {
      ...form,
      start: new Date(form.start).toISOString(),
      end:   new Date(form.end).toISOString(),
    };

    const res = await fetch(
      isEdit ? `/api/appointments/${defaultValues!.id}` : `/api/appointments`,
      { method: isEdit ? "PATCH" : "POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) }
    );

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      const clone = res.clone();
      try {
        const j = await res.json();
        msg =
          typeof j === "string"     ? j :
          typeof j.error === "string" ? j.error :
          typeof j.message === "string" ? j.message :
          JSON.stringify(j);
      } catch {
        msg = await clone.text().then(t => t || msg);
      }
      setError(msg); setSaving(false); return;
    }

    window.dispatchEvent(new Event("appointments:refresh"));
    setSaving(false);
    onClose();
  }

  /* ----- Löschen ---------------------------------------------------- */
  async function handleDelete() {
    if (!defaultValues) return;
    if (!confirm("Termin wirklich löschen?")) return;

    await fetch(`/api/appointments/${defaultValues.id}`, { method:"DELETE" });
    window.dispatchEvent(new Event("appointments:refresh"));
    onClose();
  }

  /* ----- UI --------------------------------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Termin bearbeiten" : "Neuer Termin"}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Input name="title" placeholder="Titel" value={form.title} onChange={handleChange} />

          <div className="flex gap-3">
            <Input
              type="datetime-local" name="start" className="flex-1"
              value={dayjs(form.start).format("YYYY-MM-DDTHH:mm")}
              onChange={e => setForm({ ...form, start:new Date(e.target.value).toISOString() })}
            />
            <Input
              type="datetime-local" name="end" className="flex-1"
              value={dayjs(form.end).format("YYYY-MM-DDTHH:mm")}
              onChange={e => setForm({ ...form, end:new Date(e.target.value).toISOString() })}
            />
          </div>

          <Input name="location" placeholder="Ort" value={form.location} onChange={handleChange} />
          <Textarea name="notes" placeholder="Notizen" value={form.notes} onChange={handleChange} />

          {/* Kategorie */}
          <Select value={form.categoryId} onValueChange={val => setForm({ ...form, categoryId: val })}>
            <SelectTrigger><SelectValue placeholder="Kategorie wählen" /></SelectTrigger>
            <SelectContent>
              {cats.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Patient */}
          <Select value={form.patientId} onValueChange={val => setForm({ ...form, patientId: val })}>
            <SelectTrigger><SelectValue placeholder="Patient wählen" /></SelectTrigger>
            <SelectContent>
              {pats.map(p => <SelectItem key={p.id} value={p.id}>{p.firstname} {p.lastname}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="flex gap-4">
            {isEdit && (
              <Button variant="destructive" className="flex-1 flex items-center gap-1" onClick={handleDelete}>
                <Trash2 size={16}/> Löschen
              </Button>
            )}
            <Button disabled={!ready || saving} onClick={handleSubmit} className="flex-1">
              {saving ? "Speichere …" : isEdit ? "Speichern" : "Anlegen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
