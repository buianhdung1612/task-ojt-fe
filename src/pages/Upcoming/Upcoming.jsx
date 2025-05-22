import { useEffect, useRef, useState, useContext } from "react";
import Cookies from "js-cookie";
import { format, addDays, startOfWeek, subWeeks, addWeeks, isBefore, startOfDay } from "date-fns";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { Title } from "../../components/Title/Title";
import { Trash2, X } from "lucide-react";
import { LiaCircleSolid } from "react-icons/lia";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlineNewLabel } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { UserContext } from "../../components/Route/ProtectedRoute";
import { ToastContext } from "../../App";

export const UpComingPage = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const token = Cookies.get("token");
    const [value, setValue] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), "dd-MM-yyyy")
    );
    const [yearDays, setyearDays] = useState([]);
    const weekDayRefs = useRef({});
    const monthDayRefs = useRef({});
    const tabRefs = useRef(null);
    const user = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState(''); 5
    const [content, setContent] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeFinish, setTimeFinish] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [listUsersPerTask, setListUsersPerTask] = useState({});
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTask, setEditTask] = useState({ title: '', content: '', timeStart: '', timeFinish: '' });
    const { toast } = useContext(ToastContext);

    const fetchApi = () => {
        fetch(`https://task-ojt.onrender.com/tasks?status=initial&status=doing`, {
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

    const fetchListUser = () => {
        fetch(`https://task-ojt.onrender.com/users/list`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data.data);
            })
    }

    useEffect(() => {
        fetchApi();
        fetchListUser();
    }, [])

    useEffect(() => {
        const getWeekDays = () => {
            const start = startOfWeek(value, { weekStartsOn: 1 });
            const days = [];
            for (let i = 0; i < 7; i++) {
                const currentDate = addDays(start, i);
                days.push({
                    dayName: format(currentDate, "EEE"),
                    day: format(currentDate, "dd"),
                    date: format(currentDate, "dd-MM-yyyy"),
                    isToday:
                        format(currentDate, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd"),
                });
            }
            setWeekDays(days);
        };
        getWeekDays();
    }, [value]);

    useEffect(() => {
        const getMonthDays = () => {
            const currentDay = new Date();
            const days = [];
            for (let i = 0; i < 365; i++) {
                const arrayDay = addDays(currentDay, i);
                days.push({
                    dayName: format(arrayDay, "EEEE"),
                    dayMoth: format(arrayDay, "MMM"),
                    dayDate: format(arrayDay, "dd"),
                    fullDate: format(arrayDay, "dd-MM-yyyy"),
                    isToday:
                        format(arrayDay, "dd-MM-yyyy") === format(new Date(), "dd-MM-yyyy"),
                });
            }
            setyearDays(days);
        };
        getMonthDays();
    }, [selectedDate]);

    useEffect(() => {
        const scrollToSelectedDate = () => {
            const el = monthDayRefs.current[selectedDate];
            const container = document.querySelector(".overflow-y-auto");
            if (el && container) {
                const containerRect = container.getBoundingClientRect();
                const elementRect = el.getBoundingClientRect();
                const scrollTop =
                    elementRect.top - containerRect.top + container.scrollTop;
                container.scrollTo({ top: scrollTop, behavior: "smooth" });
            }
        };
        scrollToSelectedDate();
    }, [selectedDate]);

    const handleTaskClick = (task) => {
        if (task.timeStart) {
            task.timeStart = task.timeStart.slice(0, 16);
        }
        if (task.timeFinish) {
            task.timeFinish = task.timeFinish.slice(0, 16);
        }
        setSelectedTask(task);
    };

    useEffect(() => {
        let timeoutId;
        const handleScroll = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (!monthDayRefs.current) return;
                const container = document.querySelector(".overflow-y-auto");
                if (!container) return;

                const containerRect = container.getBoundingClientRect();
                let closestDate = null;
                let minDistance = Infinity;

                for (const [date, el] of Object.entries(monthDayRefs.current)) {
                    if (!el) continue;
                    const rect = el.getBoundingClientRect();
                    const distance = Math.abs(rect.top - containerRect.top);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestDate = date;
                    }
                }

                if (closestDate && closestDate !== selectedDate) {
                    setSelectedDate(closestDate);
                    const [dd, mm, yyyy] = closestDate.split("-");
                    setValue(new Date(`${yyyy}-${mm}-${dd}`));
                }
            }, 200);
        };

        const container = document.querySelector(".overflow-y-auto");
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [selectedDate]);

    const handleDate = (data) => {
        setSelectedDate(data);
        const [day, month, year] = data.split("-");
        setValue(new Date(`${year}-${month}-${day}`));
        // onDateChange?.(new Date(`${year}-${month}-${day}`));
    };

    const handlePrevWeek = () => setValue((prev) => subWeeks(prev, 1));
    const handleToday = () => {
        const today = new Date();
        setValue(today);
        setSelectedDate(format(today, "dd-MM-yyyy"));
    };
    const handleNextWeek = () => setValue((next) => addWeeks(next, 1));

    const isPastDate = (dateString) => {
        const [day, month, year] = dateString.split("-");
        const date = new Date(`${year}-${month}-${day}`);
        return isBefore(startOfDay(date), startOfDay(new Date()));
    };

    const addTask = () => {
        const data = {
            title: title,
            status: "initial",
            content: content,
            timeStart: timeStart,
            timeFinish: timeFinish,
            listUser: [
                {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email
                }
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
                    fetchApi();
                    toast.success(data.message)
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
                    setTimeStart('');
                    setTimeFinish('');
                    setContent('');
                    setTitle('');
                    setShowForm(false);
                    setEditingTaskId(null);
                    toast.success(data.message)
                }
                else {
                    fetchApi();
                    setTimeStart('');
                    setTimeFinish('');
                    setContent('');
                    setTitle('');
                    setShowForm(false);
                    setEditingTaskId(null);
                    toast.error(data.message)
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
                    toast.success(data.message);
                    setSelectedTask(null);
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
                    toast.success(data.message)
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
                    setSelectedTask(null);
                    toast.success(data.message)
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
                if (data.code == "success") {
                    fetchApi();
                    toast.success(data.message)
                }
                else {
                    fetchApi();
                    toast.error(data.message)
                }
            })
    }

    return (
        <div className="max-h-screen w-full md:w-[800px] px-5 mx-auto">
            <div ref={tabRefs} className="relative bg-white z-10">
                <Title title="Upcoming" />
                <div className="flex justify-between">
                    <div>
                        <DatePicker
                            onChange={(date) => {
                                const formatted = format(date, "dd-MM-yyyy");
                                setValue(date);
                                setSelectedDate(formatted);
                            }}
                            minDate={new Date()}
                            className="flex items-center"
                            value={value}
                            locale="en-US"
                            format="dd-MM-yyyy"
                            calendarIcon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            }
                            clearIcon={null}
                        />
                    </div>
                    <div className="flex relative">
                        <button
                            onClick={handlePrevWeek}
                            className="hover:bg-gray-100 text-[#b2b2b2] relative border-1 after:content-[''] after:absolute after:w-[2px] after:h-4 after:bg-gray-100 after:right-[0] after:rounded-4xl after:top-[20%] rounded-l-[6px] border-y-gray-100 border-l-gray-100 border-r-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={handleToday}
                            className="hover:bg-gray-100 text-[#666] text-[12px] border-1 border-y-gray-100 border-x-0 px-2"
                        >
                            Today
                        </button>
                        <button
                            onClick={handleNextWeek}
                            className="text-[#b2b2b2] relative border-1 after:content-[''] after:absolute after:w-[2px] after:h-4 after:bg-gray-100 after:left-[0] hover:bg-gray-100 after:rounded-4xl after:top-[20%] rounded-r-[6px] border-y-gray-100 border-r-gray-100 border-l-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {!editingTaskId && (showForm ? (
                    <div
                        className="task-form w-full border border-solid border-[#e6e6e6] rounded-[10px] my-[10px] px-[10px] pt-[10px]"
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
                        <span className='my-[10px]'>Add task</span>
                    </button>
                ))}

                <div>
                    <div className="mt-[12px] flex justify-between">
                        {weekDays.map((day, index) => {
                            const isSelected = selectedDate === day.date;
                            const isPast = isPastDate(day.date);
                            return (
                                <div
                                    key={index}
                                    className={`flex gap-2 text-[13px] px-2 items-center justify-center md:px-6 rounded-md py-1 ${!isPast
                                        ? "hover:bg-gray-100 cursor-pointer"
                                        : "opacity-50 cursor-not-allowed"
                                        } font-medium`}
                                    onClick={() => !isPast && handleDate(day.date)}
                                    ref={(el) => (weekDayRefs.current[day.date] = el)}
                                >
                                    <div className="day-name">{day.dayName}</div>
                                    <div
                                        className={`${isSelected
                                            ? "rounded-[5px] flex items-center justify-center w-6 h-6 text-white bg-[#DC4C3E]"
                                            : ""
                                            } ${day.isToday ? "text-[#DC4C3E]" : ""}`}
                                    >
                                        {day.day}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-[100%] h-[1px] rounded-4xl bg-gray-300"></div>
                </div>
            </div>

            <div className="mt-[16px] px-[10px] h-[calc(100vh-200px)] overflow-y-auto">
                {yearDays.map((day, index) => (
                    <div
                        key={index}
                        ref={(el) => (monthDayRefs.current[day.fullDate] = el)}
                        className="pt-3"
                    >
                        <div id={day.fullDate} className="flex text-[14px] font-bold gap-2">
                            <p>{day.dayDate}</p>
                            <p>{day.dayMoth}</p>
                            <p>.</p>
                            <p>{day.dayName}</p>
                        </div>
                        <div className="w-[100%] pb-[10px] h-[1px] rounded-4xl border-b border-solid border-[#eee]"></div>

                        {/* ==== TODO ==== */}
                        <ul>
                            {tasks && tasks.filter(item => item.timeStart.slice(0, 10).split('-').reverse().join('-') == day.fullDate).map((task, index) => (
                                <div key={index}>
                                    <li
                                        className={`task-item px-[10px] task-item w-full  cursor-pointer pb-[30px] border-b border-solid border-[#eee] ${editingTaskId === task._id ? 'hidden' : ''}`}
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
                                                            setShowForm(false);
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
                    </div>
                ))}
            </div>
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
                                    onClick={() => handleDelete(selectedTask._id)}
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
        </div>
    );
};
