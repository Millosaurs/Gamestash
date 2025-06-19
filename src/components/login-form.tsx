"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Discord or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4 items-center justify-between">
                <Button
                  variant="outline"
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onClick={async () => {
                    await signIn.social(
                      {
                        provider: "discord",
                        callbackURL: "/dashboard",
                      },
                      {
                        onRequest: (ctx) => {
                          setLoading(true);
                        },
                        onResponse: (ctx) => {
                          setLoading(false);
                        },
                      }
                    );
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-black dark:text-white"
                  >
                    <path
                      fill="currentColor"
                      d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.07.07 0 0 0-.073.035c-.211.375-.444.864-.608 1.249a18.524 18.524 0 0 0-5.487 0 12.51 12.51 0 0 0-.617-1.249.07.07 0 0 0-.073-.035A19.736 19.736 0 0 0 3.677 4.369a.064.064 0 0 0-.03.027C.533 9.09-.32 13.579.099 18.021a.08.08 0 0 0 .028.056 19.993 19.993 0 0 0 5.993 3.03.07.07 0 0 0 .076-.027c.462-.63.874-1.295 1.226-1.994a.07.07 0 0 0-.038-.098 13.138 13.138 0 0 1-1.885-.9.07.07 0 0 1-.007-.116c.127-.094.254-.192.375-.291a.07.07 0 0 1 .073-.01c3.927 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .074.009c.122.099.248.198.376.292a.07.07 0 0 1-.006.116 12.298 12.298 0 0 1-1.886.899.07.07 0 0 0-.037.099c.36.698.772 1.362 1.225 1.993a.07.07 0 0 0 .076.028 19.941 19.941 0 0 0 6.002-3.03.07.07 0 0 0 .028-.055c.5-5.177-.838-9.637-3.548-13.625a.061.061 0 0 0-.03-.028ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.947 2.419-2.157 2.419Z"
                    />
                  </svg>
                  Login with Discord
                </Button>
                <Button
                  variant="outline"
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onClick={async () => {
                    await signIn.social(
                      {
                        provider: "google",
                        callbackURL: "/dashboard",
                      },
                      {
                        onRequest: (ctx) => {
                          setLoading(true);
                        },
                        onResponse: (ctx) => {
                          setLoading(false);
                        },
                      }
                    );
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
