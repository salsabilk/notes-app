import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";
import LoginForm from "./form";

export default async function LoginPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/");
  }

  return (
  <div className="mx-auto max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Login</h1>
      <p className="text-gray-600">
        Enter your email below to login to your account
      </p>
    </div>
    <LoginForm />
  </div>
);

}
