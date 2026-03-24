import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SEO from '../../components/SEO';
import { useTrendsAnalytics } from '../../hooks/useAnalytics';
import { format } from 'date-fns';

const TrendsAnalytics = () => {
  const { data, isLoading, error } = useTrendsAnalytics();

  if (isLoading) return <div className="text-center py-20 text-gray-600">Загрузка трендов...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Ошибка загрузки</div>;

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 py-20 md:pb-30 md:pt-40 px-4 md:px-10">
        <img src="/src/assets/bg.jpg" alt="фон" className="absolute inset-0 w-full h-full object-cover opacity-30 z-0" />

        <div className="relative z-10 md:max-w-7xl mx-auto md:px-6">
          <h1 className="md:text-4xl text-xl font-bold druk text-gray-900 mb-4 md:mb-10">Тренды информационной безопасности</h1>

          <div className="rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] backdrop-blur-lg p-4 md:p-8 border border-gray-200">
            <p className="text-gray-600 mb-4 md:mb-6">
              Последние трендовые уязвимости из NVD
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.latest.map((item: any) => {
                const cve = item.cve;
                const score = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore;

                return (
                  <div key={cve.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{cve.id}</h3>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {cve.descriptions?.find((d: any) => d.lang === 'en')?.value || 'Нет описания'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${score >= 9 ? 'bg-red-100 text-red-800' :
                        score >= 7 ? 'bg-orange-100 text-orange-800' :
                          score >= 4 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {score ? score.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(cve.published), 'dd.MM.yyyy')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center mt-8 text-gray-600">
              Всего найдено трендовых CVE: <span className="font-bold">{data.totalFound}</span>
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <SEO
        title="Аналитика трендов"
        description="Анализ трендов"
        url="http://localhost:5173/analytics/trends"
        noindex
      />
    </>
  );
};

export default TrendsAnalytics;