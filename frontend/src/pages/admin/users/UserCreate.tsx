import Header from '../../../components/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useUserCreate } from '../../../hooks/useUserCreate';
import Footer from '../../../components/Footer';
import SEO from '../../../components/SEO';

const UserCreate = () => {
  const {
    form,
    errors,
    isPending,
    handleSubmit,
    handleChange,
    navigateBack,
  } = useUserCreate();

  return (
    <>
      <Header />
      <section className="relative min-h-screen bg-gray-50 py-20 md:pb-30 md:pt-40 px-4 md:px-10">
        <img
          src="/src/assets/bg.jpg"
          alt="фон"
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
        />

        <div className="relative z-10 md:max-w-3xl mx-auto md:px-6 md:pt-12">
          <div className="flex items-center gap-4 mb-4 md:mb-10">
            <button
              onClick={navigateBack}
              className="p-3 rounded-full bg-white/80 hover:bg-white transition"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="md:text-4xl text-xl font-bold druk text-gray-900">Добавить пользователя</h1>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-100/90 text-red-800 p-4 rounded-xl mb-8 border border-red-300">
              <ul className=" pl-5 space-y-1 list-none">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] backdrop-blur-lg p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="user@example.com"
                    className="w-full px-5 py-3 border border-gray-300 md:text-base text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Логин <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.login}
                    onChange={handleChange('login')}
                    placeholder="ivanov123"
                    className="w-full px-5 py-3 border border-gray-300 md:text-base text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Иван Иванов"
                    className="w-full px-5 py-3 border border-gray-300 md:text-base text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    placeholder="Минимум 6 символов"
                    className="w-full px-5 py-3 border border-gray-300 md:text-base text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Роль</label>
                <select
                  value={form.role}
                  onChange={handleChange('role')}
                  className="w-full px-5 py-3 border border-gray-300 md:text-base text-sm  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
                >
                  <option value="observer">Observer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={navigateBack}
                className="md:px-6 px-4 md:py-3 py-2.5 border md:text-base text-sm border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="md:px-8 px-4 md:py-3 py-2.5 bg-[#334E6C] md:text-base text-sm text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-lg"
              >
                {isPending ? 'Создаётся...' : 'Добавить пользователя'}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
      <SEO url='http://localhost:5173/admin/users/new' noindex title="Создание пользователя" description="Создание пользователя системы" />
    </>
  );
};

export default UserCreate