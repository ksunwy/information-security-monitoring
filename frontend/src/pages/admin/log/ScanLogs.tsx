import { format } from 'date-fns';
import Header from '../../../components/Header';
import { useLogs } from '../../../hooks/useLogs';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import Footer from '../../../components/Footer';
import SEO from '../../../components/SEO';

const ScanLogs = () => {
  const {
    logs,
    totalPages,
    currentPage,
    setPage,
    search,
    setSearch,
    isLoading,
    error,
  } = useLogs('scan');

  if (isLoading) return <div className="text-center py-20 text-gray-600">Загрузка логов сканирований...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Ошибка загрузки</div>;

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 pb-30 pt-40 px-10">
        <img
          src="/src/assets/bg.jpg"
          alt="фон"
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        />

        <div className="relative z-10 max-w-440 mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold druk text-gray-900">Логи сканирований</h1>
            <NavLink className={"opacity-80 transition-all duration-300 hover:text-[#334E6C]"} style={{ textDecoration: "underline" }} to={"/admin/logs/system"}>Посмотреть все логи</NavLink>
          </div>

          <div className="flex flex-wrap gap-6 items-center mb-10">
            <div className="flex-1 min-w-75 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по сообщению, имени пользователя..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
            </div>
          </div>

          <div className="bg-blue-300/10 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Время</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Сообщение</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                        Логов сканирований пока нет
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {format(new Date(log.timestamp), 'dd.MM.yyyy HH:mm:ss')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {log.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {log.user ? log.user.name || log.user.login : 'Система'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-6">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-white/80 hover:bg-white disabled:opacity-50 transition"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <span className="text-gray-700">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-white/80 hover:bg-white disabled:opacity-50 transition"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
      <SEO url='http://localhost:5173/admin/logs/scans' noindex title="Логи сканирований" description="Логи сканирований системы" />
    </>
  );
};

export default ScanLogs;