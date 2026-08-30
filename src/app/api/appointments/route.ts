import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const Body = z.object({
  title:      z.string().optional(),
  notes:      z.string().optional(),
  location:   z.string().optional(),
  start:      z.string().datetime(),
  end:        z.string().datetime(),
  categoryId: z.string().uuid(),
  patientId:  z.string().uuid(),
});

export async function POST(req: Request) {
  const json = await req.json();
  const body = Body.safeParse(json);

  if (!body.success) {
    return NextResponse.json({ error: body.error.issues }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .insert({
      title:    body.data.title,
      notes:    body.data.notes,
      location: body.data.location,
      start_time: body.data.start,
      end_time:   body.data.end,
      category: body.data.categoryId,
      patient:  body.data.patientId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
