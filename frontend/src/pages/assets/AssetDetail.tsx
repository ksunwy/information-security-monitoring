import { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useAssetDetail } from '../../hooks/useAssetDetail';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import type { Scan, Vulnerability } from '../../types';

const AssetDetail = () => {
  const {
    id,
    asset,
    isLoading,
    error,
    scanMutation,
    navigate,
    getReportPDF,
    getReportCSV,
    deleteMutation,
    updateMutation,
  } = useAssetDetail();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: asset?.name || "",
    description: asset?.description || '',
  });

  useEffect(() => {
    if (asset) {
      setEditForm({
        name: asset.name,
        description: asset.description || '',
      });
    }
  }, [asset]);

  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [visibleVulnerabilities, setVisibleVulnerabilities] = useState<Vulnerability[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!asset?.vulnerabilities?.length) return;

    asset.vulnerabilities.forEach((vuln) => {
      const text = vuln.description;
      if (!text || translations[vuln.cveId!]) return;

      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ru&de=ksunnwy@gmail.com`)
        .then(res => res.json())
        .then(data => {
          setTranslations(prev => ({ ...prev, [vuln.cveId!]: data.responseData.translatedText }));
        })
        .catch(() => {
          setTranslations(prev => ({ ...prev, [vuln.cveId!]: text }));
        });
    });
  }, [asset?.vulnerabilities]);

  useEffect(() => {
    if (!asset?.vulnerabilities?.length) return;
    setVisibleVulnerabilities(asset.vulnerabilities.slice(0, visibleCount));
  }, [asset?.vulnerabilities, visibleCount]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount(prev => prev + 10);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-600">Загрузка...</div>;
  }

  if (error || !asset || !id) {
    return <div className="text-center py-20 text-red-600">Актив не найден</div>;
  }

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 py-20 md:pt-30 md:pb-30">
        <img
          src="/src/assets/bg.jpg"
          alt="фон"
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        />

        <div className="relative z-10 md:max-w-5xl mx-auto px-4 md:px-6 pt-0 md:pt-12">
          <div className="flex md:flex-row flex-col md:items-center md:justify-between md:gap-0 gap-4 mb-4 md:mb-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 rounded-full hover:bg-white transition"
              >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                {isEditing ? (
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="md:text-4xl text-xl font-bold druk text-gray-900 bg-white border rounded px-3 py-1"
                  />
                ) : (
                  <h1 className="md:text-4xl text-xl font-bold druk text-gray-900">{asset.name}</h1>
                )}
                <p className="text-base md:text-lg text-gray-600 mt-1">{asset.ip}</p>
              </div>
            </div>

            <button
              onClick={() => scanMutation.mutate()}
              disabled={scanMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#334E6C] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-lg"
            >
              <span className='flex items-center justify-center gap-2'>
                <PlayIcon className="w-5 h-5" />
                {scanMutation.isPending ? 'Сканируется...' : 'Сканировать сейчас'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-10">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Статус</h3>
              <span
                className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${asset.status === 'Онлайн' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
              >
                {asset.status === 'Онлайн' ? 'Онлайн' : 'Оффлайн'}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Критичность</h3>
              <span
                className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${asset?.criticality === 'critical'
                  ? 'bg-red-100 text-red-800'
                  : asset?.criticality === 'high'
                    ? 'bg-orange-100 text-orange-800'
                    : asset?.criticality === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
              >
                {asset?.criticality === "low" ? "Низкая" : asset?.criticality === "medium" ? "Средняя" : asset?.criticality === "high" ? "Высокая" : asset?.criticality === "critical" ? "Критичная" : "Низкая"}
              </span>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Последний скан</h3>
              <p className="text-gray-700">{format(new Date(asset.updatedAt!), 'dd.MM.yyyy') || 'Никогда'}</p>
            </div>
          </div>

          {(asset.description || isEditing) && (
            <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 mb-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Описание</h3>

              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Добавьте описание..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-700">
                  {asset.description || 'Описание отсутствует'}
                </p>
              )}
            </div>
          )}

          <div className="flex md:flex-row flex-col items-center gap-4 md:gap-6 mb-4 md:mb-10">
            <button onClick={() => getReportPDF(asset.id)} className="bg-white/90 hover:text-white hover:bg-blue-700 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 w-full">Скачать PDF-отчет</button>
            <button onClick={() => getReportCSV(asset.id)} className="bg-white/90 hover:text-white hover:bg-blue-700 backdrop-blur-lg rrounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 w-full">Скачать CSV-отчет</button>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Сканы</h3>
            {asset.scans?.length ? (
              <div className="space-y-4">
                {asset.scans.map((scan: Scan, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Статус: {scan.status === "completed" ? 'Завершён' : scan.status || 'Завершён'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {scan.scannedAt ? format(new Date(scan.scannedAt), 'dd.MM.yyyy HH:mm') : '-'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Сканов пока нет</p>
            )}
          </div>

          <div ref={containerRef} onScroll={handleScroll} className="bg-white/90 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 max-h-150 overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Уязвимости</h3>
            {visibleVulnerabilities?.length ? (
              <div className="space-y-4">
                {visibleVulnerabilities.map((vuln: Vulnerability, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${vuln.criticality === 'critical'
                      ? 'bg-red-50'
                      : vuln.criticality === 'high'
                        ? 'bg-orange-50'
                        : vuln.criticality === 'medium'
                          ? 'bg-yellow-50'
                          : 'bg-green-50'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        CVSS оценка: {vuln.cvssScore}
                      </span>
                      <span className="text-sm text-gray-600">
                        {vuln.fixed ? 'Исправлено' : 'Активна'}
                      </span>
                    </div>
                    {vuln.cveId && (
                      <p className="mt-2 text-sm text-gray-700">
                        <strong>CVE:</strong> {vuln.cveId}
                      </p>
                    )}
                    {vuln.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {translations[vuln.cveId!] && !translations[vuln.cveId!]?.includes('MYMEMORY WARNING')
                        ? translations[vuln.cveId!]
                        : vuln.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Уязвимостей пока нет</p>
            )}
          </div>
          <div className="md:mt-12 mt-6 flex items-center gap-3 justify-end">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              {isEditing ? 'Отмена' : 'Редактировать'}
            </button>
            {isEditing && (
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    updateMutation.mutate(editForm);
                    setIsEditing(false);
                  }}
                  disabled={updateMutation.isPending}
                  className="px-6 py-3 bg-[#334E6C] text-white rounded-lg hover:bg-blue-700"
                >
                  {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </button>
                {/* 
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: asset.name,
                      description: asset.description || '',
                    });
                  }}
                  className="px-6 py-2 border rounded-lg"
                >
                  Отмена
                </button> */}
              </div>
            )}
            <button
              onClick={() => {
                if (confirm('Ты точно хочешь удалить этот актив?')) {
                  deleteMutation.mutate();
                }
              }}
              disabled={deleteMutation.isPending}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition shadow-lg"
            >
              {deleteMutation.isPending ? 'Удаление...' : 'Удалить актив'}
            </button>
          </div>
        </div>
      </section>
      <Footer />
      <SEO
        title={`Актив ${id}`}
        description={`Информация об активе ${id} и связанных уязвимостях`}
        url={`https://localhost:5173/assets/${id}`}
        noindex
      />
    </>
  );
};

export default AssetDetail;