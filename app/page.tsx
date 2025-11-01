import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/Card";
import { Wallet, Shield, TrendingUp, Users, Globe, Zap } from "lucide-react";

/**
 * Landing Page - Página de inicio pública
 * 
 * Secciones:
 * - Hero con CTA
 * - Características principales
 * - Cómo funciona
 * - Estadísticas
 * - Call to action final
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header/Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">PrestaChain</span>
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  BETA
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link href="/login">
              <Button variant="primary">
                Comenzar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Construido en Arbitrum para ETH Monterrey</span>
            </div>

            {/* Título */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Préstamos P2P donde
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                tu ENS es tu historial
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Accede a crédito sin banco. Paga desde Oxxo o SPEI. 
              Tu reputación on-chain abre puertas financieras.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" variant="primary">
                  <Wallet className="w-5 h-5 mr-2" />
                  Conectar Wallet
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="lg" variant="outline">
                  Ver Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { value: "$50K+", label: "Préstamos Activos" },
                { value: "500+", label: "Usuarios" },
                { value: "98%", label: "Tasa de Pago" },
                { value: "24h", label: "Aprobación" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué PrestaChain?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Finanzas descentralizadas accesibles para todos los mexicanos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Sin Requisitos Bancarios",
                description: "No necesitas historial crediticio tradicional. Tu ENS es tu identidad.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Globe,
                title: "Paga desde Oxxo",
                description: "Acepta pagos en efectivo desde cualquier Oxxo o con SPEI bancario.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: TrendingUp,
                title: "Construye tu Score",
                description: "Cada pago a tiempo mejora tu reputación on-chain permanentemente.",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: Users,
                title: "Círculos de Confianza",
                description: "Forma grupos con amigos para acceder a préstamos más grandes.",
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                icon: Zap,
                title: "Aprobación Rápida",
                description: "Recibe tu préstamo en menos de 24 horas. Sin papeleo.",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: Wallet,
                title: "Tasas Justas",
                description: "Tasas competitivas decididas por la comunidad, no por bancos.",
                color: "text-pink-600",
                bg: "bg-pink-50",
              },
            ].map((feature, index) => (
              <Card key={index} hover>
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-lg text-gray-600">
              En 3 simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Conecta tu Wallet",
                description: "Usa tu wallet con ENS como identidad digital. Sin registro complicado.",
              },
              {
                step: "02",
                title: "Solicita un Préstamo",
                description: "Elige el monto y plazo. Tu score determina tu límite disponible.",
              },
              {
                step: "03",
                title: "Recibe y Paga",
                description: "Recibe USDC o pesos. Paga desde Oxxo, SPEI o crypto directamente.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-7xl font-bold text-gray-100 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Listo para Acceder a Crédito Justo?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Únete a cientos de mexicanos que ya construyen su futuro financiero
          </p>
          <Link href="/login">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 border-none">
              Comenzar Ahora - Es Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-white">PrestaChain</span>
            </div>
            <p className="mb-4">
              Construido con ❤️ para ETH Monterrey 2025
            </p>
            <p className="text-sm">
              © 2025 PrestaChain. Powered by Arbitrum & ENS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}