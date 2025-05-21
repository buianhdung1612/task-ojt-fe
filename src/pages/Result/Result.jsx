import { useSearchParams } from "react-router-dom";
import { Title } from "../../components/Title/Title";
import { LiaCircleSolid } from "react-icons/lia";
import { GoPencil } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { UserContext } from "../../components/Route/ProtectedRoute";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { MdOutlineNewLabel } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Trash2, X } from "lucide-react";

export const ResultPage = () => {
  const [tasks, setTasks] = useState([]);
  const user = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', content: '', timeStart: '', timeFinish: '' });
  const keyword = searchParams.get('q');
  const token = Cookies.get("token");
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [listUsersPerTask, setListUsersPerTask] = useState({});

  const fetchListUser = () => {
    fetch(`https://task-ojt.onrender.com/users/list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.data);
      })
  }

  const fetchApi = () => {
    fetch(`https://task-ojt.onrender.com/tasks?keyword=${keyword}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTasks(data);

        const initialListUsersPerTask = {};
        data.forEach(task => {
          if (task.listUser) {
            initialListUsersPerTask[task._id] = task.listUser;
          }
        });
        setListUsersPerTask(initialListUsersPerTask);
      });
  }

  useEffect(() => {
    fetchApi();
    fetchListUser();
  }, [keyword])

  const handleTaskClick = (task) => {
    if (task.timeStart) {
      task.timeStart = task.timeStart.slice(0, 16);
    }
    if (task.timeFinish) {
      task.timeFinish = task.timeFinish.slice(0, 16);
    }
    setSelectedTask(task);
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditTask({
      title: task.title,
      content: task.content,
      timeStart: task.timeStart ? task.timeStart.slice(0, 16) : '',
      timeFinish: task.timeFinish ? task.timeFinish.slice(0, 16) : ''
    });
  };

  const handleEditChange = (field, value) => {
    setEditTask({ ...editTask, [field]: value });
  };

  const handleEditSave = () => {
    const data = {
      title: editTask.title,
      content: editTask.content,
      timeStart: editTask.timeStart,
      timeFinish: editTask.timeFinish,
    }

    fetch(`https://task-ojt.onrender.com/tasks/edit/${editingTaskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "success") {
          fetchApi();
          setEditingTaskId(null);
        }
        else {
          fetchApi();
          setEditingTaskId(null);
        }
      })
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  const handleDelete = (id) => {
    fetch('https://task-ojt.onrender.com/tasks/delete', {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "success") {
          fetchApi();
        }
      })
  }

  const handleClickFinish = (id) => {
    const data = {
      id: id,
      status: "finish"
    };

    fetch('https://task-ojt.onrender.com/tasks/changeStatus', {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "success") {
          fetchApi();
          setSelectedTask(null);
        }
      })
  }

  const handleChangeStatus = (id, event) => {
    const data = {
      id: id,
      status: event.target.value
    };

    fetch('https://task-ojt.onrender.com/tasks/changeStatus', {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "success") {
          fetchApi();
          setSelectedTask(null)
        }
      })
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    const nameParts = name.split(' ');
    let initials = '';

    if (nameParts.length === 1) {
      initials = nameParts[0][0];
    } else {
      initials = nameParts[0][0] + nameParts[1][0];
    }

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: initials.toUpperCase(),
    };
  }

  const handleAddPeopleInTask = (newUser, taskId) => {
    const currentList = listUsersPerTask[taskId] || [];

    if (currentList.find(user => user._id === newUser._id)) return;

    setListUsersPerTask(prev => ({
      ...prev,
      [taskId]: [...currentList, newUser]
    }));
  };

  const handleRemoveUserFromTask = (taskId, userId) => {
    setListUsersPerTask(prev => ({
      ...prev,
      [taskId]: (prev[taskId] || []).filter(user => user._id !== userId)
    }));
  };

  const handleAssign = (taskId, listUser) => {
    fetch(`https://task-ojt.onrender.com/tasks/edit/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        listUser: listUser
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code == "success") {
          fetchApi();
        }
        else {
          fetchApi();
        }
      })
  }

  return (
    <>
      <Title title={`Results for “${keyword}”`} />
      <button className="px-4 py-1 mb-[15px] rounded-full bg-gray-100 text-sm text-black font-medium mt-[10px] hover:bg-gray-200">
        Tasks
      </button>
      <ul>
        {tasks && tasks.map((task, index) => (
          <div key={index}>
            <li
              className={`task-item task-item w-full  cursor-pointer pb-[30px] border-b border-solid border-[#eee] ${editingTaskId === task._id ? 'hidden' : ''}`}
            >
              <div className='w-full flex items-center'>
                <div className='flex items-center flex-1'>
                  <div className='icon-wrapper' onClick={() => handleClickFinish(task._id)}>
                    <LiaCircleSolid className='text-[24px] text-[#999999] icon-finish' />
                    <CiCircleCheck className='text-[22px] text-[#999999] icon-finished' />
                  </div>
                  <div onClick={() => handleTaskClick(task)} className='ml-[8px] flex-1 mt-[12px]'>
                    <div className='text-[14px] text-[#202020]'>
                      <span className="task-item-text" style={{
                        wordBreak: 'break-word'
                      }}>{task.title}</span>
                    </div>
                    {task.content && (
                      <div
                        className="text-[12px] text-[#666666]"
                        style={{
                          whiteSpace: 'pre-line',
                          wordBreak: 'break-word'
                        }}
                      >
                        {task.content}
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex items-center'>
                  <FormControl className='select-status' variant="standard" style={{
                    width: "140px", marginBottom: "10px", marginLeft: "20%", marginRight: "20px"
                  }}>
                    <Select
                      id="demo-simple-select"
                      value={task.status}
                      label="Status"
                      onChange={(event) => handleChangeStatus(task._id, event)}
                    >
                      <MenuItem value="initial">To do</MenuItem>
                      <MenuItem value="doing">Working</MenuItem>
                      <MenuItem value="finish">Completed</MenuItem>
                    </Select>
                  </FormControl>
                  <Tooltip title="Edit task" placement="top">
                    <GoPencil
                      onClick={() => {
                        handleEditClick(task);
                      }}
                      className='icon-edit text-[20px] text-[#999999] mr-[15px] w-7 h-7 p-1 rounded-[5px] hover:bg-[#EEEEEE]'
                    />
                  </Tooltip>
                  {user && task.createdBy == user._id && (
                    <Tooltip title="Delete" placement="top">
                      <RiDeleteBin6Line onClick={() => handleDelete(task._id)} className='icon-delete text-[20px] text-[#999999] w-7 h-7 p-1 rounded-[5px] hover:bg-[#EEEEEE]' />
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className='flex items-start justify-between mt-[10px]'>
                <div className='relative inner-assign'>
                  <div className='ml-[25px] px-[6px] py-[3px] font-[400] hover:bg-[#E9F2FE] hover:border-none justify-center w-[100px] rounded-[5px] text-[13px] text-[#1E7EE2] flex items-center border boder-solid border-[#e6e6e6]'>
                    <MdOutlineNewLabel />
                    <span className='ml-[5px]'>Assignee</span>
                  </div>
                  {users.length > 0 && (
                    <div className='w-[284px] dropdown absolute z-50 bg-[#fff] left-[100%] top-[0%] rounded-[5px] border border-solid border-[#e6e6e6] text-[14px]'>
                      {users.map((user, index) => (
                        <div onClick={() => handleAddPeopleInTask(user, task._id)} key={index} className='flex items-center px-[20px] py-[8px] hover:bg-[#F0F1F2]'><FaRegUserCircle className='mr-[10px] text-[18px]' />
                          {user.fullname}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className='text-right'>
                  <Stack direction="row-reverse" spacing={1}>
                    {(listUsersPerTask[task._id] || []).map((item, index) => (
                      <div key={index} className='relative'>
                        <Avatar
                          style={{ width: "30px", height: "30px" }}
                          {...stringAvatar(item.fullname)}
                        />
                        {user && (item._id !== user._id) && (task.createdBy !== item._id) && (
                          <div onClick={() => handleRemoveUserFromTask(task._id, item._id)} className="absolute -top-3.5 right-0 text-red-500 text-[20px] text-sm cursor-pointer transition-all">x</div>
                        )}
                      </div>
                    ))}
                  </Stack>
                  {(listUsersPerTask[task._id] || []).length > 0 && (
                    <button
                      onClick={() => {
                        handleAssign(task._id, listUsersPerTask[task._id])
                      }}
                      className="cursor-pointer mt-[10px] bg-[#1E7EE2] hover:bg-[#1565C0] text-white px-[10px] py-[6px] text-[13px] rounded-[5px] font-semibold transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            </li>
            {editingTaskId === task._id && (
              <div className="task-form w-full border border-solid border-[#e6e6e6] rounded-[10px] px-[10px] pt-[10px]">
                <input
                  type="text"
                  placeholder="Task name"
                  value={editTask.title}
                  onChange={e => handleEditChange('title', e.target.value)}
                  className='text-[#202020] text-[14px] outline-none bg-none font-[600] w-full'
                />
                <div className="task_editor__editing_area" style={{ width: '100%', marginBottom: 8 }}>
                  <textarea
                    placeholder="Description"
                    rows={2}
                    value={editTask.content}
                    onChange={e => handleEditChange('content', e.target.value)}
                    className='mt-[5px] text-[#202020] text-[13px] outline-none bg-none font-[400] w-full'
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <div className="relative">
                    <label htmlFor="start-time" className="text-[13px] block mb-1">Time Start</label>
                    <input
                      id="start-time"
                      type="datetime-local"
                      value={editTask.timeStart}
                      onChange={e => handleEditChange('timeStart', e.target.value)}
                      className="w-full p-2 rounded border border-[#d1d5db] bg-[#f9fafb] transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="end-time" className="text-[13px] block mb-1">Time Finish</label>
                    <input
                      id="end-time"
                      type="datetime-local"
                      value={editTask.timeFinish}
                      onChange={e => handleEditChange('timeFinish', e.target.value)}
                      className="w-full p-2 rounded border border-[#d1d5db] bg-[#f9fafb] transition-colors"
                    />
                  </div>
                </div>
                <div className="task-form-buttons mt-[8px] p-[8px] pr-[12px] border-t border-solid border-[#e6e6e6]" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleEditCancel}
                    className="task-form-button cancel bg-[#f5f5f5] hover:bg-[#E5E5E5] w-[68px] h-[32px] text-[#444] text-[13px] px-[12px] rounded-[5px] cursor-pointer font-[600]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="ml-[10px] task-form-button add bg-[#dc4c3e] hover:bg-[#B93C2C] text-[#fff] w-[78px] h-[32px] text-[13px] px-[12px] rounded-[5px] cursor-pointer font-[600]"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </ul>
      {/* Popup detail task */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-[50%] max-w-6xl h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Task details
              </h2>
              <div className="flex items-center gap-4">
                <button
                  className="text-red-500 hover:text-red-700 transition cursor-pointer"
                  onClick={() => handleDeleteTask(selectedTask._id)}
                  title="Delete task"
                >
                  <Trash2 size={20} />
                </button>

                <button
                  className="text-gray-600 hover:text-black transition cursor-pointer"
                  onClick={() => setSelectedTask(null)}
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-2/3 px-8 overflow-y-auto">
                <div className='flex items-center flex-1'>
                  <div className='icon-wrapper' onClick={() => handleClickFinish(selectedTask._id)}>
                    <LiaCircleSolid className='text-[24px] text-[#999999] icon-finish cursor-pointer' />
                    <CiCircleCheck className='text-[22px] text-[#999999] icon-finished cursor-pointer' />
                  </div>
                  <div className='ml-[8px] flex-1 mt-[20px]'>
                    <div className='text-[20px] text-[#202020] font-[600]'>
                      <span className="task-item-text" style={{
                        wordBreak: 'break-word'
                      }}>{selectedTask.title}</span>
                    </div>
                    {selectedTask.content && (
                      <div
                        className="text-[14px] text-[#202020]"
                        style={{
                          whiteSpace: 'pre-line',
                          wordBreak: 'break-word'
                        }}
                      >
                        {selectedTask.content}
                      </div>
                    )}
                  </div>
                  <div className='flex items-center'>
                    <FormControl className='select-status' variant="standard" style={{
                      width: "140px", marginLeft: "20%", marginRight: "20px"
                    }}>
                      <Select
                        id="demo-simple-select"
                        value={selectedTask.status}
                        label="Status"
                        onChange={(event) => handleChangeStatus(selectedTask._id, event)}
                      >
                        <MenuItem value="initial">To do</MenuItem>
                        <MenuItem value="doing">Working</MenuItem>
                        <MenuItem value="finish">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className='mt-[30px]'>
                  <div className="relative">
                    <label htmlFor="start-time" className="text-[15px] text-[#202020] block">Time Start</label>
                    <input
                      id="start-time"
                      type="datetime-local"
                      value={selectedTask.timeStart}
                      onChange={e => handleEditChange('timeStart', e.target.value)}
                      className="w-full p-2 rounded border border-[#d1d5db] bg-[#f9fafb] my-[10px] transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="end-time" className="text-[15px] text-[#202020] block mb-1">Time Finish</label>
                    <input
                      id="end-time"
                      type="datetime-local"
                      value={selectedTask.timeFinish}
                      onChange={e => handleEditChange('timeFinish', e.target.value)}
                      className="w-full p-2 rounded border border-[#d1d5db] bg-[#f9fafb] my-[10px] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="w-1/3 bg-[#fcfbf9] p-6 text-sm overflow-y-auto">
                <div className="mb-4">
                  <p className="font-semibold text-gray-700">📁 Assignee</p>
                </div>
                {selectedTask.listUser.length > 0 && (
                  <div className="space-y-3">
                    {selectedTask.listUser.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white p-2 rounded shadow-sm border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-[#e0e0e0] flex items-center justify-center text-xs font-bold text-gray-700 uppercase">
                          {item.fullname
                            .split(' ')
                            .map(word => word[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="text-gray-800">{item.fullname}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};