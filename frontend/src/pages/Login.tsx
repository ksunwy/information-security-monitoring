import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function Login() {
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ login: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(form);
            navigate('/dashboard');
        } catch (err) {
            // console.error(err);
        }
    };

    return (
        <>
            <Header />
            <section className="min-h-screen flex items-center justify-center relative">
                <svg className='absolute top-1/2 left-1/2 -translate-1/2' width="1198" height="1037" viewBox="0 0 1198 1037" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_f_158_582)">
                        <ellipse cx="599" cy="607.5" rx="199" ry="207.5" fill="#9BB0BC" />
                        <path d="M599 400.5C708.609 400.5 797.5 493.157 797.5 607.5C797.5 721.843 708.609 814.5 599 814.5C489.391 814.5 400.5 721.843 400.5 607.5C400.5 493.157 489.391 400.5 599 400.5Z" stroke="#040616" />
                    </g>
                    <defs>
                        <filter id="filter0_f_158_582" x="0" y="0" width="1198" height="1215" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_158_582" />
                        </filter>
                    </defs>
                </svg>

                <div className="flex flex-col items-center w-full max-w-168.25 gap-12.5 relative">
                    <svg width="52" height="50" viewBox="0 0 52 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M38.5925 0H51.0205C51.0205 0 47.2267 7.65171 46.1801 9.63061C45.5065 10.9043 44.8148 12.0053 44.087 12.6649C43.2007 13.4681 42.5873 13.8289 41.4705 14.248C40.3999 14.6499 39.7264 14.6356 38.5925 14.7757C37.2842 14.9374 33.6212 14.7757 32.4438 14.7757C31.2665 14.7757 30.5244 15.1332 29.6966 15.9631C28.9348 16.7267 28.67 17.3972 28.5192 18.4697C28.3742 19.5013 28.5047 20.1505 28.9117 21.1082C29.3041 22.0317 31.1356 25.066 31.9206 26.3852C33.0842 28.3411 33.7592 29.6452 33.7521 31.9261C33.7475 33.4014 32.9671 35.6201 32.9671 35.6201L25.5103 50L9.91821e-05 0H17.661C17.661 0 18.2163 1.04682 18.5768 1.71504C19.3308 3.11291 19.7492 3.89945 20.5391 5.27705C21.2847 6.57739 21.8473 7.78364 22.5014 8.5752C23.4678 9.74463 24.529 10.2817 26.0336 10.1583C27.3097 10.0537 27.97 9.44989 28.9117 8.5752C29.4798 8.04749 30.5251 5.93667 30.7432 5.27705C31.0048 4.48549 32.1022 2.77207 33.6212 1.71504C35.1912 0.622555 36.685 -7.6227e-06 38.5925 0Z" fill="#040616" />
                    </svg>
                    <div className="p-8 rounded-3xl border border-(--dark) backdrop-blur-xs bg-white/10 w-full">
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {error instanceof Error ? error.message : 'Ошибка авторизации'}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-8.75">
                                <label className="block text-sm mb-1.5">Логин</label>
                                <input
                                    type="text"
                                    value={form.login}
                                    onChange={(e) => setForm({ ...form, login: e.target.value })}
                                    className="w-full bg-none px-4.5 py-3 border border-(--dark) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-8.75">
                                <label className="block text-sm mb-1.5">Пароль</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-none px-4.5 py-3 border border-(--dark) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <svg className='absolute right-0 top-0' width="409" height="55" viewBox="0 0 409 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_f_158_586)">
                                        <path d="M402.854 -77.1163L58.2539 -82.1383C58.2539 -82.1383 128.195 -67.7061 171.206 -53.6805C205.702 -42.4316 225.598 -36.6986 258.45 -22.2436C278.962 -13.2183 290.136 -8.0899 306.038 -0.0907288C328.19 11.0532 330.012 13.2175 339.677 22.8826C350.343 33.5488 355.838 42.8906 361.83 58.1631C366.018 68.8376 361.83 79.6969 361.83 90.9821V130.365C361.83 140.758 379.88 167.286 379.88 167.286H402.854V-77.1163Z" fill="#9BB0BC" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_f_158_586" x="0.000125885" y="-140.392" width="461.107" height="365.932" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                            <feGaussianBlur stdDeviation="29.1269" result="effect1_foregroundBlur_158_586" />
                                        </filter>
                                    </defs>
                                </svg>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-(--white) druk text-(--dark) py-2 text-xl h-12.75 hover:bg-blue-100 disabled:opacity-50 rounded-[10px] [box-shadow:0px_26.2552px_46.7671px_rgba(9,14,34,0.25),inset_-13.1276px_1.64095px_21.3324px_#334E6C]"
                                >
                                    {isLoading ? 'Вход...' : 'Войти'}
                                </button>
                            </div>
                            <span className='text-sm mt-4 flex w-full items-center justify-center'>Еще нет аккаунта?&nbsp;<NavLink to="/register"><u>Зарегистрироваться</u></NavLink></span>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
            <SEO
                title="Вход"
                description="Авторизация в системе управления уязвимостями"
                url="http://localhost:5173/login"
                noindex
            />
        </>
    );
}