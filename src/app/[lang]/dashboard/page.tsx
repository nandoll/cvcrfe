"use client";

// src/app/[lang]/dashboard/page.tsx
import React, { useState, useEffect, use } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Loading } from "@/components/ui/Loading";
import { useI18n } from "@/i18n/Provider";
import { Locale } from "@/i18n/config";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { authService } from "@/services/auth.service";
import { analyticsService } from "@/services/analytics.service";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface DashboardPageProps {
  params: Promise<{
    lang: Locale;
  }>;
}

export default function DashboardPage(props: DashboardPageProps) {
  const params = use(props.params);
  const { lang } = params;
  const { t, loadNamespaces } = useI18n();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 días atrás
    endDate: new Date().toISOString().split("T")[0], // Hoy
  });

  // Cargar el namespace del dashboard
  useEffect(() => {
    loadNamespaces(["dashboard"]);
  }, []);

  // Colores para gráficos
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = async () => {
      const storedToken = authService.getToken();
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, dateRange]);

  const fetchStats = async () => {
    try {
      setIsDataLoading(true);
      const data = await analyticsService.getStats(
        dateRange.startDate,
        dateRange.endDate,
        token || ""
      );
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Mostrar mensaje de error al usuario
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setToken(response.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      alert(t("errors.loginFailed", "dashboard"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    setIsAuthenticated(false);
    setStats(null);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Datos para el gráfico de visitas diarias
  const getDailyVisitData = () => {
    // Este sería un cálculo real con los datos del backend
    // Aquí simplemente generamos datos de ejemplo
    if (!stats) return [];

    const daysCount = 30;
    const result = [];
    const startDate = new Date(dateRange.startDate);

    for (let i = 0; i < daysCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];

      // Valor aleatorio entre el 60-100% del total diario esperado
      const factor = 0.6 + Math.random() * 0.4;
      const dailyAvg = stats.totalVisits / daysCount;

      result.push({
        date: dateStr,
        visits: Math.round(dailyAvg * factor),
      });
    }

    return result;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainLayout
        title={t("title", "dashboard")}
        description={t("description", "dashboard")}
      >
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {t("loginTitle", "dashboard")}
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("email", "dashboard")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("password", "dashboard")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("loggingIn", "dashboard")}
                </span>
              ) : (
                t("loginButton", "dashboard")
              )}
            </button>
          </form>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={t("title", "dashboard")}
      description={t("description", "dashboard")}
    >
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t("title", "dashboard")}</h1>

            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t("refreshButton", "dashboard")}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                {t("logoutButton", "dashboard")}
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">
              {t("dateRange", "dashboard")}
            </h2>
            <div className="flex flex-wrap gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("startDate", "dashboard")}
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("endDate", "dashboard")}
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchStats}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  disabled={isDataLoading}
                >
                  {isDataLoading
                    ? t("loading", "dashboard")
                    : t("applyFilter", "dashboard")}
                </button>
              </div>
            </div>
          </div>

          {isDataLoading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : !stats ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-500">
                {t("noData", "dashboard")}
              </h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title={t("totalVisits", "dashboard")}
                  value={stats.totalVisits}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  }
                  bgColor="bg-indigo-50"
                  textColor="text-indigo-700"
                />

                <StatCard
                  title={t("uniqueVisitors", "dashboard")}
                  value={stats.uniqueVisitors || 0}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  }
                  bgColor="bg-green-50"
                  textColor="text-green-700"
                />

                <StatCard
                  title={t("avgTimeOnPage", "dashboard")}
                  value={
                    stats.avgDuration
                      ? `${Math.round(stats.avgDuration / 60)} min`
                      : "N/A"
                  }
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  bgColor="bg-blue-50"
                  textColor="text-blue-700"
                />

                <StatCard
                  title={t("qrScans", "dashboard")}
                  value={
                    stats.visitsBySource
                      ? stats.visitsBySource
                          .filter((s: any) => s.source.startsWith("qr-"))
                          .reduce(
                            (sum: number, item: any) => sum + item.count,
                            0
                          )
                      : 0
                  }
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  }
                  bgColor="bg-purple-50"
                  textColor="text-purple-700"
                />
              </div>

              <div className="mb-8">
                <ChartCard
                  title={t("visitsOverTime", "dashboard")}
                  description={t("visitsOverTimeDesc", "dashboard")}
                  height="h-80"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getDailyVisitData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="visits"
                        name={t("visits", "dashboard")}
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Resto de gráficos y visualizaciones */}
              {/* ... mantener el código de gráficos ... */}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
