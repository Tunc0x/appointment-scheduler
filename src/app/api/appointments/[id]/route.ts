import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const Body = z.object({
  title: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
  start: z.string().datetime().optional(),
  end:   z.string().datetime().optional(),
  categoryId: z.string().uuid().optional(),
  patientId:  z.string().uuid().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const json  = await req.json();
  const body  = Body.safeParse(json);
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .update({
      title:     body.data.title,
      notes:     body.data.notes,
      location:  body.data.location,
      start_time: body.data.start,
      end_time:   body.data.end,
      category:  body.data.categoryId,
      patient:   body.data.patientId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("appointments")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({}, { status: 204 });
}
