"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import UserDialog from "@/components/admin/UserDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  location?: string;
  website?: string;
  image?: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [banLoading, setBanLoading] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  }, []);

  const handleBan = async (userId: string, banned: boolean) => {
    setBanLoading(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, banned }),
    });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, banned } : u))
    );
    setBanLoading(null);
  };

  const handleRemove = async (userId: string) => {
    setRemoveLoading(userId);
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setRemoveLoading(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-8 w-full">
        <Loader2 className="animate-spin w-6 h-6 mr-2 text-muted-foreground" />
        <span>Loading users...</span>
      </div>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Avatar</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Banned</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelected(u);
                      setDialogOpen(true);
                    }}
                  >
                    <td className="p-2">
                      <Avatar className="w-8 h-8">
                        {u.image ? (
                          <AvatarImage src={u.image} alt={u.name} />
                        ) : (
                          <AvatarFallback>{u.name?.[0] || "U"}</AvatarFallback>
                        )}
                      </Avatar>
                    </td>
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">
                      <Switch
                        checked={u.banned}
                        onCheckedChange={(checked) => handleBan(u.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={banLoading === u.id}
                      />
                    </td>
                    <td className="p-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(u.id)}
                        disabled={removeLoading === u.id}
                      >
                        {removeLoading === u.id ? (
                          <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />
                        ) : null}
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <UserDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          user={selected}
        />
      </CardContent>
    </Card>
  );
}
