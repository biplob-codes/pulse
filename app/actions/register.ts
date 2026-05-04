"use server";
import { auth } from "@/lib/auth";
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

  const fields = { name: raw.name, email: raw.email };

  const parsed = signUpSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fields,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await auth.api.signUpEmail({
      body: { ...parsed.data },
    });
    // if (result.error) throw new Error(result.error.message);
    console.log(result);

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
