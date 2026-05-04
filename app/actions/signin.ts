"use server";
import { auth } from "@/lib/auth";
import { signInSchema } from "@/lib/schema";

export type SignInState = {
  success: boolean;
  message?: string;
  fields?: {
    email: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function signInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const fields = { email: raw.email };

  const parsed = signInSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fields,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: { ...parsed.data },
    });
    // if (result.error) throw new Error(result.error.message);
    console.log(result);

    return {
      success: true,
      message: "Signed in! Redirecting…",
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong. Try again.";

    if (message) {
      return {
        success: false,
        message,
      };
    }

    return {
      success: false,
      fields,
      message,
    };
  }
}
