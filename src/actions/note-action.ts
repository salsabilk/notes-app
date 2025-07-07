// CRUD operations untuk notes (create, read, update, delete, toggle complete)

"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateNoteData, UpdateNoteData } from "@/types/note";    // TypeScript interfaces untuk data validation

// Fungsi mengambil semua notes
export async function getNotes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();       // Get user yang sedang login

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get notes
  const { data: notes, error } = await supabase
    .from("notes_app")
    .select("*")
    .eq("user_id", user.id) // Filter by user
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  return notes || [];
}

// Fungsi membuat note baru
export async function createNote(noteData: CreateNoteData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("notes_app")
    .insert([{ ...noteData, user_id: user.id }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

// Fungsi update note
export async function updateNote(id: string, noteData: UpdateNoteData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("notes_app")
    .update(noteData)
    .eq("id", id)
    .eq("user_id", user.id)   // User hanya bisa update note sendiri
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}

// Fungsi delete note
export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("notes_app")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

// Fungsi mengubah status completed
export async function toggleComplete(id: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("notes_app")
    .update({ is_completed: isCompleted })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return data;
}
