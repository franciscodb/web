"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  DollarSign,
  User,
  Shield,
  AlertCircle,
} from "lucide-react";

/**
 * Marketplace Page - Lista de préstamos disponibles
 * 
 * Features:
 * - Lista de préstamos con filtros
 * - Búsqueda
 * - Detalles de cada préstamo
 * - Botones para solicitar o invertir
 */

type LoanType = "borrow" | "invest";

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<LoanType>("borrow");
  const [searchQuery, setSearchQuery] = useState("");

  // Datos MOCK de préstamos disponibles
  const mockLoans = [
    {
      id: 1,
      borrower: "carlos.eth",
      amount: 5000,
      interestRate: 12,
      term: 3,
      creditScore: 750,
      purpose: "Capital para negocio de tacos",
      funded: 2500,
      status: "funding",
      risk: "low",
    },
    {
      id: 2,
      borrower: "maria.eth",
      amount: 10000,
      interestRate: 15,
      term: 6,
      creditScore: 680,
      purpose: "Equipo para salón de belleza",
      funded: 7000,
      status: "funding",
      risk: "medium",
    },
    {
      id: 3,
      borrower: "0x742d...3a4f",
      amount: 3000,
      interestRate: 18,
      term: 2,
      creditScore: 580,
      purpose: "Gastos educativos",
      funded: 500,
      status: "funding",
      risk: "high",
    },
    {
      id: 4,
      borrower: "juan.eth",
      amount: 15000,
      interestRate: 10,
      term: 12,
      creditScore: 820,
      purpose: "Expansión de tienda de abarrotes",
      funded: 15000,
      status: "funded",
      risk: "low",
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return { text: "Bajo Riesgo", color: "text-green-600", bg: "bg-green-50" };
      case "medium":
        return { text: "Riesgo Medio", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "high":
        return { text: "Alto Riesgo", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { text: "Desconocido", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 600) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredLoans = mockLoans.filter((loan) =>
    loan.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Marketplace
        </h1>
        <p className="text-gray-600 mt-1">
          {viewMode === "borrow" ? "Solicita un préstamo o" : "Invierte en préstamos de"} la comunidad
        </p>
      </div>

      {/* Toggle entre Solicitar/Invertir */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "borrow" ? "primary" : "outline"}
              onClick={() => setViewMode("borrow")}
              className="flex-1"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Solicitar Préstamo
            </Button>
            <Button
              variant={viewMode === "invest" ? "primary" : "outline"}
              onClick={() => setViewMode("invest")}
              className="flex-1"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Invertir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por usuario o propósito..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Content basado en el modo */}
      {viewMode === "borrow" ? (
        // Vista de Solicitar Préstamo
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Solicitar Nuevo Préstamo</CardTitle>
            <CardDescription>
              Completa el formulario para solicitar un préstamo P2P
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Monto solicitado (MXN)"
                type="number"
                placeholder="5000"
                leftIcon={<DollarSign className="w-5 h-5" />}
                required
              />
              <Input
                label="Plazo (meses)"
                type="number"
                placeholder="3"
                leftIcon={<Clock className="w-5 h-5" />}
                required
              />
            </div>
            <Input
              label="Propósito del préstamo"
              placeholder="ej: Capital para mi negocio"
              required
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    Tu límite disponible
                  </p>
                  <p className="text-blue-700">
                    Basado en tu credit score de 750, puedes solicitar hasta $10,000 MXN
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary" size="lg" fullWidth>
              Solicitar Préstamo
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Vista de Invertir - Lista de préstamos
        <div className="space-y-4">
          {filteredLoans.map((loan) => {
            const riskInfo = getRiskColor(loan.risk);
            const fundedPercentage = (loan.funded / loan.amount) * 100;

            return (
              <Card key={loan.id} hover>
                <CardContent className="py-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Info principal */}
                    <div className="flex-1 space-y-3">
                      {/* Usuario y badge de riesgo */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            {loan.borrower}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskInfo.color} ${riskInfo.bg}`}>
                          {riskInfo.text}
                        </span>
                        {loan.status === "funded" && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium text-green-700 bg-green-100">
                            Fondeado ✓
                          </span>
                        )}
                      </div>

                      {/* Propósito */}
                      <p className="text-gray-700">{loan.purpose}</p>

                      {/* Detalles */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Monto</p>
                          <p className="font-semibold text-gray-900">
                            ${loan.amount.toLocaleString()} MXN
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Tasa</p>
                          <p className="font-semibold text-gray-900">
                            {loan.interestRate}% anual
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Plazo</p>
                          <p className="font-semibold text-gray-900">
                            {loan.term} meses
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Credit Score</p>
                          <p className={`font-semibold ${getScoreColor(loan.creditScore)}`}>
                            {loan.creditScore}
                          </p>
                        </div>
                      </div>

                      {/* Progress de financiamiento */}
                      {loan.status === "funding" && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">
                              Financiado: ${loan.funded.toLocaleString()} MXN
                            </span>
                            <span className="font-medium text-gray-900">
                              {fundedPercentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                              style={{ width: `${fundedPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Botón de acción */}
                    <div className="flex flex-col gap-2">
                      {loan.status === "funding" ? (
                        <>
                          <Button variant="primary" size="lg">
                            Invertir
                          </Button>
                          <Button variant="ghost" size="sm">
                            Ver Detalles
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="lg" disabled>
                          Préstamo Completo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Empty state si no hay resultados */}
          {filteredLoans.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No se encontraron préstamos que coincidan con tu búsqueda
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}