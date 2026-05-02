import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useVerifyEmail } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const verifyMutation = useVerifyEmail({
    mutation: {
      onSuccess: () => {
        setStatus("success");
      },
      onError: () => {
        setStatus("error");
      }
    }
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    verifyMutation.mutate({ data: { token } });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-background">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(253,230,138,0.05)_0%,rgba(0,0,0,0)_50%)] pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl text-center">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Verifying your email address...</p>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
                <p className="text-foreground font-medium mb-2">Email verified successfully!</p>
                <p className="text-sm text-muted-foreground">You can now log in to your account.</p>
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-foreground font-medium mb-2">Verification failed</p>
                <p className="text-sm text-muted-foreground">The link may be invalid or expired.</p>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 p-6">
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
