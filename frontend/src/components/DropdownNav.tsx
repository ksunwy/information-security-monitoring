import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const DropdownNav = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 bg-(--white) text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-[0px_16.2552px_26.7671px_rgba(9,14,34,0.25),inset_-13.1276px_1.64095px_21.3324px_#9BB0BC]"
      >
        <div className="flex items-center gap-3">
          <span>Аналитика</span>
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-[#fff] ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1 flex flex-col" role="none">
          <Link
            to="/analytics/vulnerabilities"
            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Уязвимости
          </Link>
          <Link
            to="/analytics/assets"
            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Активы
          </Link>
          <Link
            to="/analytics/trends"
            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Тренды
          </Link>
          <Link
            to="/analytics/reports"
            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Отчёты
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DropdownNav;