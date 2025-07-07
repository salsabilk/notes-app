// Menangani operasi authentication (login & logout) menggunakan Server Actions
// Authentication logic untuk login dan logout menggunakan Supabase

"use server";
import { createClient } from "@/lib/utils/supabase/server";     // Function untuk membuat koneksi Supabase di server-side
import { revalidatePath } from "next/cache";                // Next.js function untuk me-refresh cache halaman tertentu
import { redirect } from "next/navigation";                 // Next.js function untuk redirect user ke halaman lain

export async function login(email: string, password: string) {
  const supabase = await createClient();        // Koneksi ke Supabase

  // Method untuk login dengan email/password
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error; 
  }

  revalidatePath("/", "layout");
  redirect('/')
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
