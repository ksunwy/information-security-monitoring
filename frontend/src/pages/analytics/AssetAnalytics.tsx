import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SEO from '../../components/SEO';
import { useAssetAnalytics } from '../../hooks/useAnalytics';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { AssetAnalyticsData, CriticalityStat, StatusStat } from '../../types';

interface PieItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

const COLORS: string[] = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#6b7280'];

const AssetAnalytics = () => {
  const { data, isLoading, error } = useAssetAnalytics() as {
    data: AssetAnalyticsData;
    isLoading: boolean;
    error: unknown;
  };

  if (isLoading)
    return <div className="text-center py-20 text-gray-600">Загрузка аналитики активов...</div>;

  if (error)
    return <div className="text-center py-20 text-red-600">Ошибка загрузки</div>;

  const pieStatus: PieItem[] = data.byStatus.map((item: StatusStat) => ({
    name: item.status,
    value: item.count,
  }));

  const pieCriticality: PieItem[] = data.byCriticality.map(
    (item: CriticalityStat) => ({
      name: item.criticality,
      value: item.count,
    })
  );

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
          <h1 className="md:text-4xl text-xl font-bold druk text-gray-900 mb-10">
            Аналитика активов
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <div className="backdrop-blur-lg rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-8 text-center">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-4">
                Всего активов
              </h3>
              <p className="md:text-5xl text-2xl font-bold text-blue-600">{data.total}</p>
            </div>

            <div className="backdrop-blur-lg rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-8 text-center">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-4">
                Активов с уязвимостями
              </h3>
              <p className="md:text-5xl text-2xl font-bold text-red-600">{data.withVulns}</p>
            </div>

            <div className="backdrop-blur-lg rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-8">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-6 text-center">
                Распределение по статусам
              </h3>

              <div className="h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label
                    >
                      {pieStatus.map(
                        (_entry: PieItem, index: number) => (
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

            <div className="backdrop-blur-lg p-4 md:p-8 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC]">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-6 text-center">
                Распределение по критичности
              </h3>

              <div className="h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieCriticality}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      dataKey="value"
                      label
                    >
                      {pieCriticality.map(
                        (_entry: PieItem, index: number) => (
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
          </div>
        </div>
      </section>
      <Footer />
      <SEO
        title="Аналитика активов"
        description="Анализ активов в инфраструктуре"
        url="http://localhost:5173/analytics/assets"
        noindex
      />
    </>
  );
};

export default AssetAnalytics;
