import HeaderPanel from "@/components/header/header-panel";
import NotesWrapper from "@/components/notes/notes-wrapper";
import { getNotes } from "@/actions/note-action";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";

export default async function NotesApp() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const notes = await getNotes();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <HeaderPanel />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotesWrapper initialNotes={notes} />
      </div>
    </div>
  );
}