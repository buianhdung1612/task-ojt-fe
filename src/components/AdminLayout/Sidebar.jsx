import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : ''
  }

  return (
    <div className="w-64 bg-orange-300 border-r border-white shrink-0">
      <div className="p-4 flex items-center space-x-2">
        <img 
          src="/Images/todoist-icon-512x512-v3a6dxo9.png" 
          alt="Todoist Logo" 
          className="w-8 h-8 object-contain"
        />
        <Link 
          to="/" 
          className="text-xl font-bold !text-white hover:!text-white tracking-wide hover:opacity-90 transition-opacity"
          style={{ color: 'white' }}
        >
          TodoistAdmin
        </Link>
      </div>

      <div className="p-4 border-b border-white">
        <div className="flex items-center">
          <img src="/Images/avatar.jpg" alt="Admin Avatar" className="w-10 h-10 rounded-full mr-3 object-cover" />
          <div>
            <div className="font-medium">Admin</div>
            <div className="text-sm text-gray-700">Administrator</div>
          </div>
        </div>
      </div>

      <div className="py-2">
        <div className="px-4 py-2 text-xs uppercase text-gray-700 font-semibold">Overview</div>
        <Link to="/admin/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
          <span className="w-5 h-5 mr-3 flex items-center justify-center">📊</span>
          Dashboard
        </Link>
        
        <div className="px-4 py-2 text-xs uppercase text-gray-700 font-semibold">Management</div>
        <Link to="/admin/users" className={`nav-link ${isActive('/users')}`}>
          <span className="w-5 h-5 mr-3 flex items-center justify-center">👥</span>
          User Management
        </Link>
        
        <Link to="/admin/content" className={`nav-link ${isActive('/content')}`}>
          <span className="w-5 h-5 mr-3 flex items-center justify-center">📝</span>
          Tasks Management
        </Link>
      </div>

      <style>{`
        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          position: relative;
          color: #1f2937; /* text-gray-800 */
          overflow: hidden;
          transition: all 0.3s ease;
          z-index: 1;
        }
        
        .nav-link:hover {
          transform: translateX(0.5rem);
          color: #FF6B3D; /* text-primary (orange) on hover */
        }
        
        .nav-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: white;
          transition: all 0.5s ease;
          z-index: -1;
        }
        
        .nav-link:hover::before {
          left: 0;
        }
        
        .active-link {
          font-weight: bold;
          color: #FF6B3D; /* text-primary */
          background-color: white;
        }
        
        .active-link::before {
          left: 0;
        }
      `}</style>
    </div>
  )
}

export default Sidebar
