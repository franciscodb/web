"use client";

import { useState } from "react";
import { useENSClaim, useENSAvailability } from "@/src/hooks/useENSClaim";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { AlertCircle, CheckCircle2, Loader2, Sparkles, Globe } from "lucide-react";

interface ClaimENSCardProps {
  userId: string;
  onSuccess?: (subdomain: string) => void;
}

/**
 * Componente para reclamar ENS
 * 
 * Permite al usuario:
 * - Reclamar automáticamente un subdominio
 * - Elegir un subdominio personalizado
 * - Ver el estado del registro
 */
export function ClaimENSCard({ userId, onSuccess }: ClaimENSCardProps) {
  const [customMode, setCustomMode] = useState(false);
  const [customSubdomain, setCustomSubdomain] = useState("");
  
  const { claiming, success, error, subdomain, fullDomain, claimENS, reset } = useENSClaim(userId);
  const { checking, available, checkAvailability } = useENSAvailability();

  const handleAutoClaim = async () => {
    await claimENS();
    if (success && subdomain && onSuccess) {
      onSuccess(subdomain);
    }
  };

  const handleCustomClaim = async () => {
    if (!customSubdomain || customSubdomain.length < 3) {
      return;
    }
    await claimENS(customSubdomain);
    if (success && subdomain && onSuccess) {
      onSuccess(subdomain);
    }
  };

  const handleCheckAvailability = async () => {
    if (customSubdomain && customSubdomain.length >= 3) {
      await checkAvailability(customSubdomain);
    }
  };

  // Vista de éxito
  if (success && fullDomain) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                ¡Felicidades! 🎉
              </h3>
              <p className="text-green-700 mb-4">
                Tu identidad Web3 ha sido creada exitosamente
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-green-200">
                <Globe className="w-5 h-5 text-green-600" />
                <span className="font-mono font-semibold text-green-900">
                  {fullDomain}
                </span>
              </div>
            </div>

            <div className="text-sm text-green-700 space-y-1">
              <p>✓ Tu ENS está registrado en Arbitrum Sepolia</p>
              <p>✓ Apunta a tu wallet embebida</p>
              <p>✓ Listo para construir tu reputación on-chain</p>
            </div>

            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              className="mt-4"
            >
              Continuar al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vista principal
  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Reclama tu Identidad Web3
        </CardTitle>
        <CardDescription>
          Obtén tu propio subdominio .eth para construir tu reputación en la blockchain
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
              <Button
                onClick={reset}
                variant="ghost"
                size="sm"
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Opción automática */}
        {!customMode && (
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-3">
                Te asignaremos automáticamente un nombre único basado en tu wallet:
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-purple-900">
                  user[código].brightlend.eth
                </span>
              </div>
            </div>

            <Button
              onClick={handleAutoClaim}
              disabled={claiming}
              variant="primary"
              fullWidth
            >
              {claiming ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registrando en blockchain...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Reclamar ENS Automáticamente
                </>
              )}
            </Button>

            <button
              onClick={() => setCustomMode(true)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium w-full"
            >
              ¿Prefieres elegir tu propio nombre?
            </button>
          </div>
        )}

        {/* Opción personalizada */}
        {customMode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Elige tu subdominio
              </label>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={customSubdomain}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setCustomSubdomain(value);
                    }}
                    placeholder="tunombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={claiming}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo letras minúsculas, números y guiones (mín. 3 caracteres)
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  .brightlend.eth
                </div>
              </div>

              {/* Verificar disponibilidad */}
              {customSubdomain.length >= 3 && (
                <Button
                  onClick={handleCheckAvailability}
                  disabled={checking}
                  variant="outline"
                  size="sm"
                >
                  {checking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Disponibilidad"
                  )}
                </Button>
              )}

              {/* Resultado disponibilidad */}
              {available !== null && (
                <div className={`flex items-center gap-2 text-sm ${
                  available ? "text-green-600" : "text-red-600"
                }`}>
                  {available ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      ¡Disponible!
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      No disponible, prueba otro
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleCustomClaim}
              disabled={claiming || customSubdomain.length < 3 || (available === false)}
              variant="primary"
              fullWidth
            >
              {claiming ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registrando en blockchain...
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5 mr-2" />
                  Reclamar {customSubdomain}.brightlend.eth
                </>
              )}
            </Button>

            <button
              onClick={() => {
                setCustomMode(false);
                setCustomSubdomain("");
              }}
              className="text-sm text-gray-600 hover:text-gray-700 w-full"
              disabled={claiming}
            >
              ← Volver a opción automática
            </button>
          </div>
        )}

        {/* Info adicional */}
        <div className="pt-4 border-t border-purple-200">
          <p className="text-xs text-gray-600 text-center">
            🔐 Gratis • ⚡ Registro instantáneo • 🌐 Tu identidad Web3 para siempre
          </p>
        </div>
      </CardContent>
    </Card>
  );
}