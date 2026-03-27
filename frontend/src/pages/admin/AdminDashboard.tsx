
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useNavigate } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Header from '../../components/Header';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const AdminDashboard = () => {
    const {
        distribution,
        isDistLoading,
        stats,
        isStatsLoading,
        dynamics,
        isDynamicsLoading,
        recentVulns,
        isRecentLoading,
        error,
        assets,
        isAssetsLoading,
    } = useAdminDashboard();

    const navigate = useNavigate();

    const chartData = dynamics?.data || [];

    const criticalCount = distribution ? distribution.critical : 0;
    const totalVulns = distribution
        ? Object.values(distribution).reduce((a, b) => a + b, 0)
        : 0;

    if (error) {
        return (
            <div className="text-center py-20 text-red-600">
                Ошибка загрузки дашборда: {(error as Error).message}
            </div>
        );
    }

    return (
        <>
            <Header />
            <section className="relative min-h-screen bg-gray-50 py-20 md:pb-30 md:pt-30 px-4 md:px-10">
                <img
                    src="/src/assets/bg.jpg"
                    alt="фон"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                />

                <div className="relative z-10 md:max-w-7xl mx-auto md:px-6 md:pt-12">

                    <div className="flex justify-between items-center mb-4 md:mb-12">
                        <div>
                            <h1 className="md:text-4xl text-xl font-bold druk text-gray-900">Дашборд</h1>
                            <p className="md:text-lg text-base text-gray-600 mt-2">Обзор состояния безопасности</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-12">
                        <div className="backdrop-blur-lg bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-6 border border-gray-200">
                            <h3 className="md:text-lg text-base font-semibold text-gray-800">Активы в системе</h3>
                            <p className="md:text-5xl text-xl font-bold text-[#334e6c] mt-3">
                                {isStatsLoading ? '...' : stats?.total ?? 0}
                            </p>
                        </div>

                        <div className="backdrop-blur-lg bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-6 border border-gray-200">
                            <h3 className="md:text-lg text-base font-semibold text-gray-800">Обнаружено</h3>
                            <p className="md:text-5xl text-xl font-bold text-[#334e6c] mt-3">
                                {isDistLoading ? '...' : totalVulns}
                            </p>
                        </div>

                        <div className="backdrop-blur-lg bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-6 border border-gray-200">
                            <h3 className="md:text-lg text-base font-semibold text-gray-800">Критические риски</h3>
                            <p className="md:text-5xl text-xl font-bold text-[#334e6c] mt-3">
                                {isDistLoading ? '...' : criticalCount}
                            </p>
                        </div>

                        <div className="backdrop-blur-lg bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-6 border border-gray-200">
                            <h3 className="md:text-lg text-base font-semibold text-gray-800">Активные сканирования</h3>
                            <p className="md:text-5xl text-xl font-bold text-[#334e6c] mt-3">4</p>
                        </div>
                    </div>

                    <div className=" backdrop-blur-lg p-4 md:p-8 bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] border border-gray-200 mb-4 md:mb-12">
                        <div className="flex md:flex-row flex-col gap-2 md:justify-between md:items-center mb-4 md:mb-6">
                            <h3 className="text-xl font-bold text-[#334e6c]">Обзор безопасности</h3>
                            <select className="md:px-4 px-3 md:py-3 py-2 md:text-base text-sm border border-gray-400 rounded-lg h-10 md:h-12.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-45">
                                <option className='md:text-base text-sm'>Неделя</option>
                                <option className='md:text-base text-sm'>Месяц</option>
                            </select>
                        </div>

                        <div className="h-96">
                            {isDynamicsLoading ? (
                                <div className="h-full flex items-center justify-center text-gray-500">Загрузка...</div>
                            ) : chartData.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-500">Нет данных</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorFixed" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="period" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="new"
                                            name="Новые уязвимости"
                                            stroke="#ef4444"
                                            fillOpacity={1}
                                            fill="url(#colorNew)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="fixed"
                                            name="Исправленные"
                                            stroke="#22c55e"
                                            fillOpacity={1}
                                            fill="url(#colorFixed)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="backdrop-blur-lg rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-8 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">Активы</h3>
                            <div className="space-y-4 max-h-125 overflow-y-auto">
                                {isAssetsLoading ? (
                                    <div className="text-gray-500">Загрузка...</div>
                                ) : assets.length === 0 ? (
                                    <div className="text-gray-500">Активов пока нет</div>
                                ) : (
                                    assets.slice(0, 10).map((asset) => {
                                        const date = asset.scans[0]?.scannedAt ? new Date(String(asset.scans[0]?.scannedAt)) : 0;
                                        return (
                                            <div
                                                key={asset.id}
                                                className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition cursor-pointer"
                                                onClick={() => navigate(`/assets/${asset.id}`)}
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{asset.name}</p>
                                                    <p className="text-sm text-gray-600">{asset.ip}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-700">
                                                        {format(date, 'dd.MM.yyyy', { locale: ru })}
                                                    </p>
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${asset.criticality === 'critical'
                                                            ? 'bg-red-100 text-red-800'
                                                            : asset.criticality === 'high'
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : asset.criticality === 'medium'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}
                                                    >
                                                        {asset.criticality === "low" ? "Низкая" : asset.criticality === "medium" ? "Средняя" : asset.criticality === "high" ? "Высокая" : "Критичная"}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        <div className="bg-(--white) text-(--dark) rounded-[10px] backdrop-blur-lg shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-4 md:p-8 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Последние инциденты</h3>
                            <div className="space-y-4 max-h-125 overflow-y-auto">
                                {isRecentLoading ? (
                                    <div className="text-gray-500">Загрузка...</div>
                                ) : recentVulns?.length ? (
                                    recentVulns.map((vuln, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-lg h-fit">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">
                                                    CVSS оценка: {vuln.cvssScore ? vuln.cvssScore : 'Unknown'}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {format(new Date(vuln.detectedAt!), 'dd.MM.yyyy')}
                                                </span>
                                            </div>
                                            {vuln.cveId && <p className="text-sm text-gray-700 mt-1">CVE: {vuln.cveId}</p>}
                                            {vuln.description && <p className="text-sm text-gray-600 mt-1 max-w-125.5">{vuln.description}</p>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500">Нет новых инцидентов</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <SEO url='http://localhost:5173/admin/dashboard' noindex title="Админ панель" description="Администрирование системы" />
        </>
    );
};

export default AdminDashboard;