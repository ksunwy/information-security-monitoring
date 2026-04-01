import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SEO from '../../components/SEO';
import { useAssetAnalytics } from '../../hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from 'recharts';
import type { AssetAnalyticsData, CriticalityStat, StatusStat } from '../../types';
import DropdownNav from '../../components/DropdownNav';

const getCriticalityInfo = (criticality: string) => {
  const translations: Record<string, { label: string; color: string }> = {
    none: { label: 'Без критичности', color: '#9BB0BC' },
    low: { label: 'Низкая', color: '#22c55e' },
    medium: { label: 'Средняя', color: '#eab308' },
    high: { label: 'Высокая', color: '#f97316' },
    critical: { label: 'Критичная', color: '#ef4444' },
  };
  return translations[criticality] || { label: 'Неизвестно', color: '#9BB0BC' };
};

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

  const barStatusData = data.byStatus.map((item: StatusStat) => ({
    name: item.status,
    value: item.count,
  }));

  const barCriticalityData = data.byCriticality.map((item: CriticalityStat) => ({
    name: getCriticalityInfo(item.criticality).label,
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
          <div className="flex items-center justify-between mb-4 md:mb-10">
            <h1 className="md:text-4xl text-xl font-bold druk text-gray-900">
              Аналитика активов
            </h1>
            <DropdownNav />
          </div>

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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barStatusData}
                    margin={{ left: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      barSize={30}
                      radius={[10, 10, 0, 0]}
                    >
                      {barStatusData.map((entry, index) => {
                        const isOnline = entry.name === 'Онлайн';
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isOnline ? '#22c55e' : '#3B82F6'}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="backdrop-blur-lg p-4 md:p-8 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC]">
              <h3 className="md:text-xl text-lg font-semibold text-gray-800 mb-6 text-center">
                Распределение по критичности
              </h3>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barCriticalityData}
                    margin={{ left: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      barSize={30}
                      radius={[10, 10, 0, 0]}
                    >
                      {barCriticalityData.map((_, index) => {
                        const originalCriticality = data.byCriticality[index]?.criticality || 'none';
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={getCriticalityInfo(originalCriticality).color}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
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
