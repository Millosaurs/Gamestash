"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminSettingsPage() {
  // State for adding new admin
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminMessage, setAddAdminMessage] = useState("");

  // State for changing credentials
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeMessage, setChangeMessage] = useState("");

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminLoading(true);
    setAddAdminMessage("");
    try {
      const res = await fetch("/api/admin/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newAdminUsername,
          password: newAdminPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAddAdminMessage("Admin added successfully");
      } else {
        setAddAdminMessage(data.error || "Failed to add admin");
      }
    } catch (err) {
      setAddAdminMessage("Network error");
    }
    setAddAdminLoading(false);
  };

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeLoading(true);
    setChangeMessage("");
    try {
      const res = await fetch("/api/admin/change-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setChangeMessage("Credentials changed successfully");
      } else {
        setChangeMessage(data.error || "Failed to change credentials");
      }
    } catch (err) {
      setChangeMessage("Network error");
    }
    setChangeLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <Input
              placeholder="Username"
              value={newAdminUsername}
              onChange={(e) => setNewAdminUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={addAdminLoading}>
              {addAdminLoading ? "Adding..." : "Add Admin"}
            </Button>
            {addAdminMessage && (
              <div className="text-green-600">{addAdminMessage}</div>
            )}
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Change Admin Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeCredentials} className="space-y-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={changeLoading}>
              {changeLoading ? "Changing..." : "Change Password"}
            </Button>
            {changeMessage && (
              <div className="text-green-600">{changeMessage}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
