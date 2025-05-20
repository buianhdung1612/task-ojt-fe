import React, { useState } from 'react';

// Sample data
const initialTasks = [
  { id: 1, title: "Complete quarterly report", project: "Work", assignee: "Nguyen Van A", priority: "high", due_date: "15/06/2025", status: "Working" },
  { id: 2, title: "Buy milk and bread", project: "Personal", assignee: "Nguyen Van A", priority: "low", due_date: "10/06/2025", status: "Finish" },
  { id: 3, title: "Call customers", project: "Work", assignee: "Tran Thi B", priority: "medium", due_date: "12/06/2025", status: "Working" },
  { id: 4, title: "Book flight to Da Nang", project: "Travel", assignee: "Le Van C", priority: "high", due_date: "20/06/2025", status: "Initial" },
  { id: 5, title: "Exercise for 30 minutes", project: "Health", assignee: "Pham Thi D", priority: "medium", due_date: "daily", status: "Initial" },
];

// Project list for dropdown
const projectOptions = ["All Projects", "Work", "Personal", "Travel", "Health", "Shopping"];

const ContentManagement = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'All Projects' || task.project === selectedProject;
    const matchesStatus = selectedStatus === 'All Statuses' || task.status === selectedStatus;
    return matchesSearch && matchesProject && matchesStatus;
  });
  
  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Initial': return 'bg-yellow-100 text-yellow-800';
      case 'Working': return 'bg-blue-100 text-blue-800';
      case 'Finish': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority color for row highlight
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return '';
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks Management</h1>
        <button className="bg-primary text-black px-4 py-2 rounded-md hover:bg-primary-dark">
          Add Task
        </button>
      </div>
      
      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projectOptions.map((project, index) => (
            <option key={index} value={project}>{project}</option>
          ))}
        </select>
        
        <select 
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Initial">Initial</option>
          <option value="Working">Working</option>
          <option value="Finish">Finish</option>
        </select>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
              {filteredTasks.map((task) => (
                <tr key={task.id} className={`hover:bg-gray-50 ${getPriorityClass(task.priority)}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" 
                        checked={task.status === 'Finish'}
                        readOnly
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
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
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-primary hover:text-primary-dark">
                        View
                      </button>
                      <button className="text-primary hover:text-primary-dark">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;
