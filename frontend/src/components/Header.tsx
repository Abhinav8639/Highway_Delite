import { MapPin } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <MapPin className="w-6 h-6" />
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-base">highway</span>
              <span className="text-sm">delite</span>
            </div>
          </a>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search experiences"
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full px-4 py-2 pr-24 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
              />
              <button className="absolute right-1 top-1 bottom-1 px-6 bg-yellow-400 hover:bg-yellow-500 rounded font-medium text-sm transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
