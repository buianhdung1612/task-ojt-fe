import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Cookies from "js-cookie";

const Dashboard = () => {
  const token = Cookies.get("token");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({
    total_users: 0,
    total_tasks: 0,
    completed_tasks: 0,
    completion_rate: 0,
    active_tasks: 0,
    new_users_today: 0
  });
  const [taskDistributionData, setTaskDistributionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Hàm tạo dữ liệu biểu đồ hoạt động dựa trên createdAt
  const generateActivityData = (tasks, users) => {
    // Tạo map để theo dõi hoạt động theo ngày
    const activityMap = new Map();
    
    // Xử lý dữ liệu tasks
    tasks.forEach(task => {
      if (task.timeStart || task.createdAt) {
        // Lấy ngày từ timeStart hoặc createdAt
        const date = new Date(task.timeStart || task.createdAt);
        const dateStr = date.toLocaleDateString();
        
        // Thêm vào map hoặc cập nhật nếu đã tồn tại
        if (activityMap.has(dateStr)) {
          const data = activityMap.get(dateStr);
          activityMap.set(dateStr, {
            ...data, 
            tasks: data.tasks + 1,
            date: date // lưu để sắp xếp sau
          });
        } else {
          activityMap.set(dateStr, { 
            name: dateStr, 
            tasks: 1, 
            users: 0,
            date: date
          });
        }
      }
    });
    
    // Xử lý dữ liệu users
    users.forEach(user => {
      if (user.createdAt || user.updatedAt || user.registrationDate) {
        // Lấy ngày từ createdAt, updatedAt hoặc registrationDate
        const date = new Date(user.createdAt || user.updatedAt || user.registrationDate);
        const dateStr = date.toLocaleDateString();
        
        // Thêm vào map hoặc cập nhật nếu đã tồn tại
        if (activityMap.has(dateStr)) {
          const data = activityMap.get(dateStr);
          activityMap.set(dateStr, {
            ...data, 
            users: data.users + 1
          });
        } else {
          activityMap.set(dateStr, { 
            name: dateStr, 
            tasks: 0, 
            users: 1,
            date: date
          });
        }
      }
    });
    
    // Chuyển đổi map thành mảng và sắp xếp theo thứ tự thời gian
    let activityData = Array.from(activityMap.values());
    
    // Sắp xếp theo ngày
    activityData.sort((a, b) => a.date - b.date);
    
    // Giới hạn số điểm dữ liệu thành 7 ngày gần nhất
    if (activityData.length > 7) {
      activityData = activityData.slice(activityData.length - 7);
    }
    
    // Loại bỏ trường date vì không cần cho biểu đồ
    return activityData.map(({ name, tasks, users }) => ({ name, tasks, users }));
  };

  useEffect(() => {
    // Lấy danh sách người dùng
    fetch('https://task-ojt.onrender.com/users/allUsers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code === 'success' && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      })
      .catch(err => console.error('Lỗi khi lấy danh sách người dùng:', err));

    // Lấy danh sách task
    fetch('https://task-ojt.onrender.com/tasks/allTasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code === 'success' && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        }
      })
      .catch(err => console.error('Lỗi khi lấy danh sách task:', err));
  }, []);

  // Cập nhật số liệu thống kê khi dữ liệu thay đổi
  useEffect(() => {
    if (users.length > 0 && tasks.length > 0) {
      // Đếm số task theo trạng thái
      const completedTasks = tasks.filter(task => task.status === 'finish').length;
      const initialTasks = tasks.filter(task => task.status === 'initial').length;
      const doingTasks = tasks.filter(task => task.status === 'doing').length;
      
      // Tính tỷ lệ hoàn thành
      const completionRate = Math.round((completedTasks / tasks.length) * 100);
      
      // Cập nhật thống kê
      setStatistics({
        total_users: users.length,
        total_tasks: tasks.length,
        completed_tasks: completedTasks,
        completion_rate: completionRate,
        active_tasks: tasks.length - completedTasks,
        new_users_today: Math.min(2, users.length) // Giả lập số người dùng mới (2 hoặc ít hơn)
      });
      
      // Cập nhật dữ liệu phân bố task
      setTaskDistributionData([
        { name: 'Initial', value: initialTasks, color: '#F59E0B' },
        { name: 'Working', value: doingTasks, color: '#3B82F6' },
        { name: 'Finish', value: completedTasks, color: '#10B981' },
      ]);
    }
  }, [users, tasks]);

  // Tạo dữ liệu biểu đồ hoạt động
  const activityData = generateActivityData(tasks, users);

  // Sắp xếp người dùng theo thời gian đăng ký (mới nhất trước)
  const sortedUsers = [...users].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.updatedAt || 0);
    const dateB = new Date(b.createdAt || b.updatedAt || 0);
    return dateB - dateA; // Sắp xếp giảm dần (mới nhất lên đầu)
  });

  // Tính toán users hiển thị trên trang hiện tại
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stats cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{statistics.total_users.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-xs font-medium">+{statistics.new_users_today} today</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{statistics.total_tasks.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className="text-gray-500 text-xs">{statistics.active_tasks.toLocaleString()} active</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Completion Rate</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{statistics.completion_rate}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${statistics.completion_rate}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line chart for user activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">User Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" name="Users" stroke="#FF6B3D" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="tasks" name="Tasks" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie chart for task distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Task Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">Newly Registered Users</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src="/Images/avatar.jpg" 
                          alt="User Avatar" 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
