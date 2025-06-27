"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}) {
  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <b>ID:</b> {user.id}
              </div>
              <div>
                <b>Email:</b> {user.email}
              </div>
              <div>
                <b>Role:</b> {user.role}
              </div>
              <div>
                <b>Banned:</b> {user.banned ? "Yes" : "No"}
              </div>
              <div>
                <b>Created:</b> {user.createdAt}
              </div>
              <div>
                <b>Updated:</b> {user.updatedAt}
              </div>
              <div>
                <b>Bio:</b> {user.bio}
              </div>
              <div>
                <b>Location:</b> {user.location}
              </div>
              <div>
                <b>Website:</b> {user.website}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
