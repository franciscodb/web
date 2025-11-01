"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  PieChart,
  ArrowUpRight,
  Clock,
  User,
  CheckCircle,
} from "lucide-react";

/**
 * Mis Inversiones Page - Inversiones del usuario en préstamos
 * 
 * Features:
 * - Portfolio overview
 * - Lista de inversiones activas
 * - ROI y earnings tracking
 * - Detalles de cada inversión
 */

type InvestmentStatus = "active" | "completed" | "pending";

export default function MisInversionesPage() {
  const [filter, setFilter] = useState<InvestmentStatus | "all">("all");

  // Datos MOCK de inversiones
  const mockInvestments = [
    {
      id: 1,
      loanId: 101,
      borrower: "carlos.eth",
      creditScore: 750,
      amountInvested: 2500,
      interestRate: 12,
      term: 3,
      monthlyReturn: 100,
      totalReturn: 300,
      received: 100,
      startDate: "2025-08-01",
      nextPayment: "2025-11-15",
      status: "active" as InvestmentStatus,
      risk: "low",
      purpose: "Capital para negocio",
    },
    {
      id: 2,
      loanId: 102,
      borrower: "maria.eth",
      creditScore: 680,
      amountInvested: 5000,
      interestRate: 15,
      term: 6,
      monthlyReturn: 250,
      totalReturn: 1500,
      received: 500,
      startDate: "2025-09-01",
      nextPayment: "2025-11-10",
      status: "active" as InvestmentStatus,
      risk: "medium",
      purpose: "Expansión de negocio",
    },
    {
      id: 3,
      loanId: 103,
      borrower: "juan.eth",
      creditScore: 820,
      amountInvested: 7500,
      interestRate: 10,
      term: 12,
      monthlyReturn: 312.5,
      totalReturn: 3750,
      received: 3750,
      startDate: "2025-01-01",
      nextPayment: null,
      status: "completed" as InvestmentStatus,
      risk: "low",
      purpose: "Compra de equipo",
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return { text: "Bajo", color: "text-green-600", bg: "bg-green-50" };
      case "medium":
        return { text: "Medio", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "high":
        return { text: "Alto", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { text: "N/A", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const getStatusInfo = (status: InvestmentStatus) => {
    switch (status) {
      case "active":
        return { text: "Activo", color: "text-blue-600", bg: "bg-blue-50" };
      case "completed":
        return { text: "Completado", color: "text-green-600", bg: "bg-green-50" };
      case "pending":
        return { text: "Pendiente", color: "text-yellow-600", bg: "bg-yellow-50" };
    }
  };

  const filteredInvestments = filter === "all"
    ? mockInvestments
    : mockInvestments.filter(inv => inv.status === filter);

  const stats = {
    totalInvested: mockInvestments.reduce((acc, inv) => acc + inv.amountInvested, 0),
    totalReturns: mockInvestments.reduce((acc, inv) => acc + inv.totalReturn, 0),
    totalReceived: mockInvestments.reduce((acc, inv) => acc + inv.received, 0),
    activeInvestments: mockInvestments.filter(inv => inv.status === "active").length,
    avgROI: (
      mockInvestments.reduce((acc, inv) => acc + inv.interestRate, 0) /
      mockInvestments.length
    ).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Mis Inversiones
        </h1>
        <p className="text-gray-600 mt-1">
          Administra tu portfolio y ganancias
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Invertido</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalInvested.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ganancias Totales</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalReturns.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Recibido</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${stats.totalReceived.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ROI Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgROI}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.activeInvestments} activas
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Overview */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Resumen de Portfolio</CardTitle>
          <CardDescription>
            Tu rendimiento acumulado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ROI Total */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Retorno sobre Inversión (ROI)</span>
                <span className="font-semibold text-green-600">
                  +{((stats.totalReturns / stats.totalInvested) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (stats.totalReturns / stats.totalInvested) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Distribución por riesgo */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Bajo Riesgo</p>
                <p className="text-xl font-bold text-green-600">
                  {mockInvestments.filter(inv => inv.risk === "low").length}
                </p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Riesgo Medio</p>
                <p className="text-xl font-bold text-yellow-600">
                  {mockInvestments.filter(inv => inv.risk === "medium").length}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Alto Riesgo</p>
                <p className="text-xl font-bold text-red-600">
                  {mockInvestments.filter(inv => inv.risk === "high").length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Button
              variant={filter === "active" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Activas
            </Button>
            <Button
              variant={filter === "completed" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completadas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de inversiones */}
      <div className="space-y-4">
        {filteredInvestments.map((investment) => {
          const riskInfo = getRiskColor(investment.risk);
          const statusInfo = getStatusInfo(investment.status);
          const returnProgress = (investment.received / investment.totalReturn) * 100;

          return (
            <Card key={investment.id} variant="elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        {investment.borrower}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskInfo.color} ${riskInfo.bg}`}>
                        Riesgo {riskInfo.text}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg}`}>
                        {statusInfo.text}
                      </span>
                    </CardTitle>
                    <CardDescription>{investment.purpose}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Detalles de la inversión */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Monto Invertido</p>
                    <p className="font-semibold text-gray-900">
                      ${investment.amountInvested.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Tasa de Interés</p>
                    <p className="font-semibold text-gray-900">
                      {investment.interestRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Retorno Mensual</p>
                    <p className="font-semibold text-green-600">
                      ${investment.monthlyReturn.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Credit Score</p>
                    <p className="font-semibold text-blue-600">
                      {investment.creditScore}
                    </p>
                  </div>
                </div>

                {/* Progress de retornos */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso de Retornos</span>
                    <span className="font-medium text-gray-900">
                      {returnProgress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        investment.status === "completed"
                          ? "bg-green-600"
                          : "bg-gradient-to-r from-blue-600 to-purple-600"
                      }`}
                      style={{ width: `${returnProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-green-600 font-medium">
                      Recibido: ${investment.received.toLocaleString()}
                    </span>
                    <span className="text-gray-600 font-medium">
                      Total: ${investment.totalReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Próximo pago esperado */}
                {investment.status === "active" && investment.nextPayment && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Próximo Pago: ${investment.monthlyReturn.toLocaleString()} MXN
                        </p>
                        <p className="text-sm text-blue-700">
                          Esperado el {new Date(investment.nextPayment).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completado */}
                {investment.status === "completed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Inversión Completada
                        </p>
                        <p className="text-sm text-green-700">
                          ROI Total: +{((investment.totalReturn / investment.amountInvested) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" fullWidth>
                  Ver Detalles
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}