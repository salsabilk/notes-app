import { createClient } from "@/lib/utils/supabase/server";
import UserDropdown from "./user-dropdown";

export default async function HeaderPanel() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Notes App</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && <UserDropdown user={user} />}
          </div>
        </div>
      </div>
    </header>
  );
}