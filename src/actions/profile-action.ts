"use server";
import { createClient } from "@/lib/utils/supabase/server";
  
export async function getProfile() {
  const supabase = await createClient();

  const { data: user, error } = await supabase.from("profiles").select("*").single();
  if (error) {
    return null;
  }

  return user;
}


export async function getUser() {
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  return user;
}