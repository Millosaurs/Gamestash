"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { toast } from "sonner";

type Option = { id: number; value: string; label: string };

function AdminListManager({
  title,
  apiPath,
}: {
  title: string;
  apiPath: string;
}) {
  const [items, setItems] = useState<Option[]>([]);
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch items
  useEffect(() => {
    fetch(apiPath)
      .then((res) => res.json())
      .then(setItems);
  }, [apiPath]);

  // Add item
  const handleAdd = async () => {
    if (!value || !label) return;
    setLoading(true);
    const res = await fetch(apiPath, {
      method: "POST",
      body: JSON.stringify({ value, label }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const newItem = await res.json();
      setItems((prev) => [...prev, newItem]);
      setValue("");
      setLabel("");
      toast.success(`${title} added!`);
    } else {
      toast.error((await res.json()).error || "Error");
    }
    setLoading(false);
  };

  // Remove item
  const handleRemove = async (id: number) => {
    setLoading(true);
    await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
    setLoading(false);
    toast.success(`${title} removed!`);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Lable (e.g. game/specialtie/category)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Name (e.g. Minecraft/Webdev/Design)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAdd} disabled={loading || !value || !label}>
            Add
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border rounded px-3 py-2"
            >
              <span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.value}
                </span>{" "}
                <span className="font-semibold">{item.label}</span>
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(item.id)}
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function GameCategoryManagerPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Manage Games & Categories</h1>
      <AdminListManager title="Games" apiPath="/api/admin/games" />
      <AdminListManager title="Categories" apiPath="/api/admin/categories" />
      <AdminListManager title="Specialties" apiPath="/api/admin/specialties" />
    </div>
  );
}
