import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCveList } from '../../hooks/useCve';
import { format } from 'date-fns';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const CveList = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const { vulnerabilities, totalResults, totalPages, currentPage, isLoading, error } = useCveList(keyword, page);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const getSeverityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 9.0) return 'bg-red-100 text-red-800';
    if (score >= 7.0) return 'bg-orange-100 text-orange-800';
    if (score >= 4.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 md:pb-30 py-20 md:pt-40 px-4 md:px-10">
        <img
          src="/src/assets/bg.jpg"
          alt="фон"
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        />

        <div className="relative z-10 md:max-w-7xl mx-auto md:px-6">
          <h1 className="text-4xl font-bold druk text-gray-900 mb-10">Поиск CVE</h1>

          <form onSubmit={handleSearch} className="mb-10">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-75 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по ключевым словам (apache, heartbleed, windows, CVE-2024-...)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#334E6C] text-white rounded-lg hover:bg-blue-700 transition shadow-md md:w-fit w-full"
              >
                Искать
              </button>
            </div>
          </form>

          {isLoading && <div className="text-center py-20 text-gray-600">Загрузка CVE...</div>}
          {error && <div className="text-center py-20 text-red-600">Ошибка: {(error as Error)?.message || 'Неизвестная ошибка'}</div>}

          {!isLoading && !error && (
            <>
              <p className="text-gray-600 mb-6 font-medium">
                Найдено: <span className="text-blue-600">{totalResults}</span> CVE
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vulnerabilities.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-gray-500 text-lg">
                    Ничего не найдено. Попробуйте другой запрос.
                  </div>
                ) : (
                  vulnerabilities.map(({ cve }) => {
                    const score = cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore;
                    const severityText = score
                      ? score >= 9 ? 'Критичный'
                        : score >= 7 ? 'Высокий'
                          : score >= 4 ? 'Средний'
                            : 'Низкий'
                      : 'Неизвестно';

                    return (
                      <div
                        key={cve.id}
                        onClick={() => navigate(`/cve/${cve.id}`)}
                        className="bg-(--white) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] backdrop-blur-lg p-6 border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{cve.id}</h3>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-4">
                          {cve.descriptions?.find(d => d.lang === 'en')?.value || 'Описание отсутствует'}
                        </p>
                        <div className="flex flex-wrap justify-between items-center gap-3">
                          <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getSeverityColor(score)}`}>
                            {severityText} {score ? `(${score.toFixed(1)})` : ''}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(cve.published), 'dd.MM.yyyy')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-full bg-white/80 hover:bg-white disabled:opacity-50 transition shadow-md"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                  </button>
                  <span className="text-lg font-medium text-gray-800">
                    Страница {currentPage} из {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-full bg-white/80 hover:bg-white disabled:opacity-50 transition shadow-md"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
      <SEO
        title="Список уязвимостей (CVE)"
        description="Актуальная база CVE уязвимостей с фильтрацией, анализом и деталями угроз."
        url="http://localhost:5173/cve"
      />
    </>
  );
};

export default CveList;