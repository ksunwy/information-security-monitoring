import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from '../hooks/useAuth';
import { useState } from "react";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsMenuOpen(false);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
        textDecoration: isActive ? "underline" : "none"
    });

    const getMobileLinkStyle = ({ isActive }: { isActive: boolean }) => ({
        textDecoration: isActive ? "underline" : "none",
        display: "block",
        padding: "12px 0",
        fontSize: "18px"
    });

    return (
        <>
            <div className="absolute w-103.5 h-33 -left-31.25 -top-13.75 bg-[#9BB0BC] blur-[125px]" />
            <header className="absolute top-0 left-0 w-full bg-[#0406160a] h-15 md:h-17.5 z-10 py-4.25">
                <div className="w-full max-w-440 mx-auto flex items-center justify-between px-4 md:px-10">
                    <div className="flex items-center gap-2">
                        <button
                            className="flex md:hidden! md:pointer-events-none flex-col justify-center items-center w-8 h-8 z-20"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span className={`flex md:hidden w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <span className={`flex md:hidden w-6 h-0.5 bg-current my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`flex md:hidden w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </button>
                        <NavLink to="/" className="md:w-9 md:h-9 w-5 h-5">
                            <svg className="md:w-9 md:h-9 w-6 h-6" width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M27.7865 0H36.7347C36.7347 0 34.0031 5.50923 33.2496 6.93404C32.7646 7.85108 32.2666 8.6438 31.7425 9.11873C31.1044 9.69705 30.6628 9.95679 29.8587 10.2586C29.0878 10.5479 28.6029 10.5376 27.7865 10.6385C26.8446 10.7549 24.2072 10.6385 23.3595 10.6385C22.5118 10.6385 21.9775 10.8959 21.3815 11.4934C20.833 12.0432 20.6423 12.526 20.5337 13.2982C20.4293 14.0409 20.5233 14.5084 20.8163 15.1979C21.0989 15.8628 22.4176 18.0475 22.9827 18.9974C23.8206 20.4056 24.3065 21.3446 24.3014 22.9868C24.2981 24.049 23.7363 25.6464 23.7363 25.6464L18.3673 36L-1.14441e-05 0H12.7158C12.7158 0 13.1157 0.753708 13.3752 1.23483C13.9181 2.2413 14.2194 2.8076 14.7881 3.79947C15.3249 4.73572 15.73 5.60422 16.2009 6.17414C16.8967 7.01613 17.6608 7.4028 18.7441 7.31398C19.6629 7.23866 20.1383 6.80392 20.8163 6.17414C21.2254 5.79419 21.978 4.27441 22.135 3.79947C22.3234 3.22955 23.1135 1.99589 24.2072 1.23483C25.3376 0.44824 26.4131 -4.71086e-06 27.7865 0Z" fill="#040616" />
                            </svg>
                        </NavLink>
                    </div>
                    {user?.role === "admin"
                        ? <ul className="hidden md:flex items-center gap-10">
                            <li><NavLink style={getLinkStyle} to={'/admin/dashboard'}>Дашборд</NavLink></li>
                            <li><NavLink style={getLinkStyle} to={'/admin/users'}>Пользователи</NavLink></li>
                            <li><NavLink style={getLinkStyle} to={'/admin/logs/scans'}>Сканирования</NavLink></li>
                            <li><NavLink style={getLinkStyle} to={'/admin/logs/system'}>Логи</NavLink></li>
                            <li><NavLink style={getLinkStyle} to={'/cve'}>Список уязвимостей</NavLink></li>
                        </ul>
                        : <ul className="hidden md:flex items-center gap-10">
                            <li><NavLink style={getLinkStyle} to={'/assets'}>Активы</NavLink></li>
                            <li><NavLink style={getLinkStyle} to={'/analytics/vulnerabilities'}>Аналитика</NavLink></li>
                            <li><NavLink style={getLinkStyle} to={'/analytics/trends'}>Тренды</NavLink></li>
                            <li><NavLink style={getLinkStyle} to={'/cve'}>Список уязвимостей</NavLink></li>
                        </ul>
                    }
                    {user ? <button onClick={handleLogout} style={{ textDecoration: "underline" }}><span className="md:text-base text-sm">Выйти</span></button> : <NavLink className="md:text-base text-sm" to={'/login'} style={{ textDecoration: "underline" }}><span className="md:text-base text-sm">Войти</span></NavLink>}
                </div>
            </header>

            <div className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg z-20 transform transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center gap-2 h-15 px-4">
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 z-20"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-current my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </button>
                    <NavLink to="/" className="md:w-9 md:h-9 w-5 h-5">
                        <svg className="md:w-9 md:h-9 w-6 h-6" width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M27.7865 0H36.7347C36.7347 0 34.0031 5.50923 33.2496 6.93404C32.7646 7.85108 32.2666 8.6438 31.7425 9.11873C31.1044 9.69705 30.6628 9.95679 29.8587 10.2586C29.0878 10.5479 28.6029 10.5376 27.7865 10.6385C26.8446 10.7549 24.2072 10.6385 23.3595 10.6385C22.5118 10.6385 21.9775 10.8959 21.3815 11.4934C20.833 12.0432 20.6423 12.526 20.5337 13.2982C20.4293 14.0409 20.5233 14.5084 20.8163 15.1979C21.0989 15.8628 22.4176 18.0475 22.9827 18.9974C23.8206 20.4056 24.3065 21.3446 24.3014 22.9868C24.2981 24.049 23.7363 25.6464 23.7363 25.6464L18.3673 36L-1.14441e-05 0H12.7158C12.7158 0 13.1157 0.753708 13.3752 1.23483C13.9181 2.2413 14.2194 2.8076 14.7881 3.79947C15.3249 4.73572 15.73 5.60422 16.2009 6.17414C16.8967 7.01613 17.6608 7.4028 18.7441 7.31398C19.6629 7.23866 20.1383 6.80392 20.8163 6.17414C21.2254 5.79419 21.978 4.27441 22.135 3.79947C22.3234 3.22955 23.1135 1.99589 24.2072 1.23483C25.3376 0.44824 26.4131 -4.71086e-06 27.7865 0Z" fill="#040616" />
                        </svg>
                    </NavLink>
                </div>
                <div className="flex flex-col p-6 pt-20">
                    {user?.role === "admin" ? (
                        <>
                            <NavLink style={getMobileLinkStyle} to={'/admin/dashboard'} onClick={closeMenu} className="hover:text-gray-600">
                                Дашборд
                            </NavLink>
                            <NavLink style={getMobileLinkStyle} to={'/admin/users'} onClick={closeMenu} className="hover:text-gray-600">
                                Пользователи
                            </NavLink>
                            <NavLink style={getMobileLinkStyle} to={'/admin/logs/scans'} onClick={closeMenu} className="hover:text-gray-600">
                                Сканирования
                            </NavLink>
                            <NavLink style={getMobileLinkStyle} to={'/admin/logs/system'} onClick={closeMenu} className="hover:text-gray-600">
                                Логи
                            </NavLink>
                            <NavLink style={getMobileLinkStyle} to={'/cve'} onClick={closeMenu} className="hover:text-gray-600">
                                Список уязвимостей
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink style={getMobileLinkStyle} to={'/assets'} onClick={closeMenu} className="hover:text-gray-600">
                                Активы
                            </NavLink>
                            <NavLink style={getMobileLinkStyle} to={'/analytics/vulnerabilities'} onClick={closeMenu} className="hover:text-gray-600">
                                Аналитика
                            </NavLink>
                            <NavLink style={getMobileLinkStyle} to={'/analytics/trends'} onClick={closeMenu} className="hover:text-gray-600">
                                Тренды
                            </NavLink>
                            <NavLink style={getMobileLinkStyle} to={'/cve'} onClick={closeMenu} className="hover:text-gray-600">
                                Список уязвимостей
                            </NavLink>
                        </>
                    )}
                </div>
                <div className="mt-6 p-6 border-t border-gray-200">
                    {user ? (
                        <button onClick={handleLogout} className="w-full text-left text-lg hover:text-gray-600" style={{ textDecoration: "underline" }}>
                            Выйти
                        </button>
                    ) : (
                        <NavLink to={'/login'} onClick={closeMenu} className="block text-lg hover:text-gray-600" style={{ textDecoration: "underline" }}>
                            Войти
                        </NavLink>
                    )}
                </div>
            </div>
        </>
    )
}

export default Header
