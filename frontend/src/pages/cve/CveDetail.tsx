import { useParams, useNavigate } from 'react-router-dom';
import { useCveDetail } from '../../hooks/useCveDetail';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const getSeverity = (score?: number) => {
    if (!score) return 'Неизвестно';
    if (score >= 9) return 'Критичный';
    if (score >= 7) return 'Высокий';
    if (score >= 4) return 'Средний';
    return 'Низкий';
};

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'Критичный':
            return 'bg-red-100 text-red-800 border-red-300';
        case 'Высокий':
            return 'bg-orange-100 text-orange-800 border-orange-300';
        case 'Средний':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        default:
            return 'bg-green-100 text-green-800 border-green-300';
    }
};

const CveDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { cve, isLoading, isError } = useCveDetail(id);

    if (isLoading) {
        return (
            <div className="py-20 text-center text-gray-600">
                Загрузка CVE…
            </div>
        );
    }

    if (isError || !cve) {
        return (
            <div className="py-20 text-center text-red-600">
                CVE не найдено или временно недоступно
            </div>
        );
    }

    const cvssV30 = cve.metrics?.cvssMetricV30?.[0]?.cvssData;
    const cvssV2 = cve.metrics?.cvssMetricV2?.[0]?.cvssData;

    const score = cvssV30?.baseScore ?? cvssV2?.baseScore;
    const severity = getSeverity(score);

    return (
        <>
            <Header />
            <section className="relative min-h-screen bg-gray-50 py-20 md:pt-30 md:pb-30 px-4 md:px-10">
                <img
                    src="/src/assets/bg.jpg"
                    alt="фон"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                />

                <div className="relative z-10 md:max-w-7xl mx-auto md:px-6 md:pt-12">
                    <div className="flex items-center gap-4 mb-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="md:p-3 p-2 rounded-full shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] hover:bg-white transition"
                        >
                            <ArrowLeftIcon className="md:w-6 md:h-6 w-5 h-5 text-gray-700" />
                        </button>
                        <h1 className="md:text-4xl text-xl font-bold break-all">
                            {cve.id}
                        </h1>
                    </div>

                    <div className="shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] backdrop-blur rounded-2xl p-8">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            {/* <div>
                                <p className="text-sm text-gray-500">Статус</p>
                                <p className="font-semibold">{cve.vulnStatus}</p>
                            </div> */}
                            <div>
                                <p className="text-sm text-gray-500">Опубликовано</p>
                                <p className="font-semibold">
                                    {format(new Date(cve.published), 'dd.MM.yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Обновлено</p>
                                <p className="font-semibold">
                                    {format(new Date(cve.lastModified), 'dd.MM.yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Критичность</p>
                                <span
                                    className={`inline-block px-4 py-2 rounded-full border font-bold ${getSeverityColor(
                                        severity
                                    )}`}
                                >
                                    {severity} {score && `(${score.toFixed(1)})`}
                                </span>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="md:text-2xl text-lg font-bold mb-4">Описание</h2>
                            {cve.descriptions.map((d, i) => (
                                <p key={i} className="mb-4 text-gray-800">
                                    <strong>{d.lang.toUpperCase()}:</strong> {d.value}
                                </p>
                            ))}
                        </div>

                        {(cvssV30 || cvssV2) && (
                            <div className="mb-10">
                                <h2 className="md:text-2xl text-lg font-bold mb-4">CVSS</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {cvssV30 && (
                                        <div className="p-6 border rounded-xl bg-gray-50">
                                            <h3 className="font-semibold mb-2">CVSS v3.0</h3>
                                            <p>Score: {cvssV30.baseScore}</p>
                                            <p>Vector: {cvssV30.vectorString}</p>
                                        </div>
                                    )}
                                    {cvssV2 && (
                                        <div className="p-6 border rounded-xl bg-gray-50">
                                            <h3 className="font-semibold mb-2">CVSS v2.0</h3>
                                            <p>Score: {cvssV2.baseScore}</p>
                                            <p>Vector: {cvssV2.vectorString}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {Array.isArray(cve.weaknesses) && cve.weaknesses.length > 0 && (
                            <div className="mt-10">
                                <h2 className="md:text-2xl text-lg font-bold mb-4">Слабые места (CWE)</h2>
                                <ul className="list-disc pl-6 space-y-2">
                                    {cve.weaknesses.map((w, i) => (
                                        <li key={i}>
                                            {Array.isArray(w.description)
                                                ? w.description.map(d => d.value).join(', ')
                                                : 'Нет данных'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {Array.isArray(cve.configurations?.nodes) &&
                            cve.configurations.nodes.length > 0 && (
                                <div className="mt-10">
                                    <h2 className="md:text-2xl text-lg font-bold mb-4">Затронутые продукты</h2>

                                    <div className="space-y-4">
                                        {cve.configurations.nodes.map((node, i) => (
                                            <div key={i} className="p-4 border rounded-xl bg-gray-50">
                                                <p className="font-semibold mb-2">
                                                    Operator: {node.operator}
                                                    {node.negate && ' (NOT)'}
                                                </p>

                                                {Array.isArray(node.cpeMatch) &&
                                                    node.cpeMatch.map((cpe, j) => (
                                                        <p key={j} className="text-sm text-gray-700">
                                                            {cpe.criteria}{' '}
                                                            {cpe.vulnerable && (
                                                                <span className="text-red-600 font-medium">
                                                                    (vulnerable)
                                                                </span>
                                                            )}
                                                        </p>
                                                    ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {Array.isArray(cve.references) && cve.references.length > 0 && (
                            <div className="mt-10">
                                <h2 className="md:text-2xl text-lg font-bold mb-4">Ссылки</h2>
                                <ul className="space-y-3">
                                    {cve.references.map((ref, index) => (
                                        <li key={index} className="text-sm">
                                            <a
                                                href={ref.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline break-all"
                                            >
                                                {ref.url}
                                            </a>

                                            {Array.isArray(ref.tags) && ref.tags.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {ref.tags.join(', ')}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </section>
            <Footer />
            <SEO
                title={`Уязвимость ${id}`}
                description={`Подробная информация об уязвимости ${id}, уровень риска, описание.`}
                url={`https://localhost:5173/cve/${id}`}
            />
        </>
    );
};

export default CveDetail;
