import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { NavLink } from 'react-router-dom';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

interface VulnDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface AssetStats {
  total: number;
  withVulns: number;
}

const Dashboard = () => {
  const { user } = useAuth();

  const { data: distribution, isLoading: distLoading } = useQuery<VulnDistribution>({
    queryKey: ['vuln-distribution'],
    queryFn: () => api.get('/dashboards/vuln-distribution').then(res => res.data),
  });

  const { data: stats, isLoading: statsLoading } = useQuery<AssetStats>({
    queryKey: ['asset-stats'],
    queryFn: () => api.get('/dashboards/asset-stats').then(res => res.data),
  });

  const { data: vulnDynamicsData, isLoading: vulnDynamicsLoading } = useQuery({
    queryKey: ['vuln-dynamics'],
    queryFn: () => api.get('/dashboards/vuln-dynamics').then(res => res.data),
  });

  const pieData = distribution
    ? [
      { name: 'Низкая', value: distribution.low, color: COLORS[0] },
      { name: 'Средняя', value: distribution.medium, color: COLORS[1] },
      { name: 'Высокая', value: distribution.high, color: COLORS[2] },
      { name: 'Критичная', value: distribution.critical, color: COLORS[3] },
    ]
    : [];


  const totalVulns = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 pt-40 px-10">
        <img src="/src/assets/bg.jpg" alt="фон" className="absolute top-0 left-0 w-full h-full object-cover z-1 opacity-40" />
        <div className="relative flex items-center justify-between max-w-440 mx-auto z-10">
          <div className='flex items-center gap-3'>
            <h1 className="text-3xl font-semibold text-(--dark)">Дашборд</h1>
            <p className="mt-1 text-sm text-gray-600">
              {user?.name || user?.login || 'Пользователь'}
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <NavLink
              to="/assets/new"
              className="flex items-center justify-center px-6 py-3 border border-transparent font-medium rounded-md shadow-sm text-[#E3F0F8] bg-[#334E6C] hover:bg-blue-700"
            >
              Добавить актив
            </NavLink>
            <NavLink
              to="/assets"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-[#E3F0F8] bg-[#334E6C] hover:bg-blue-700"
            >
              Перейти к активам
            </NavLink>
            <NavLink
              to="/analytics/reports"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-[#E3F0F8] hover:bg-gray-50"
            >
              Скачать отчёты
            </NavLink>
          </div>
        </div>

        <main className="relative max-w-440 mx-auto pt-8 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="w-full bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC]">
              <div className="p-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Всего активов</dt>
                  <dd>
                    <div className="text-3xl font-semibold">
                      {statsLoading ? '...' : stats?.total ?? 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>

            <div className="w-full bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC]">
              <div className="p-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">С уязвимостями</dt>
                  <dd>
                    <div className="text-3xl font-semibold">
                      {statsLoading ? '...' : stats?.withVulns ?? 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>

            <div className="w-full bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC]">
              <div className="p-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Всего уязвимостей</dt>
                  <dd>
                    <div className="text-3xl font-semibold">
                      {distLoading ? '...' : totalVulns}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-6">
              <h3 className="text-lg font-medium mb-4">Распределение уязвимостей по критичности</h3>
              {distLoading ? (
                <div className="h-64 flex items-center justify-center">Загрузка...</div>
              ) : totalVulns === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Нет данных по уязвимостям
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${percent !== 0 ? `${name} ${(Number(percent) * 100).toFixed(0)}%` : ""}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <NavLink className={"pt-2 opacity-80 transition-all duration-300 hover:text-[#334E6C]"} to={"/analytics/vulnerabilities"}>Аналитика уязвимостей</NavLink>
            </div>

            <div className="w-full bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span>Динамика уязвимостей</span>
                <span className="text-sm text-gray-500">за последние 6 месяцев</span>
              </h3>

              <div className="h-80">
                {vulnDynamicsLoading ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Загрузка графика...
                  </div>
                ) : vulnDynamicsData?.data?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={vulnDynamicsData.data}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="period" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px' }} />

                      <Line
                        type="monotone"
                        dataKey="new"
                        name="Новые уязвимости"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />

                      <Line
                        type="monotone"
                        dataKey="fixed"
                        name="Исправленные уязвимости"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Нет данных по динамике уязвимостей
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </section>
      <Footer />
      <SEO
        title="Дашборд"
        description="Обзор состояния безопасности и уязвимостей"
        url="http://localhost:5173/dashboard"
        noindex
      />
    </>
  );
};

export default Dashboard;