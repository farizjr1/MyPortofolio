import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useResetPassword } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const mutation = useResetPassword({
    mutation: {
      onSuccess: () => {
        setDone(true);
        toast({ title: "Password reset", description: "Your password has been updated. Please log in." });
        setTimeout(() => setLocation("/login"), 2500);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Reset failed",
          description: (error as { data?: { message?: string } }).data?.message || "Invalid or expired reset link.",
        });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ variant: "destructive", title: "Passwords do not match" });
      return;
    }
    mutation.mutate({ data: { token, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(253,230,138,0.05)_0%,rgba(0,0,0,0)_50%)] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Link>

        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {done ? (
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 text-primary flex flex-col items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <span>Password updated! Redirecting to login…</span>
              </div>
            ) : !token ? (
              <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
                Invalid reset link. Please request a new one from the{" "}
                <Link href="/forgot-password" className="underline">forgot password</Link> page.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50"
                    disabled={mutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="bg-background/50"
                    disabled={mutation.isPending}
                  />
                </div>
                <Button type="submit" className="w-full mt-6" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting…
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
