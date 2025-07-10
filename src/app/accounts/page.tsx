"use client";

import { useState, useEffect, Suspense } from "react";
import {
  User,
  Heart,
  ShoppingBag,
  Settings,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import Header from "@/components/header";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function AccountsPage() {
  const { data: session, isPending } = useSession();
  const [likedProducts, setLikedProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);

  // User settings state
  const [userSettings, setUserSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    profileVisibility: "public",
  });

  // Profile state
  const [profile, setProfile] = useState<any>(null);
  const [specialtyOptions, setSpecialtyOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(true);

  // Account deletion state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  useEffect(() => {
    async function fetchSpecialties() {
      setSpecialtiesLoading(true);
      try {
        const res = await fetch("/api/admin/specialties");
        const data = await res.json();
        setSpecialtyOptions(
          data.map((s: any) => ({
            id: s.value ?? s.id,
            name: s.label ?? s.name,
          }))
        );
      } catch (e) {
        setSpecialtyOptions([]);
      } finally {
        setSpecialtiesLoading(false);
      }
    }
    fetchSpecialties();
  }, []);

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSpecialties(
      Array.isArray(profile?.specialties)
        ? profile.specialties
        : profile?.specialties
        ? [profile.specialties]
        : []
    );
  }, [profile]);

  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user) return;
      setLoading(true);
      try {
        const [profileRes, likedResponse, purchasedResponse] =
          await Promise.all([
            fetch("/api/user/profile"),
            fetch("/api/user/liked-products"),
            fetch("/api/user/purchased-products"),
          ]);

        if (profileRes.ok) setProfile(await profileRes.json());
        if (likedResponse.ok) setLikedProducts(await likedResponse.json());
        if (purchasedResponse.ok)
          setPurchasedProducts(await purchasedResponse.json());
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load account data");
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [session]);

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        toast.success("Profile updated successfully");
        setProfile(await response.json()); // Refresh profile data
        setEditMode(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userSettings),
      });
      if (response.ok) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Your account has been permanently deleted.");
        await signOut();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete your account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An unexpected error occurred while deleting your account.");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteConfirmationInput("");
    }
  };

  if (isPending || loading) {
    return (
      <>
        <Suspense fallback={<div>Loading header...</div>}>
          <Header />
        </Suspense>
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="md:col-span-2 h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session?.user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Please login to access your account
              </h1>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">
              My Account
            </h1>
            <p className="text-muted-foreground">
              Manage your profile, preferences, and activity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="w-20 h-20 mb-4">
                      <AvatarImage
                        src={session.user.image ?? "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-lg">
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">
                      {session.user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>

                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === "profile" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant={activeTab === "liked" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("liked")}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Liked Products
                    </Button>
                    <Button
                      variant={activeTab === "purchases" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("purchases")}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Purchases
                    </Button>
                    <Button
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Developer Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Read-only profile details */}
                    <ProfileDetails
                      user={profile}
                      onEdit={() => setEditMode(true)}
                    />
                    {/* Editable form, shown only when editMode is true */}
                    {editMode && (
                      <Dialog open={editMode} onOpenChange={setEditMode}>
                        <DialogContent showCloseButton>
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              handleUpdateProfile(formData);
                              setEditMode(false);
                            }}
                            className="space-y-6 mt-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  defaultValue={profile?.name || ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="displayName">
                                  Display Name
                                </Label>
                                <Input
                                  id="displayName"
                                  name="displayName"
                                  defaultValue={profile?.displayName || ""}
                                  placeholder="How you want to be shown publicly"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  name="username"
                                  defaultValue={profile?.username || ""}
                                  placeholder="@username"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  defaultValue={profile?.email || ""}
                                  disabled
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={profile?.bio || ""}
                                placeholder="Tell us about yourself and your expertise..."
                                rows={4}
                              />
                            </div>
                            <div>
                              <Label htmlFor="specialties">Specialties</Label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {selectedSpecialties.map((spec) => (
                                  <Badge
                                    key={spec}
                                    className="flex items-center gap-1 mt-2"
                                    variant="secondary"
                                  >
                                    {spec}
                                    <button
                                      type="button"
                                      className="ml-1"
                                      onClick={() =>
                                        setSelectedSpecialties((prev) =>
                                          prev.filter((s) => s !== spec)
                                        )
                                      }
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <Select
                                value=""
                                onValueChange={(value) => {
                                  if (
                                    value &&
                                    !selectedSpecialties.includes(value)
                                  ) {
                                    setSelectedSpecialties((prev) => [
                                      ...prev,
                                      value,
                                    ]);
                                  }
                                }}
                                disabled={specialtiesLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select specialties" />
                                </SelectTrigger>
                                <SelectContent>
                                  {specialtyOptions
                                    .filter(
                                      (s) =>
                                        !selectedSpecialties.includes(s.name)
                                    )
                                    .map((s) => (
                                      <SelectItem key={s.id} value={s.name}>
                                        {s.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <input
                                type="hidden"
                                name="specialties"
                                value={selectedSpecialties.join(",")}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  name="location"
                                  defaultValue={profile?.location || ""}
                                  placeholder="City, Country"
                                />
                              </div>
                              <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                  id="website"
                                  name="website"
                                  defaultValue={profile?.website || ""}
                                  placeholder="https://yourwebsite.com"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3">
                                Social Links
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="twitterUrl">Twitter</Label>
                                  <Input
                                    id="twitterUrl"
                                    name="twitterUrl"
                                    defaultValue={profile?.twitterUrl || ""}
                                    placeholder="https://twitter.com/username"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="instagramUrl">
                                    Instagram
                                  </Label>
                                  <Input
                                    id="instagramUrl"
                                    name="instagramUrl"
                                    defaultValue={profile?.instagramUrl || ""}
                                    placeholder="https://instagram.com/username"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="youtubeUrl">YouTube</Label>
                                  <Input
                                    id="youtubeUrl"
                                    name="youtubeUrl"
                                    defaultValue={profile?.youtubeUrl || ""}
                                    placeholder="https://youtube.com/@username"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="twitchUrl">Twitch</Label>
                                  <Input
                                    id="twitchUrl"
                                    name="twitchUrl"
                                    defaultValue={profile?.twitchUrl || ""}
                                    placeholder="https://twitch.tv/username"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button type="submit">Update Profile</Button>
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setEditMode(false)}
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "liked" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Liked Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {likedProducts.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No liked products yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Start exploring and like products you're interested in
                        </p>
                        <Link href="/explore">
                          <Button>Explore Products</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {likedProducts.map((product: any) => (
                          <div
                            key={product.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex gap-4">
                              <img
                                src={product.thumbnail || "/placeholder.svg"}
                                alt={product.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">
                                  {product.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  ${parseFloat(product.price).toLocaleString()}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Link href={`/product/${product.id}`}>
                                    <Button size="sm" variant="outline">
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "purchases" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {purchasedProducts.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No purchases yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Your purchased products will appear here
                        </p>
                        <Link href="/explore">
                          <Button>Start Shopping</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {purchasedProducts.map((purchase: any) => (
                          <div
                            key={purchase.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">
                                  {purchase.product.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Purchased on{" "}
                                  {new Date(
                                    purchase.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline">{purchase.status}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                ${parseFloat(purchase.amount).toLocaleString()}
                              </span>
                              <Link href={`/setup/${purchase.product.id}`}>
                                <Button size="sm" variant="outline">
                                  View Product
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Notifications</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Email Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive updates about your account via email
                              </p>
                            </div>
                            <Switch
                              checked={userSettings.emailNotifications}
                              onCheckedChange={(checked) =>
                                setUserSettings((prev) => ({
                                  ...prev,
                                  emailNotifications: checked,
                                }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Push Notifications</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive push notifications in your browser
                              </p>
                            </div>
                            <Switch
                              checked={userSettings.pushNotifications}
                              onCheckedChange={(checked) =>
                                setUserSettings((prev) => ({
                                  ...prev,
                                  pushNotifications: checked,
                                }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Marketing Emails</Label>
                              <p className="text-sm text-muted-foreground">
                                Receive promotional emails and updates
                              </p>
                            </div>
                            <Switch
                              checked={userSettings.marketingEmails}
                              onCheckedChange={(checked) =>
                                setUserSettings((prev) => ({
                                  ...prev,
                                  marketingEmails: checked,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-4">Privacy</h4>
                        <div>
                          <Label>Profile Visibility</Label>
                          <select
                            className="w-full mt-1 p-2 border rounded-md"
                            value={userSettings.profileVisibility}
                            onChange={(e) =>
                              setUserSettings((prev) => ({
                                ...prev,
                                profileVisibility: e.target.value,
                              }))
                            }
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      </div>

                      <Button onClick={handleUpdateSettings}>
                        Save Settings
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">
                        Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h4 className="font-semibold">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated
                            data. This action is irreversible.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => setIsDeleteDialogOpen(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete My Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete
                  your account, profile, purchases, and remove all of your data
                  from our servers.
                </p>
                <Label htmlFor="delete-confirm" className="mt-4 block">
                  Please type{" "}
                  <strong className="text-destructive">DELETE</strong> into the
                  box below to confirm.
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmationInput}
                  onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                  className="mt-2"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmationInput !== "DELETE"}
                >
                  I understand, delete my account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

// Restore ProfileDetails to only accept user and onEdit props
function ProfileDetails({ user, onEdit }: { user: any; onEdit: () => void }) {
  if (!user) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>
            {user.displayName?.charAt(0) || user.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-xl">
            {user.displayName || user.name}
          </h3>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div>
          <Label className="mb-1 block">Email</Label>
          <div className="bg-muted rounded px-3 py-2">{user.email}</div>
        </div>
        <div>
          <Label className="mb-1 block">Location</Label>
          <div className="bg-muted rounded px-3 py-2">
            {user.location || "-"}
          </div>
        </div>
        <div>
          <Label className="mb-1 block">Website</Label>
          <div className="bg-muted rounded px-3 py-2">
            {user.website || "-"}
          </div>
        </div>
        <div>
          <Label className="mb-1 block">Specialties</Label>
          <div className="bg-muted rounded px-3 py-2">
            {Array.isArray(user.specialties)
              ? user.specialties.join(", ")
              : user.specialties || "-"}
          </div>
        </div>
      </div>
      <div className="mb-2">
        <Label className="mb-1 block">Bio</Label>
        <div className="bg-muted rounded px-3 py-2 min-h-[48px]">
          {user.bio || "-"}
        </div>
      </div>
      <div className="mb-2">
        <Label className="mb-1 block">Social Links</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {user.twitterUrl && (
            <a
              href={user.twitterUrl}
              className="underline text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          )}
          {user.instagramUrl && (
            <a
              href={user.instagramUrl}
              className="underline text-pink-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}
          {user.youtubeUrl && (
            <a
              href={user.youtubeUrl}
              className="underline text-red-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          )}
          {user.twitchUrl && (
            <a
              href={user.twitchUrl}
              className="underline text-purple-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitch
            </a>
          )}
          {user.website && (
            <a
              href={user.website}
              className="underline text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          )}
          {!user.twitterUrl &&
            !user.instagramUrl &&
            !user.youtubeUrl &&
            !user.twitchUrl &&
            !user.website && <span className="text-muted-foreground">-</span>}
        </div>
      </div>
      <Button className="mt-4" onClick={onEdit}>
        <Edit className="w-4 h-4 mr-2" /> Edit Profile
      </Button>
    </div>
  );
}
