"use server";

import { signUpSchema } from "@/lib/schema";

export type SignUpState = {
  success: boolean;
  message?: string;
  fields?: {
    name: string;
    email: string;
  };
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export async function signUpAction(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Always echo back non-sensitive fields so the form can repopulate on error.
  // Password is intentionally excluded — never round-trip it.
  const fields = { name: raw.name, email: raw.email };

  const parsed = signUpSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fields,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    // TODO: replace with better-auth signup call
    // const result = await auth.api.signUpEmail({
    //   body: { name, email, password },
    // });
    // if (result.error) throw new Error(result.error.message);

    console.log("Sign up payload:", { name, email, password });

    await new Promise((r) => setTimeout(r, 500));

    return {
      success: true,
      message: "Account created! Redirecting…",
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong. Try again.";

    if (message.toLowerCase().includes("email")) {
      return {
        success: false,
        fields,
        errors: { email: [message] },
      };
    }

    return {
      success: false,
      fields,
      message,
    };
  }
}
