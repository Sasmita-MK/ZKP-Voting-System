import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Verify Identity', path: '/verify' },
    { name: 'Proposals', path: '/proposals' },
    { name: 'Create Proposal', path: '/create-proposal' },
    { name: 'Results', path: '/results' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-blue-400">ZKP DAO</h1>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block py-3 px-4 rounded-lg transition ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      
      <div className="pt-6 border-t border-slate-700 text-xs text-slate-500 text-center">
        Connected to ZKP Voting System
      </div>
    </div>
  );
};

export default Sidebar;