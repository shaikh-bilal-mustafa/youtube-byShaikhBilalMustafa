import { Home, TrendingUp, Library, History, Clock, ThumbsUp, Film, Gamepad2, Trophy, Lightbulb, Shirt, Music, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onItemClick?: () => void;
}

const menuItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: TrendingUp, label: 'Trending' },
  { icon: UserCheck, label: 'Subscriptions' },
  { icon: Library, label: 'Library' },
];

const personalItems = [
  { icon: History, label: 'History' },
  { icon: Clock, label: 'Watch Later' },
  { icon: ThumbsUp, label: 'Liked Videos' },
];

const exploreItems = [
  { icon: Film, label: 'Movies' },
  { icon: Gamepad2, label: 'Gaming' },
  { icon: Trophy, label: 'Sports' },
  { icon: Lightbulb, label: 'Learning' },
  { icon: Shirt, label: 'Fashion' },
  { icon: Music, label: 'Music' },
];

export function Sidebar({ isOpen, onItemClick }: SidebarProps) {
  const navigate = useNavigate();
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onItemClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 bottom-0 w-56 bg-white border-r overflow-y-auto z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="py-2">
          {/* Main menu */}
          <div className="px-3 py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === 'Home') navigate('/');
                  else if (item.label === 'Subscriptions') navigate('/subscriptions');
                  // add others
                  onItemClick?.();
                }}
                className={`w-full flex items-center gap-6 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors ${
                  item.active ? 'bg-gray-100' : ''
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t my-2" />

          {/* Personal section */}
          <div className="px-3 py-2">
            {personalItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-6 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t my-2" />

          {/* Explore section */}
          <div className="px-3 py-2">
            <h3 className="px-3 py-2 text-sm font-semibold text-gray-600">Explore</h3>
            {exploreItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-6 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
