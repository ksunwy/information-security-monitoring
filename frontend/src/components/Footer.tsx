import { NavLink } from 'react-router-dom';
import type { FooterProps } from '../types';

const Footer: React.FC<FooterProps> = ({
    // projectName = 'Система автоматизированного мониторинга информационной безопасности на основе анализа активов и уязвимостей',
    authorName = 'Жукова Ксения',
    year = new Date().getFullYear()
}) => {
    return (
        <>
            <footer className="absolute bottom-0 left-0 w-full">
                <div className="flex items-center justify-between bg-[#0406160a] h-15 md:h-17.5 z-10 py-4.25 px-4 md:px-10">
                    <div className="">
                        <span className="md:text-base text-xs">
                            {/* {projectName} —  */}
                            Дипломный проект&nbsp;
                        </span>
                        <span className="md:text-base text-xs">
                            © {year} {authorName}
                        </span>
                    </div>

                    <NavLink
                        to="/policy"
                        style={{textDecoration: "underline"}}
                    >
                        <span className='md:text-base text-xs'>Соглашение</span>
                    </NavLink>
                </div>
            </footer>
        </>
    );
};

export default Footer;