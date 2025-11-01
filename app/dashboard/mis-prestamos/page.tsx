"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import {
  Wallet,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
} from "lucide-react";

/**
 * Mis Préstamos Page - Préstamos que el usuario ha solicitado
 * 
 * Features:
 * - Lista de préstamos activos e históricos
 * - Detalles de pagos
 * - Progreso de pago
 * - Botones de acción (pagar, ver detalles)
 */

type LoanStatus = "active" | "paid" | "overdue" | "pending";

export default function MisPrestamosPage() {
  const [filter, setFilter] = useState<LoanStatus | "all">("all");

  // Datos MOCK de préstamos del usuario
  const mockLoans = [
    {
      id: 1,
      amount: 5000,
      borrowed: 5000,
      paid: 2500,
      remaining: 2500,
      interestRate: 12,
      term: 3,
      startDate: "2025-08-01",
      nextPayment: "2025-11-15",
      daysUntilPayment: 14,
      monthlyPayment: 1666.67,
      status: "active" as LoanStatus,
      purpose: "Capital de trabajo para mi negocio",
      lenders: 3,
      creditScoreImpact: "+50",
    },
    {
      id: 2,
      amount: 3000,
      borrowed: 3000,
      paid: 3000,
      remaining: 0,
      interestRate: 15,
      term: 2,
      startDate: "2025-06-01",
      nextPayment: null,
      daysUntilPayment: null,
      monthlyPayment: 1500,
      status: "paid" as LoanStatus,
      purpose: "Reparación de equipo",
      lenders: 2,
      creditScoreImpact: "+75",
    },
    {
      id: 3,
      amount: 7000,
      borrowed: 7000,
      paid: 3500,
      remaining: 3500,
      interestRate: 10,
      term: 6,
      startDate: "2025-09-01",
      nextPayment: "2025-11-08",
      daysUntilPayment: 7,
      monthlyPayment: 1166.67,
      status: "active" as LoanStatus,
      purpose: "Expansión de inventario",
      lenders: 5,
      creditScoreImpact: "+25",
    },
  ];

  const getStatusInfo = (status: LoanStatus) => {
    switch (status) {
      case "active":
        return {
          text: "Activo",
          color: "text-blue-600",
          bg: "bg-blue-50",
          icon: Clock,
        };
      case "paid":
        return {
          text: "Pagado",
          color: "text-green-600",
          bg: "bg-green-50",
          icon: CheckCircle,
        };
      case "overdue":
        return {
          text: "Vencido",
          color: "text-red-600",
          bg: "bg-red-50",
          icon: AlertTriangle,
        };
      case "pending":
        return {
          text: "Pendiente",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          icon: Clock,
        };
    }
  };

  const filteredLoans = filter === "all" 
    ? mockLoans 
    : mockLoans.filter(loan => loan.status === filter);

  const stats = {
    totalBorrowed: mockLoans.reduce((acc, loan) => acc + loan.borrowed, 0),
    totalPaid: mockLoans.reduce((acc, loan) => acc + loan.paid, 0),
    totalRemaining: mockLoans.reduce((acc, loan) => acc + loan.remaining, 0),
    activeLoans: mockLoans.filter(loan => loan.status === "active").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Mis Préstamos
        </h1>
        <p className="text-gray-600 mt-1">
          Administra tus préstamos activos y revisa tu historial
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Prestado</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalBorrowed.toLocaleString()}
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
                <p className="text-sm text-gray-600 mb-1">Total Pagado</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Por Pagar</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${stats.totalRemaining.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Préstamos Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeLoans}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todos
            </Button>
            <Button
              variant={filter === "active" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Activos
            </Button>
            <Button
              variant={filter === "paid" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilter("paid")}
            >
              Pagados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de préstamos */}
      <div className="space-y-4">
        {filteredLoans.map((loan) => {
          const statusInfo = getStatusInfo(loan.status);
          const StatusIcon = statusInfo.icon;
          const paymentProgress = (loan.paid / loan.borrowed) * 100;

          return (
            <Card key={loan.id} variant="elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      Préstamo #{loan.id}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.text}
                      </span>
                    </CardTitle>
                    <CardDescription>{loan.purpose}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Detalles del préstamo */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Monto Original</p>
                    <p className="font-semibold text-gray-900">
                      ${loan.amount.toLocaleString()} MXN
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Tasa de Interés</p>
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
                    <p className="text-gray-500 mb-1">Prestamistas</p>
                    <p className="font-semibold text-gray-900">
                      {loan.lenders} personas
                    </p>
                  </div>
                </div>

                {/* Progress bar de pagos */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso de Pago</span>
                    <span className="font-medium text-gray-900">
                      {paymentProgress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        loan.status === "paid" 
                          ? "bg-green-600" 
                          : "bg-gradient-to-r from-blue-600 to-purple-600"
                      }`}
                      style={{ width: `${paymentProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-green-600 font-medium">
                      Pagado: ${loan.paid.toLocaleString()}
                    </span>
                    <span className="text-orange-600 font-medium">
                      Restante: ${loan.remaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Próximo pago - solo si está activo */}
                {loan.status === "active" && loan.nextPayment && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900">
                          Próximo Pago: ${loan.monthlyPayment.toLocaleString()} MXN
                        </p>
                        <p className="text-sm text-orange-700">
                          Vence el {new Date(loan.nextPayment).toLocaleDateString("es-MX")} 
                          {loan.daysUntilPayment && loan.daysUntilPayment <= 7 && (
                            <span className="font-medium"> (En {loan.daysUntilPayment} días)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Credit score impact */}
                {loan.status === "paid" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Credit Score +{loan.creditScoreImpact}
                        </p>
                        <p className="text-sm text-green-700">
                          ¡Felicidades! Completaste este préstamo exitosamente
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                {loan.status === "active" && (
                  <>
                    <Button variant="primary" className="flex-1">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pagar Ahora
                    </Button>
                    <Button variant="outline">
                      Ver Detalles
                    </Button>
                  </>
                )}
                {loan.status === "paid" && (
                  <Button variant="outline" fullWidth>
                    Ver Historial de Pagos
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}