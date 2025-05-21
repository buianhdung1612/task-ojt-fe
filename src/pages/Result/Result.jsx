import { useSearchParams } from "react-router-dom";
import { Title } from "../../components/Title/Title";
import { LiaCircleSolid } from "react-icons/lia";
import { GoPencil } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const ResultPage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', content: '', timeStart: '', timeFinish: '' });
  const keyword = searchParams.get('q');
  const token = Cookies.get("token");

  const fetchApi = () => {
    fetch(`https://task-ojt.onrender.com/tasks?keyword=${keyword}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTasks(data);
      });
  }

  useEffect(() => {
    fetchApi();
  }, [])

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
              className={`task-item task-item w-full flex items-center cursor-pointer pb-[30px] border-b border-solid border-[#eee] ${editingTaskId === task._id ? 'hidden' : ''}`}
            >
              <div className='flex items-center flex-1'>
                <div className='icon-wrapper' onClick={() => handleClickFinish(task._id)}>
                  <LiaCircleSolid className='text-[24px] text-[#999999] icon-finish' />
                  <CiCircleCheck className='text-[22px] text-[#999999] icon-finished' />
                </div>
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
              {task.status !== "finish" && (
                <div className='flex items-center'>
                  <GoPencil
                    onClick={() => {
                      handleEditClick(task);
                      setShowForm(false);
                    }}
                    className='icon-edit text-[20px] text-[#999999] mr-[15px] w-7 h-7 p-1 rounded-[5px] hover:bg-[#EEEEEE]'
                  />
                  <RiDeleteBin6Line onClick={() => handleDelete(task._id)} className='icon-delete text-[20px] text-[#999999] w-7 h-7 p-1 rounded-[5px] hover:bg-[#EEEEEE]' />
                </div>
              )}
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

    </>
  );
};