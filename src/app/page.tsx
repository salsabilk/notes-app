import HeaderPanel from "@/components/header/header-panel";
import NotesWrapper from "@/components/notes/notes-wrapper";
import { getNotes } from "@/actions/note-action";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";
import { NoteProvider } from "@/context/NoteContext"; // Import NoteProvider

export default async function NotesApp() {
  const supabase = await createClient();                    // Membuat koneksi ke Supabase database dari server

  const { data: { user } } = await supabase.auth.getUser(); // Mendapatkan user yang sedang login

  if (!user) {
    redirect("/login");
  }

  const notes = await getNotes(); // Mengambil notes dari server

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderPanel />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NoteProvider initialNotes={notes}>  {/*  Data notes awal yang dikirim dari server/parent component ke context */}
          <NotesWrapper />
        </NoteProvider>
      </div>
    </div>
  );
}