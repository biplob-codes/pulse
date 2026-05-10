"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { signInAction, SignInState } from "../actions/signin";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p
      className="flex items-center gap-1.5 text-sm text-destructive"
      role="alert"
    >
      <AlertCircle className="size-3.5 shrink-0" />
      {messages[0]}
    </p>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

const initialState: SignInState = { success: false };

export default function SignInPage() {
  const [state, action, isPending] = useActionState(signInAction, initialState);

  useEffect(() => {
    if (state.success) {
      redirect("/dashboard");
    }
  }, [state.success]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Pulse</span>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue.
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() =>
            alert("Google sign-in isn't available yet — coming soon!")
          }
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            or
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Global error */}
        {!state.success && state.message && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form action={action} noValidate className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              defaultValue={state.fields?.email}
              aria-invalid={!!state.errors?.email}
              className={
                state.errors?.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            <FieldError messages={state.errors?.email} />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              aria-invalid={!!state.errors?.password}
              className={
                state.errors?.password
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            <FieldError messages={state.errors?.password} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || state.success}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="text-foreground font-medium underline underline-offset-4 hover:text-foreground/80 transition-colors"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
