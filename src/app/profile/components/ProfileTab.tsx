"use client";

import { User } from "@supabase/supabase-js";

interface Props {
  user: User;
}

export default function ProfileTab({ user }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-3xl mb-4">Profile Settings</h2>
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  );
}
