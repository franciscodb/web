"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Wallet, Shield, Zap, Smartphone } from "lucide-react";

/**
 * Login Page - Autenticación con Privy
 * 
 * Features:
 * - Login con teléfono/email/wallet
 * - Creación automática de wallet embebida
 * - Redirección automática al dashboard
 * - Preparado para integración con ENS
 */
export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated, login, user } = usePrivy();

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  // Mostrar loading mientras Privy se inicializa
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a PrestaChain
          </h1>
          <p className="text-gray-600">
            Regístrate en segundos con tu teléfono
          </p>
        </div>

        {/* Card principal */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Acceso Simplificado</CardTitle>
            <CardDescription>
              Crea tu cuenta con tu número de teléfono o email. 
              Tu wallet se crea automáticamente.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Botón de login de Privy */}
            <div className="flex justify-center mb-6">
              <button
                onClick={login}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Comenzar Ahora
              </button>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Registro en Segundos</p>
                  <p className="text-gray-600">
                    Usa tu número de teléfono o email. Sin complicaciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wallet className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Wallet Automática</p>
                  <p className="text-gray-600">
                    Tu wallet se crea automáticamente. No necesitas saber de crypto.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Seguro y Privado</p>
                  <p className="text-gray-600">
                    Tu información está protegida con encriptación de nivel bancario.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Identidad Web3</p>
                  <p className="text-gray-600">
                    Obtendrás tu propio nombre .eth para construir tu reputación.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info adicional */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            🔒 Registro 100% seguro y gratuito
          </p>
          <p className="mt-2">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Términos de Servicio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}