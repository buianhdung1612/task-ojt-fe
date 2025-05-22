import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  
  const token = Cookies.get("token");

  useEffect(() => {
    setIsLoading(true);
    fetch('https://task-ojt.onrender.com/users/allUsers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 'success' && Array.isArray(data.users)) {
          console.log(data.users);
          // Xử lý dữ liệu từ API thành format cần thiết
          const formattedUsers = data.users.map(user => ({
            id: user._id,
            name: user.fullname || 'N/A',
            email: user.email || 'N/A',
            role: user.isAdmin ? 'admin' : 'user',
            status: user.status || 'active',
            joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            taskLength: user.taskLength || 0,
            phone: user.phone || 'N/A',
            address: user.address || 'N/A'
          }));
          setUsers(formattedUsers);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi lấy danh sách người dùng:', err);
        setIsLoading(false);
      });
  }, []);

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Tính toán phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Hàm xử lý thay đổi trạng thái người dùng
  const handleStatusChange = (userId, newStatus) => {
    // Tạm thời thay đổi state mà không cần gọi API
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
          Add Account
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by email or name..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <select className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src="/Images/avatar.jpg" alt={user.name} className="h-10 w-10 rounded-full object-cover mr-3" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.joined}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.taskLength}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-orange-500 hover:text-orange-700"
                          onClick={() => alert(`Edit user ${user.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'blocked' : 'active')}
                        >
                          {user.status === 'active' ? 'Block' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> users
                </p>
              </div>
              <div>
                <nav className="flex items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l border ${
                      currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 border-t border-b ${
                        currentPage === i + 1
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r border ${
                      currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
