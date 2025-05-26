// components/ui/form.tsx
"use client";

import * as React from "react";
import {
  useFormContext,
  Controller,
  FormProvider as RHFProvider,
  UseFormReturn,
  FieldValues,
  Path,
  FieldErrors,
  ControllerRenderProps,
  Control,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ----- FORMULAIRE PRINCIPAL -----
type FormProps = {
  children: React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

export function Form({ children, ...props }: FormProps) {
  return (
    <form {...props} className={cn("space-y-4", props.className)}>
      {children}
    </form>
  );
}

interface FormProviderProps<T extends FieldValues> {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
}

export function FormProvider<T extends FieldValues>({
  children,
  methods,
}: FormProviderProps<T>) {
  return <RHFProvider {...methods}>{children}</RHFProvider>;
}

// ----- FORM FIELD -----
type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  className?: string;
  render?: ({ field }: { field: ControllerRenderProps<T, Path<T>> }) => React.ReactNode;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  textarea = false,
  className,
  render,
}: FormFieldProps<T>) {
  const {
    formState: { errors },
  } = useFormContext<T>();

  const fieldError = (errors as FieldErrors<T>)[name];
  const errorMessage = fieldError && "message" in fieldError ? fieldError.message : null;

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          render ? (
            <FormControl>{render({ field })}</FormControl>
          ) : (
            <FormControl>
              {textarea ? (
                <Textarea
                  id={name}
                  placeholder={placeholder}
                  className={cn("w-full", className)}
                  {...field}
                />
              ) : (
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  className={cn("w-full", className)}
                  {...field}
                />
              )}
            </FormControl>
          )
        }
      />
      {errorMessage && <FormMessage>{String(errorMessage)}</FormMessage>}
    </FormItem>
  );
}

// ----- COMPOSANTS MANQUANTS -----
export function FormItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-sm font-medium">{children}</Label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>;
}

export function FormError({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>;
}

export function FormHelperText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}