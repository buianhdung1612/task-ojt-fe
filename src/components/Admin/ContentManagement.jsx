import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";

// Project list for dropdown
const projectOptions = ["All Projects", "Work", "Personal", "Travel", "Health", "Shopping"];

const ContentManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  
  const token = Cookies.get("token");

  useEffect(() => {
    setIsLoading(true);
    fetch('https://task-ojt.onrender.com/tasks/allTasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 'success' && Array.isArray(data.tasks)) {
          // Xử lý dữ liệu từ API thành format cần thiết
          const formattedTasks = data.tasks.map(task => {
            const createdBy = task.createdBy || 'Unknown';
            // Nếu task có listUser, lấy tên người đầu tiên, nếu không thì dùng Unknown
            const assigneeName = task.listUser && task.listUser.length > 0 
              ? task.listUser[0].fullname 
              : 'Unassigned';
            
            let project = "Other";
            // Phân loại dự án dựa trên nội dung hoặc tiêu đề task (chỉ là ví dụ)
            if (task.title.toLowerCase().includes('work') || task.content?.toLowerCase().includes('work')) {
              project = "Work";
            } else if (task.title.toLowerCase().includes('study') || task.content?.toLowerCase().includes('study')) {
              project = "Study";
            }
            
            // Xác định mức độ ưu tiên dựa trên thời hạn
            let priority = "medium";
            if (task.timeFinish) {
              const dueDate = new Date(task.timeFinish);
              const today = new Date();
              const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              
              if (diffDays < 0) {
                priority = "high"; // Quá hạn
              } else if (diffDays < 3) {
                priority = "high"; // Sắp đến hạn
              } else if (diffDays < 7) {
                priority = "medium"; // Còn thời gian
              } else {
                priority = "low"; // Còn nhiều thời gian
              }
            }
            
            return {
              id: task._id,
              title: task.title || 'Untitled Task',
              project: project,
              assignee: assigneeName,
              priority: priority,
              due_date: task.timeFinish ? new Date(task.timeFinish).toLocaleDateString() : 'No due date',
              status: task.status === 'finish' ? 'Finish' : (task.status === 'doing' ? 'Working' : 'Initial'),
              content: task.content || '',
              createdAt: task.createdAt || '',
              timeStart: task.timeStart ? new Date(task.timeStart).toLocaleDateString() : ''
            };
          });

          // Sắp xếp tasks từ mới nhất đến cũ nhất dựa trên createdAt hoặc timeStart
          formattedTasks.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.timeStart || 0);
            const dateB = new Date(b.createdAt || b.timeStart || 0);
            return dateB - dateA; // Sắp xếp giảm dần (mới nhất lên đầu)
          });

          setTasks(formattedTasks);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi lấy danh sách công việc:', err);
        setIsLoading(false);
      });
  }, []);

  // Lọc tasks theo các tiêu chí
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'All Projects' || task.project === selectedProject;
    const matchesStatus = selectedStatus === 'All Statuses' || task.status === selectedStatus;
    return matchesSearch && matchesProject && matchesStatus;
  });
  
  // Tính toán phân trang
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Initial': return 'bg-yellow-100 text-yellow-800';
      case 'Working': return 'bg-blue-100 text-blue-800';
      case 'Finish': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color for row highlight
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
          Add Task
        </button>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
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

        <select
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projectOptions.map((project, index) => (
            <option key={index} value={project}>{project}</option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Initial">To Do</option>
          <option value="Working">In Progress</option>
          <option value="Finish">Completed</option>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTasks.length > 0 ? currentTasks.map((task) => (
                  <tr key={task.id} className={`hover:bg-gray-50 ${getPriorityClass(task.priority)}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                          checked={task.status === 'Finish'}
                          readOnly
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          {task.content && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{task.content}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.assignee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.due_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status === 'Initial' ? 'To Do' : (task.status === 'Working' ? 'In Progress' : 'Completed')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-orange-500 hover:text-orange-700">
                          View
                        </button>
                        <button className="text-orange-500 hover:text-orange-700">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                )}
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
                  Showing <span className="font-medium">{indexOfFirstTask + 1}</span> to <span className="font-medium">{Math.min(indexOfLastTask, filteredTasks.length)}</span> of <span className="font-medium">{filteredTasks.length}</span> tasks
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

export default ContentManagement;
