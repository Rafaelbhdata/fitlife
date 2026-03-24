"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Este email ya está registrado. Intenta iniciar sesión.");
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError("Error al crear cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md glass border-border/50">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-lime/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-lime" />
            </div>
          </div>
          <h2 className="font-display text-2xl tracking-wide mb-2">
            ¡CUENTA CREADA!
          </h2>
          <p className="text-muted-foreground mb-6">
            Revisa tu email para confirmar tu cuenta y luego inicia sesión.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-lime text-dark hover:bg-lime/90 font-semibold"
          >
            Ir a iniciar sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md glass border-border/50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-display text-3xl tracking-wide">
          CREAR CUENTA
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Únete a FitLife y comienza tu transformación
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 focus-visible:ring-lime/50"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 focus-visible:ring-lime/50"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 focus-visible:ring-lime/50"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/50 focus-visible:ring-lime/50"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-lime text-dark hover:bg-lime/90 font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
          <Link
            href="/login"
            className="text-lime hover:text-lime/80 font-medium transition-colors"
          >
            Inicia sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
