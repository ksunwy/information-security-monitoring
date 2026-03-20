import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { useUsersAdmin } from '../../../hooks/useUsersAdmin';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SEO from '../../../components/SEO';

const AdminUsers = () => {
  const {
    users,
    isLoading,
    error,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    editingId,
    editForm,
    sortBy,
    sortOrder,
    handleSort,
    setEditForm,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteUser,
    isUpdating,
    isDeleting,
  } = useUsersAdmin();

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'ASC' ?
      <ArrowUpIcon className="w-4 h-4 inline ml-1" /> :
      <ArrowDownIcon className="w-4 h-4 inline ml-1" />;
  };

  const getSortableHeaderClass = (column: string) => {
    return `px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700 transition-colors ${sortBy === column ? 'text-blue-600' : ''
      }`;
  };


  if (isLoading) return <div className="text-center py-10">Загрузка пользователей...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Ошибка загрузки</div>;

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
            <h1 className="text-4xl font-bold druk text-gray-900">Пользователи</h1>
            <NavLink
              to="/admin/users/new"
              className="px-6 py-3 bg-[#334E6C] text-white rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              <span className="flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Добавить пользователя
              </span>
            </NavLink>
          </div>

          <div className="flex flex-wrap gap-6 items-center mb-10">
            <div className="flex-1 min-w-75 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени, email, логину..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-400 rounded-lg h-12.5 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-45"
            >
              <option value="">Все роли</option>
              <option value="admin">Администратор</option>
              <option value="observer">Пользователь</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] backdrop-blur-lg p-6 border border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Всего пользователей</h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">{users.length}</p>
            </div>
            <div className="bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-6 border border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Администраторы</h3>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="bg-(--white) text-(--dark) rounded-[10px] shadow-[0px_21.7886px_38.8109px_rgba(9,14,34,0.1),inset_-10.8943px_1.36179px_17.7032px_#9BB0BC] p-6 border border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Пользователи</h3>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {users.filter(u => u.role === 'observer').length}
              </p>
            </div>
          </div>

          <div className="bg-blue-300/10 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th onClick={() => handleSort('id')}
                      className={getSortableHeaderClass('id')}>
                      <span className="flex items-center">
                        ID {getSortIcon('id')}
                      </span>
                    </th>
                    <th onClick={() => handleSort('name')}
                      className={getSortableHeaderClass('name')}>
                      <span className="flex items-center">
                        Имя {getSortIcon('name')}
                      </span>
                    </th>
                    <th onClick={() => handleSort('email')}
                      className={getSortableHeaderClass('email')}>
                      <span className="flex items-center">
                        Email {getSortIcon('email')}
                      </span>
                    </th>
                    <th onClick={() => handleSort('login')}
                      className={getSortableHeaderClass('login')}>
                      <span className="flex items-center">
                        Логин {getSortIcon('login')}
                      </span>
                    </th>
                    <th onClick={() => handleSort('role')}
                      className={getSortableHeaderClass('role')}>
                      <span className="flex items-center">
                        Роль {getSortIcon('role')}
                      </span>
                    </th>
                    <th onClick={() => handleSort('createdAt')}
                      className={getSortableHeaderClass('createdAt')}>
                      <span className="flex items-center">
                        Создан {getSortIcon('createdAt')}
                      </span></th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                        Пользователей пока нет
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {editingId === user.id ? (
                            <input
                              type="text"
                              value={editForm.name || user.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-2 py-1 border rounded-lg"
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {editingId === user.id ? (
                            <input
                              type="email"
                              value={editForm.email || user.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-2 py-1 border rounded-lg"
                            />
                          ) : (
                            user.email
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.login}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === user.id ? (
                            <select
                              value={editForm.role || user.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'admin' | 'observer' | 'manager' })}
                              className="w-full px-2 py-1 border rounded-lg text-sm"
                            >
                              <option value="admin">Администратор</option>
                              <option value="observer">Пользователь</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' :
                              user.role === 'observer' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {user.role === 'observer' ? "Пользователь" : "Администратор"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {format(new Date(user.createdAt), 'dd.MM.yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingId === user.id ? (
                            <>
                              <button
                                onClick={() => saveEdit()}
                                disabled={isUpdating}
                                className="text-green-600 hover:text-green-800 mr-3"
                              >
                                Сохранить
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Отмена
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(user)}
                                className="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                <PencilIcon className="w-5 h-5 inline" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Удалить пользователя?')) {
                                    deleteUser(user.id);
                                  }
                                }}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                <TrashIcon className="w-5 h-5 inline" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <SEO url='http://localhost:5173/admin/users' noindex title="Управление пользователями" description="Управление пользователями системы" />
    </>
  );
};

export default AdminUsers;