import { useAssets } from '../../hooks/useAssets';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import { format } from 'date-fns';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import type { Asset } from '../../types';

const Assets = () => {
  const {
    assets,
    isLoading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    sort,
    toggleSort,
    scanAsset,
    isScanning,
  } = useAssets();

  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-10 text-gray-600">Загрузка активов...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Ошибка загрузки: {(error as Error).message}</div>;
  }

  return (
    <>
      <Header />
      <img src="/src/assets/bg.jpg" alt="фон" className="absolute top-0 left-0 w-full h-full object-cover z-1 opacity-40" />
      <section className="relative p-4 md:p-6 max-w-none md:max-w-440 md:pb-0 pb-20 min-h-screen mx-auto pt-20 md:pt-40 md:px-10">
        <div className="relative flex md:flex-row flex-col md:justify-between md:items-center md:gap-0 gap-3 mb-4 md:mb-6 z-10">
          <h1 className="text-xl md:text-3xl font-bold druk">АКТИВЫ</h1>
          <Link
            to="/assets/new"
            className="flex items-center justify-center gap-2 px-5 bg-(--white) text-(--dark) py-2 h-12.75 hover:bg-blue-100 disabled:opacity-50 rounded-[10px] [box-shadow:0px_16.2552px_46.7671px_rgba(9,14,34,0.25),inset_-10.1276px_1.64095px_20px_#334E6C] transition"
          >
            <span className='flex items-center justify-center gap-2 mt-1.5'>
              <PlusIcon className="w-5 h-5" />
              <span className='md:text-base text-sm'>Добавить актив</span>
            </span>
          </Link>
        </div>

        <div className="relative rounded-xl md:p-5 mb-6 z-10">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-60 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по IP или имени..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border md:text-base text-sm border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filters.group}
              onChange={(e) => setFilters({ ...filters, group: e.target.value })}
              className="px-4 py-3 border md:text-base text-sm border-gray-400 rounded-lg h-12.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-40"
            >
              <option value="">Группа</option>
              <option value="Веб-серверы">Веб-серверы</option>
              <option value="Сеть">Сеть</option>
              <option value="БД">Базы данных</option>
            </select>

            <select
              value={filters.criticality}
              onChange={(e) => setFilters({ ...filters, criticality: e.target.value })}
              className="px-4 py-3 md:text-base text-sm border border-gray-400 rounded-lg h-12.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-40"
            >
              <option value="">Критичность</option>
              <option value="low">Низкая</option>
              <option value="medium">Средняя</option>
              <option value="high">Высокая</option>
              <option value="critical">Критическая</option>
            </select>

            <select
              value={filters.owner}
              onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
              className="px-4 py-3 md:text-base text-sm border border-gray-400 rounded-lg h-12.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-40"
            >
              <option value="">Владелец</option>
              <option value="Админ">Админ</option>
              <option value="Команда">Команда</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 md:text-base text-sm border border-gray-400 rounded-lg h-12.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-40"
            >
              <option value="">Статус</option>
              <option value="Онлайн">Онлайн</option>
              <option value="Оффлайн">Оффлайн</option>
            </select>
          </div>
        </div>

        <div className="relative bg-blue-300/10 shadow rounded-xl overflow-hidden z-10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { label: 'IP/Домен', key: 'ip' },
                    { label: 'Имя', key: 'name' },
                    { label: 'Группа', key: 'group' },
                    { label: 'Критичность', key: 'criticality' },
                    { label: 'Статус', key: 'status' },
                    { label: 'Последний скан', key: 'lastScan' },
                    { label: 'Уязвимости', key: 'vulnerabilities' },
                    { label: 'Действия', key: 'actions' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleSort(col.key as keyof Asset)}
                    >
                      {col.label}
                      {sort.key === col.key && (sort.direction === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      Активы не найдены. Добавьте новый актив.
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr onClick={() => navigate(`/assets/${asset.id}`)} key={asset.id} className="bg-transparent hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {asset.ip}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {asset.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {asset.group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${asset.criticality === 'critical'
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${asset.status === 'Онлайн' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {format(new Date(asset.updatedAt!), 'dd.MM.yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {asset.vulnerabilities.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            scanAsset(asset.id);
                          }}
                          disabled={isScanning}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 transition"
                        >
                          Сканировать
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
      <SEO
        title="Активы"
        description="Управление активами и инфраструктурой"
        url="http://localhost:5173/assets"
        noindex
      />
    </>
  );
};

export default Assets;