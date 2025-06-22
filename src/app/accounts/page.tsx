// app/accounts/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  User,
  Heart,
  ShoppingBag,
  Settings,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Header from "@/components/header";
import Link from "next/link";

export default function AccountsPage() {
  const { data: session, isPending } = useSession();
  const [likedProducts, setLikedProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // User settings state
  const [userSettings, setUserSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    profileVisibility: "public",
  });

  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user) return;

      setLoading(true);
      try {
        // Fetch liked products
        const likedResponse = await fetch("/api/user/liked-products");
        if (likedResponse.ok) {
          const likedData = await likedResponse.json();
          setLikedProducts(likedData);
        }

        // Fetch purchased products
        const purchasedResponse = await fetch("/api/user/purchased-products");
        if (purchasedResponse.ok) {
          const purchasedData = await purchasedResponse.json();
          setPurchasedProducts(purchasedData);
        }
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
        headers: {
          "Content-Type": "application/json",
        },
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

  if (isPending || loading) {
    return (
      <>
        <Header />
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
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleUpdateProfile(formData);
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={session.user.name || ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={session.user.email || ""}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>

                      <Button type="submit">Update Profile</Button>
                    </form>
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
                                  <Link href={`/setup/${product.id}`}>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
