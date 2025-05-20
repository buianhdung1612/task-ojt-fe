import { useContext, useEffect, useState } from 'react';
import { LiaCircleSolid } from "react-icons/lia";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { UserContext } from '../Route/ProtectedRoute';
import Cookies from "js-cookie";

export const TaskList = (props) => {
    const { api } = props;
    const user = useContext(UserContext);
    const token = Cookies.get("token");
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeFinish, setTimeFinish] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTask, setEditTask] = useState({ title: '', content: '', timeStart: '', timeFinish: '' });


    useEffect(() => {
        fetch(api, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTasks(data);
            });
    }, [])

    const addTask = () => {
        const data = {
            title: title,
            status: "initial",
            content: content,
            timeStart: timeStart,
            timeFinish: timeFinish,
            listUser: [
                user._id
            ]
        };

        fetch('https://task-ojt.onrender.com/tasks/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "success") {
                    setTasks([...tasks, data.data]);
                    setTimeStart('');
                    setTimeFinish('');
                    setContent('');
                    setTitle('');
                    setShowForm(false);
                }
            })
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
            listUser: [
                user._id
            ]
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
                    setTasks(data.tasks);
                    setTimeStart('');
                    setTimeFinish('');
                    setContent('');
                    setTitle('');
                    setShowForm(false);
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
                    setTasks(data.tasks);
                }
            })
    }

    return (
        <div className="task-list-container">
            <div className='text-[#666] text-[14px] font-[400] flex items-center mt-[8px] mb-[16px]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" class="siIBvPn"><path fill="currentColor" fill-rule="evenodd" d="M8 14.001a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM5.146 8.147a.5.5 0 0 1 .708 0L7 9.294l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 0-.708Z" clip-rule="evenodd"></path></svg>
                <span className='ml-[5px]'>{tasks.length} tasks</span>
            </div>
            <ul>
                {tasks.map((task, index) => (
                    <div key={index}>
                        <li
                            className={`task-item w-full flex items-center cursor-pointer pb-[30px] border-b border-solid border-[#eee] ${editingTaskId === task._id ? 'hidden' : ''}`}
                        >
                            <div className='flex items-center flex-1'>
                                <LiaCircleSolid className='text-[24px] text-[#999999] icon-finish' />
                                <div className='ml-[8px] flex-1 mt-[12px]'>
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
                                <GoPencil
                                    onClick={() => {
                                        handleEditClick(task);
                                        setShowForm(false);
                                    }}
                                    className='text-[20px] text-[#999999] mr-[15px] w-7 h-7 p-1 rounded-[5px] hover:bg-[#EEEEEE]'
                                />
                                <RiDeleteBin6Line onClick={() => handleDelete(task._id)} className='text-[20px] text-[#999999] w-7 h-7 p-1 rounded-[5px] hover:bg-[#EEEEEE]' />
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

            {/* Add task */}
            {!editingTaskId && (showForm ? (
                <div
                    className="task-form w-full border border-solid border-[#e6e6e6] rounded-[10px] mt-[1px] px-[10px] pt-[10px]"
                >
                    <input
                        type="text"
                        placeholder="Submit essay on AI by Thursday p1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='text-[#202020] text-[14px] outline-none bg-none font-[600] w-full'
                    />
                    <div className="task_editor__editing_area" style={{ width: '100%', marginBottom: 8 }}>
                        <textarea
                            placeholder="Description"
                            rows={2}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className='mt-[5px] text-[#202020] text-[13px] outline-none bg-none font-[400] w-full'
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        <div className="relative">
                            <label htmlFor="start-time" className="text-[13px] block mb-1">Time Start</label>
                            <input
                                id="start-time"
                                type="datetime-local"
                                value={timeStart}
                                onChange={e => setTimeStart(e.target.value)}
                                className="w-full p-2 rounded border border-[#d1d5db] bg-[#f9fafb] transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="end-time" className="text-[13px] block mb-1">Time Finish</label>
                            <input
                                id="end-time"
                                type="datetime-local"
                                value={timeFinish}
                                onChange={e => setTimeFinish(e.target.value)}
                                className="w-full p-2 rounded border border-[#d1d5db] bg-[#f9fafb] transition-colors"
                            />
                        </div>
                    </div>
                    <div className="task-form-buttons mt-[8px] p-[8px] pr-[12px] border-t border-solid border-[#e6e6e6]" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setShowForm(false)}
                            className="task-form-button cancel bg-[#f5f5f5] hover:bg-[#E5E5E5] w-[68px] h-[32px] text-[#444] text-[13px] px-[12px] rounded-[5px] cursor-pointer font-[600]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={addTask}
                            className="ml-[10px] task-form-button add bg-[#dc4c3e] hover:bg-[#B93C2C] text-[#fff] w-[78px] h-[32px] text-[13px] px-[12px] rounded-[5px] cursor-pointer font-[600]"
                        >
                            Add task
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-add-task mt-[10px] flex items-center text-[14px] cursor-pointer text-[#808080] hover:text-[#dc4c3e] px-[8px] transition-colors w-full"
                >
                    <span className='text-[#dc4c3e] rounded-full font-[300] flex items-center justify-center pb-1 text-[25px] w-[20px] h-[20px] mr-[10px] icon-add'>+</span>
                    <span className='mt-[1px]'>Add task</span>
                </button>
            ))}
        </div>
    );
};