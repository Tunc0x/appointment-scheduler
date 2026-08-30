// src/types/appointments.ts
export type Category = {
  id: string;
  label: string;
  color: string | null;
};

export type Patient = {
  id: string;
  firstname: string;
  lastname: string;
};

export type Appointment = {
  id: string;
  start: string;   // ISO-String
  end: string;
  title: string | null;
  location: string | null;
  notes: string | null;
  category: Category | null;
  patient: Patient | null;
};
