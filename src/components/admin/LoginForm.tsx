"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";
import { createClient } from "@/utils/supabase/client";

const INPUT_CLASS =
  "w-full rounded-lg border border-crema-oscura bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-verde focus:outline-none focus:ring-1 focus:ring-verde min-h-[44px]";

const ERROR_INPUT_CLASS =
  "w-full rounded-lg border border-red-400 bg-white px-4 py-2.5 text-texto placeholder:text-texto-suave focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-400 min-h-[44px]";

export function LoginForm() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setEnviando(true);
    setErrorLogin(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setErrorLogin(
          error.code === "invalid_credentials" ||
            error.message.includes("Invalid login credentials")
            ? "Correo o contraseña incorrectos."
            : "No se pudo iniciar sesión. Intente de nuevo."
        );
        return;
      }

      // Limpiar el historial: no volver al login al usar "atrás".
      router.replace("/admin");
      router.refresh();
    } catch {
      setErrorLogin("Ocurrió un error inesperado. Intente de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorLogin && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600"
        >
          {errorLogin}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-texto-suave">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          {...register("email")}
          className={errors.email ? ERROR_INPUT_CLASS : INPUT_CLASS}
          placeholder="usted@colchonesposada.lat"
        />
        {errors.email && (
          <span role="alert" aria-live="polite" className="mt-1 block text-xs text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-texto-suave">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-required="true"
          {...register("password")}
          className={errors.password ? ERROR_INPUT_CLASS : INPUT_CLASS}
          placeholder="••••••••"
        />
        {errors.password && (
          <span role="alert" aria-live="polite" className="mt-1 block text-xs text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-lg bg-verde px-4 py-3 font-semibold text-white transition hover:bg-verde-oscuro focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2 disabled:opacity-60"
      >
        {enviando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}