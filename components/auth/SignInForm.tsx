"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextField } from "@/components/ui/TextField";
import {
  mockSignInDefaults,
  signInCopy,
  signInPlaceholders,
  type SignInFormValues,
} from "@/lib/mock/signin";

type SignInFormProps = {
  initialValues?: SignInFormValues;
  onSubmit?: (values: SignInFormValues) => void;
};

export function SignInForm({
  initialValues = mockSignInDefaults,
  onSubmit,
}: SignInFormProps) {
  const [values, setValues] = useState<SignInFormValues>(initialValues);
  const [showPassword, setShowPassword] = useState(false);

  function updateField<K extends keyof SignInFormValues>(
    key: K,
    value: SignInFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(values);
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <TextField
          id="email"
          label={signInCopy.emailLabel}
          icon="mail"
          type="email"
          placeholder={signInPlaceholders.email}
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
          autoComplete="email"
          glowVariant="primary"
        />

        <TextField
          id="password"
          label={signInCopy.passwordLabel}
          icon="lock"
          type={showPassword ? "text" : "password"}
          placeholder={signInPlaceholders.password}
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          required
          autoComplete="current-password"
          glowVariant="primary"
          labelEnd={
            <a
              href="#"
              className="font-body-sm text-body-sm text-primary transition-colors hover:text-primary-fixed"
            >
              {signInCopy.forgotPassword}
            </a>
          }
          endAdornment={
            <button
              type="button"
              className="text-on-surface-variant transition-colors hover:text-on-surface"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                name={showPassword ? "visibility_off" : "visibility"}
                className="text-[20px]"
              />
            </button>
          }
        />
      </div>

      <Button type="submit" fullWidth variant="primary" className="mt-2">
        {signInCopy.submitLabel}
        <Icon name="arrow_forward" className="text-[20px]" />
      </Button>
    </form>
  );
}
