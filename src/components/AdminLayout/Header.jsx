import { useState } from 'react';

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Todo List</h2>
      
      <div className="flex items-center">
        <div className="relative mx-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </div>
        </div>
        
        <div className="relative mx-2">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src="/Images/avatar.jpg" alt="User Profile" className="w-10 h-10 rounded-full object-cover" />
            <div className="ml-2">
              <p className="font-medium text-gray-800">Admin</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          
          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  // Để trống chức năng đăng xuất
                  alert('Đăng xuất thành công');
                  setShowDropdown(false);
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
