import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAssetNew } from '../../hooks/useAssetNew';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const AssetNew = () => {
  const {
    form,
    errors,
    isPending,
    handleSubmit,
    handleChange,
    navigateBack,
  } = useAssetNew();

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 pt-30 pb-30">
        <img
          src="/src/assets/bg.jpg"
          alt="фон"
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12">
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={navigateBack}
              className="p-3 rounded-full bg-white/80 hover:bg-white transition"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-4xl font-bold druk text-gray-900">Добавить актив</h1>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-100/90 text-red-800 p-4 rounded-xl mb-8 border border-red-300">
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-(--white) text-(--dark) disabled:opacity-50 rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] backdrop-blur-lg p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP / Домен <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.ip}
                    onChange={handleChange('ip')}
                    placeholder="192.168.1.1 или example.com"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя актива <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Web Server 1"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                <textarea
                  value={form.description}
                  onChange={handleChange('description')}
                  rows={4}
                  placeholder="Краткое описание актива..."
                  className="w-full px-5 py-3 border resize-none border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={navigateBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3 bg-[#334E6C] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-lg"
              >
                {isPending ? 'Создаётся...' : 'Добавить актив'}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
      <SEO
        title="Создание актива"
        description="Добавление нового актива"
        url="http://localhost:5173/assets/new"
        noindex
      />
    </>
  );
};

export default AssetNew;