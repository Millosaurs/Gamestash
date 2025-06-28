// app/dashboard/connect/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiteHeader } from "@/components/sidebar/site-header";
import { useSession } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ConnectPage() {
  const { data: session, isPending } = useSession();
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchStripeAccount = async () => {
    if (!session?.user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/stripe/account");
      if (response.ok) {
        const data = await response.json();
        setStripeAccount(data);
      }
    } catch (error) {
      console.error("Error fetching Stripe account:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStripeAccount();
  }, [session]);

  const handleConnectStripe = async () => {
    setConnecting(true);
    try {
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        toast.error("Failed to connect Stripe account");
      }
    } catch (error) {
      console.error("Error connecting Stripe:", error);
      toast.error("Failed to connect Stripe account");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectStripe = async () => {
    setDisconnecting(true);
    try {
      const response = await fetch("/api/stripe/disconnect", {
        method: "POST",
      });

      if (response.ok) {
        await fetchStripeAccount();
        toast.success("Stripe account disconnected");
        setShowDisconnectDialog(false);
      } else {
        toast.error("Failed to disconnect Stripe account");
      }
    } catch (error) {
      console.error("Error disconnecting Stripe:", error);
      toast.error("Failed to disconnect Stripe account");
    } finally {
      setDisconnecting(false);
    }
  };

  if (isPending || loading) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session?.user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-display">
              Payment Settings
            </h1>
            <p className="text-muted-foreground">
              Connect your Stripe account to receive payments for your products
            </p>
          </div>

          {!stripeAccount ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Connect Stripe Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to connect a Stripe account to receive payments
                      for your products. Stripe is a secure payment processor
                      trusted by millions of businesses worldwide.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-medium mb-1">Secure Payments</h3>
                      <p className="text-sm text-muted-foreground">
                        Accept payments securely with industry-leading security
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h3 className="font-medium mb-1">Fast Payouts</h3>
                      <p className="text-sm text-muted-foreground">
                        Get paid quickly with automatic transfers to your bank
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h3 className="font-medium mb-1">Easy Setup</h3>
                      <p className="text-sm text-muted-foreground">
                        Quick and simple account setup process
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleConnectStripe}
                      disabled={connecting}
                      size="lg"
                      className="px-8 cursor"
                    >
                      {connecting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Connect with Stripe
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    By connecting your Stripe account, you agree to Stripe's{" "}
                    <a
                      href="https://stripe.com/legal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Stripe Account Connected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Account Status</h3>
                        <p className="text-sm text-muted-foreground">
                          Your Stripe account is connected and ready to receive
                          payments
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm">Account ID</h4>
                        <p className="text-sm text-muted-foreground font-mono">
                          {stripeAccount.id}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Connected</h4>
                        <p className="text-sm text-muted-foreground">
                          {stripeAccount.connectDate
                            ? new Date(
                                stripeAccount.connectDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" asChild>
                        <a
                          href="https://dashboard.stripe.com"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Stripe Dashboard
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setShowDisconnectDialog(true)}
                        className="cursor-pointer"
                      >
                        Disconnect Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payout Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Payouts are processed automatically by Stripe. You can
                        view detailed payout information in your Stripe
                        dashboard.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <h3 className="font-medium text-lg">$0</h3>
                        <p className="text-sm text-muted-foreground">
                          Pending Balance
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <h3 className="font-medium text-lg">$0</h3>
                        <p className="text-sm text-muted-foreground">
                          Available Balance
                        </p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <h3 className="font-medium text-lg">$0</h3>
                        <p className="text-sm text-muted-foreground">
                          Total Earnings
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* dialog */}
      <Dialog
        open={showDisconnectDialog}
        onOpenChange={setShowDisconnectDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Stripe Account</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to disconnect your Stripe account? You will
            not be able to receive payments until you reconnect.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisconnectDialog(false)}
              disabled={disconnecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnectStripe}
              disabled={disconnecting}
            >
              {disconnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
