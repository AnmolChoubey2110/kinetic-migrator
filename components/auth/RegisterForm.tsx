"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextField } from "@/components/ui/TextField";
import {
  mockRegisterDefaults,
  registerCopy,
  registerPlaceholders,
  type RegisterFormValues,
} from "@/lib/mock/register";

type RegisterFormProps = {
  initialValues?: RegisterFormValues;
  onSubmit?: (values: RegisterFormValues) => void;
};

export function RegisterForm({
  initialValues = mockRegisterDefaults,
  onSubmit,
}: RegisterFormProps) {
  const [values, setValues] = useState<RegisterFormValues>(initialValues);

  function updateField<K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(values);
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-4">
        <TextField
          id="fullName"
          label={registerCopy.fullNameLabel}
          icon="person"
          type="text"
          placeholder={registerPlaceholders.fullName}
          value={values.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
          autoComplete="name"
        />

        <TextField
          id="email"
          label={registerCopy.emailLabel}
          icon="mail"
          type="email"
          placeholder={registerPlaceholders.email}
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          required
          autoComplete="email"
        />

        <TextField
          id="password"
          label={registerCopy.passwordLabel}
          icon="lock"
          type="password"
          placeholder={registerPlaceholders.password}
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          required
          autoComplete="new-password"
        />

        <TextField
          id="confirmPassword"
          label={registerCopy.confirmPasswordLabel}
          icon="lock"
          type="password"
          placeholder={registerPlaceholders.confirmPassword}
          value={values.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          required
          autoComplete="new-password"
        />

        <Checkbox
          id="terms"
          checked={values.agreeToTerms}
          onChange={(event) => updateField("agreeToTerms", event.target.checked)}
          required
          label={
            <>
              {registerCopy.termsPrefix}{" "}
              <a
                className="text-brand-blue transition-colors hover:text-primary"
                href="#"
              >
                {registerCopy.termsOfService}
              </a>{" "}
              &amp;{" "}
              <a
                className="text-brand-blue transition-colors hover:text-primary"
                href="#"
              >
                {registerCopy.privacyPolicy}
              </a>
            </>
          }
        />
      </div>

      <Button type="submit" fullWidth>
        {registerCopy.submitLabel}
      </Button>
    </form>
  );
}
