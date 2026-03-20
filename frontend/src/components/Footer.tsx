import { NavLink } from 'react-router-dom';

interface FooterProps {
    projectName?: string;
    authorName?: string;
    year?: number;
}

const Footer: React.FC<FooterProps> = ({
    // projectName = 'Система автоматизированного мониторинга информационной безопасности на основе анализа активов и уязвимостей',
    authorName = 'Жукова Ксения',
    year = new Date().getFullYear()
}) => {
    return (
        <>
            <footer className="absolute bottom-0 left-0 w-full">
                <div className="flex items-center justify-between bg-[#0406160a] h-17.5 z-10 py-4.25 px-10">
                    <div className="">
                        <span className="">
                            {/* {projectName} —  */}
                            Дипломный проект&nbsp;
                        </span>
                        <span className="">
                            © {year} {authorName}
                        </span>
                    </div>

                    <NavLink
                        to="/policy"
                        style={{textDecoration: "underline"}}
                    >
                        Соглашение
                    </NavLink>
                </div>
            </footer>
        </>
    );
};

export default Footer;