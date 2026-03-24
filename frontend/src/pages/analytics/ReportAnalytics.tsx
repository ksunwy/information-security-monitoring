import { useReportAnalytics } from '../../hooks/useAnalytics';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import type { AnalyticsData, RecentReport, ReportTypeStat } from '../../types';

const COLORS: string[] = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e'];

const ReportAnalytics = () => {
  const { data, isLoading, error } = useReportAnalytics() as {
    data: AnalyticsData;
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading)
    return <div className="text-center py-20 text-gray-600">Загрузка аналитики отчётов...</div>;

  if (error)
    return <div className="text-center py-20 text-red-600">Ошибка загрузки</div>;

  const pieType = data.byType.map((item: ReportTypeStat) => ({
    name: item.type,
    value: item.count,
  }));

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 py-20 md:pb-30 md:pt-40 px-4 md:px-10">
        <img
          src="/src/assets/bg.jpg"
          alt="фон"
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        />

        <div className="relative z-10 md:max-w-7xl mx-auto md:px-6">
          <h1 className="md:text-4xl text-xl font-bold druk text-gray-900 mb-4 md:mb-10">
            Аналитика отчётов
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <div className="backdrop-blur-lg p-4 md:p-8 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] text-center">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-4">
                Всего отчётов
              </h3>
              <p className="md:text-5xl text-2xl font-bold text-blue-600">{data.total}</p>
            </div>

            <div className="backdrop-blur-lg p-4 md:p-8 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC]">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-6 text-center">
                Распределение по типам
              </h3>

              <div className="h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieType}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label
                    >
                      {pieType.map(
                        (_entry: { name: string; value: number }, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="backdrop-blur-lg p-4 md:p-8 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] lg:col-span-2">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-6">
                Последние отчёты
              </h3>

              <div className="space-y-4">
                {data.recent.map((report: RecentReport) => (
                  <div
                    key={report.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {report.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {report.type} • {report.status}
                        </p>
                      </div>

                      <span className="text-sm text-gray-500">
                        {format(new Date(report.createdAt), 'dd.MM.yyyy HH:mm')}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-2">
                      Актив: {report.assetName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <SEO
        title="Аналитика отчетов"
        description="Анализ отчетов в инфраструктуре"
        url="http://localhost:5173/analytics/assets"
        noindex
      />
    </>
  );
};

export default ReportAnalytics;
