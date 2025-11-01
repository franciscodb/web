"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Wallet, Shield, Zap } from "lucide-react";

/**
 * Login Page - Conectar wallet
 * 
 * Features:
 * - ConnectButton de RainbowKit
 * - Redirección automática al dashboard al conectar
 * - Información sobre ENS y seguridad
 */
export default function LoginPage() {
  const router = useRouter();
  const { isConnected } = useAccount();

  // Redirigir al dashboard si ya está conectado
  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

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
            Conecta tu wallet para comenzar
          </p>
        </div>

        {/* Card principal */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Conectar Wallet</CardTitle>
            <CardDescription>
              Tu wallet es tu identidad en PrestaChain. Si tienes un ENS, lo usaremos para construir tu reputación.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ConnectButton centrado */}
            <div className="flex justify-center mb-6">
              <ConnectButton />
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Seguro y Privado</p>
                  <p className="text-gray-600">
                    Solo tú controlas tu wallet. No guardamos tus claves privadas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wallet className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">ENS Compatible</p>
                  <p className="text-gray-600">
                    Si tienes un nombre ENS (ej: nombre.eth), se usará como tu identidad.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Comenzar es Gratis</p>
                  <p className="text-gray-600">
                    Crea tu perfil y solicita tu primer préstamo sin costo.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Redes soportadas */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Soportamos Arbitrum Sepolia (testnet)
          </p>
          <p className="mt-2">
            ¿No tienes wallet?{" "}
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Instala MetaMask
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}