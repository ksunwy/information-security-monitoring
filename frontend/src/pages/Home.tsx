import Footer from "../components/Footer"
import Header from "../components/Header"
import { NavLink } from "react-router-dom"
import SEO from "../components/SEO"

const Home = () => {
    return (
        <>
            <Header />
            <section className="relative flex flex-col gap-10 md:gap-60.25 md:justify-center md:overflow-hidden md:min-h-dvh px-4 md:px-10">
                <img src="/src/assets/bg.jpg" alt="фон" className="absolute top-0 left-0 w-dvw h-dvh object-cover z-1 opacity-40" />
                <div className="relative flex flex-col gap-4 md:gap-23 w-full max-w-440 mx-auto z-10">
                    <h1 className="druk text-2xl md:text-[72px] md:pt-0 pt-20">Мониторинг уязвимостей</h1>
                    <div className="flex md:flex-row flex-col md:items-center md:gap-0 gap-2 md:justify-between">
                        <p className="md:text-2xl text-lg max-w-170">Сканирование, приоритезация и отчётность уязвимостей в вашей инфраструктуре — автоматизировано и прозрачно</p>
                        <NavLink to={"/login"} className="druk w-fit text-lg md:text-2xl py-3.5 md:py-5 px-10 bg-[#E3F0F8]/70 hover:bg-blue-100 shadow-[0px_26.2552px_46.7671px_rgba(9,14,34,0.25),inset_-13.1276px_1.64095px_21.3324px_#9BB0BC] rounded-xl md:rounded-[22px]">войти</NavLink>
                    </div>
                </div>
                <div className="flex md:flex-row flex-col md:gap-0 gap-3 md:items-center md:justify-between w-full max-w-440 mx-auto z-10">
                    <div className="relative h-15 md:h-25 flex items-center justify-center px-26.25 bg-[#E3F0F8] rounded-lg md:rounded-3xl overflow-hidden shadow-[0px_26.2552px_46.7671px_rgba(9,14,34,0.25),inset_-13.1276px_1.64095px_21.3324px_#9BB0BC]">
                        <svg className="absolute right-0 top-0 md:flex hidden" width="397" height="101" viewBox="0 0 397 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_f_158_455)">
                                <path d="M402.854 -54.1163L58.2538 -59.1383C58.2538 -59.1383 128.194 -44.7061 171.206 -30.6805C205.702 -19.4316 225.598 -13.6986 258.45 0.756424C278.962 9.78165 290.136 14.9101 306.037 22.9093C328.19 34.0532 330.012 36.2175 339.677 45.8826C350.343 56.5488 355.838 65.8906 361.83 81.1631C366.018 91.8376 361.83 102.697 361.83 113.982V153.365C361.83 163.758 379.88 190.286 379.88 190.286H402.854V-54.1163Z" fill="#9BB0BC" />
                            </g>
                            <defs>
                                <filter id="filter0_f_158_455" x="3.8147e-06" y="-117.392" width="461.107" height="365.932" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feGaussianBlur stdDeviation="29.1269" result="effect1_foregroundBlur_158_455" />
                                </filter>
                            </defs>
                        </svg>

                        <span className="font-bold text-sm md:text-lg text-nowrap">Автосканирование</span>
                    </div>
                    <div className="relative h-15 md:h-25 flex items-center justify-center px-26.25 bg-[#E3F0F8] rounded-lg md:rounded-3xl overflow-hidden shadow-[0px_26.2552px_46.7671px_rgba(9,14,34,0.25),inset_-13.1276px_1.64095px_21.3324px_#9BB0BC]">
                        <svg className="absolute right-0 top-0 md:flex hidden" width="397" height="101" viewBox="0 0 397 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_f_158_455)">
                                <path d="M402.854 -54.1163L58.2538 -59.1383C58.2538 -59.1383 128.194 -44.7061 171.206 -30.6805C205.702 -19.4316 225.598 -13.6986 258.45 0.756424C278.962 9.78165 290.136 14.9101 306.037 22.9093C328.19 34.0532 330.012 36.2175 339.677 45.8826C350.343 56.5488 355.838 65.8906 361.83 81.1631C366.018 91.8376 361.83 102.697 361.83 113.982V153.365C361.83 163.758 379.88 190.286 379.88 190.286H402.854V-54.1163Z" fill="#9BB0BC" />
                            </g>
                            <defs>
                                <filter id="filter0_f_158_455" x="3.8147e-06" y="-117.392" width="461.107" height="365.932" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feGaussianBlur stdDeviation="29.1269" result="effect1_foregroundBlur_158_455" />
                                </filter>
                            </defs>
                        </svg>

                        <span className="font-bold text-sm md:text-lg text-nowrap">Оценка риска</span>
                    </div>
                    <div className="relative h-15 md:h-25 flex items-center justify-center px-26.25 bg-[#E3F0F8] rounded-lg md:rounded-3xl overflow-hidden shadow-[0px_26.2552px_46.7671px_rgba(9,14,34,0.25),inset_-13.1276px_1.64095px_21.3324px_#9BB0BC]">
                        <svg className="absolute right-0 top-0 md:flex hidden" width="397" height="101" viewBox="0 0 397 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_f_158_455)">
                                <path d="M402.854 -54.1163L58.2538 -59.1383C58.2538 -59.1383 128.194 -44.7061 171.206 -30.6805C205.702 -19.4316 225.598 -13.6986 258.45 0.756424C278.962 9.78165 290.136 14.9101 306.037 22.9093C328.19 34.0532 330.012 36.2175 339.677 45.8826C350.343 56.5488 355.838 65.8906 361.83 81.1631C366.018 91.8376 361.83 102.697 361.83 113.982V153.365C361.83 163.758 379.88 190.286 379.88 190.286H402.854V-54.1163Z" fill="#9BB0BC" />
                            </g>
                            <defs>
                                <filter id="filter0_f_158_455" x="3.8147e-06" y="-117.392" width="461.107" height="365.932" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                    <feGaussianBlur stdDeviation="29.1269" result="effect1_foregroundBlur_158_455" />
                                </filter>
                            </defs>
                        </svg>

                        <span className="font-bold text-sm md:text-lg text-nowrap">Дашборды и отчёты</span>
                    </div>
                </div>
            </section>
            <Footer />
            <SEO
                title="Платформа управления уязвимостями"
                description="Современная система управления активами и уязвимостями. Анализ CVE, мониторинг рисков и безопасность инфраструктуры."
                url="http://localhost:5173/"
            />
        </>
    )
}

export default Home
