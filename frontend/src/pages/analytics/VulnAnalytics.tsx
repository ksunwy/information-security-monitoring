import { useVulnAnalytics } from '../../hooks/useAnalytics';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { format } from 'date-fns';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

interface SeverityStat {
    severity: string;
    count: number;
}

interface TopCveStat {
    cveId: string | null;
    count: number;
}

interface RecentVuln {
    id: string | number;
    cveId: string | null;
    detectedAt: string;
    description: string | null;
}

interface VulnAnalyticsData {
    total: number;
    bySeverity: SeverityStat[];
    topCve: TopCveStat[];
    recent: RecentVuln[];
}

interface PieItem {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface BarItem {
    cve: string;
    count: number;
}


const COLORS: string[] = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#6b7280'];

const VulnAnalytics = () => {
    const { data, isLoading, error } = useVulnAnalytics() as {
        data: VulnAnalyticsData;
        isLoading: boolean;
        error: unknown;
    };

    if (isLoading)
        return (
            <div className="text-center py-20 text-gray-600">
                Загрузка аналитики уязвимостей...
            </div>
        );

    if (error)
        return (
            <div className="text-center py-20 text-red-600">
                Ошибка загрузки
            </div>
        );

    const pieData: PieItem[] = data.bySeverity.map(
        (item: SeverityStat) => ({
            name: item.severity,
            value: item.count,
        })
    );

    const barData: BarItem[] = data.topCve.map(
        (item: TopCveStat) => ({
            cve: item.cveId ?? 'Без CVE',
            count: item.count,
        })
    );

    return (
        <>
            <Header />
            <section className="relative min-h-screen bg-gray-50 pb-30 pt-40 px-10">
                <img
                    src="/src/assets/bg.jpg"
                    alt="фон"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold druk text-gray-900 mb-10">
                        Аналитика уязвимостей
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="backdrop-blur-lg rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-8 text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Всего уязвимостей
                            </h3>
                            <p className="text-5xl font-bold text-blue-600">{data.total}</p>
                        </div>

                        <div className="backdrop-blur-lg rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                Распределение по критичности
                            </h3>

                            {barData.length !== 0 ? (
                                <div className="h-80">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={120}
                                                dataKey="value"
                                                label={(props: PieLabelRenderProps) => {
                                                    const { name, percent } = props;

                                                    if (!name) return null;

                                                    return percent !== undefined
                                                        ? `${name === "low" ? "Низкая" : name === "medium" ? "Средняя" : name === "high" ? "Высокая" : "Критичная"} ${(percent * 100).toFixed(0)}%`
                                                        : name;
                                                }}
                                            >
                                                {pieData.map(
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
                            ) : <span className='opacity-80'>Нет данных</span>}
                        </div>

                        <div className="backdrop-blur-lg p-8 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] lg:col-span-2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                Топ-10 CVE по количеству
                            </h3>

                            {barData.length !== 0 ? (
                                <div className="h-80">
                                    <ResponsiveContainer>
                                        <BarChart data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="cve"
                                                angle={-45}
                                                textAnchor="end"
                                                height={70}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#3b82f6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : <span className='opacity-80'>Нет данных</span>}
                        </div>

                        <div className="backdrop-blur-lg p-8 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] lg:col-span-2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                Последние обнаруженные
                            </h3>

                            {data.recent.length !== 0 ? (
                                <div className="space-y-4">
                                    {data.recent.map((vuln: RecentVuln) => (
                                        <div
                                            key={vuln.id}
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex justify-between">
                                                <span className="font-medium">
                                                    {vuln.id ?? 'Нет CVE'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {format(
                                                        new Date(vuln.detectedAt),
                                                        'dd.MM.yyyy HH:mm'
                                                    )}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {vuln.description ?? 'Нет описания'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : <span className='opacity-80'>Нет данных</span>}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <SEO
                title="Аналитика уязвимостей"
                description="Анализ угроз и уязвимостей в инфраструктуре"
                url="http://localhost:5173/analytics/vulnerabilities"
                noindex
            />
        </>
    );
};

export default VulnAnalytics;
