import { Link } from "react-router-dom";
import { Title } from "../../components/Title/Title"
import { IoWaterOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const FiltersPage = () => {
    const [taskInit, setTaskInit] = useState([]);
    const [taskDoing, setTaskDoing] = useState([]);
    const [taskFinish, setTaskFinish] = useState([]);
    const token = Cookies.get("token");

    const fetchInit = () => {
        fetch(`https://task-ojt.onrender.com/tasks?status=initial`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTaskInit(data);
            })
    }

    const fetchDoing = () => {
        fetch(`https://task-ojt.onrender.com/tasks?status=doing`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTaskDoing(data);
            })
    }

    const fetchFinish = () => {
        fetch(`https://task-ojt.onrender.com/tasks?status=finish`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setTaskFinish(data);
            })
    }

    useEffect(() => {
        fetchInit();
        fetchDoing();
        fetchFinish();
    }, []);

    return (
        <>
            <Title title="Filters" />

            <div className="px-[20px]">
                <div className="flex justify-between items-center border-b pb-[8px] mb-[8px] border-solid border-[#eee]">
                    <Link to="/filters/detail?status=initial" className="flex items-center"><IoWaterOutline className="mr-[10px]" />To do</Link>
                    <div className='text-[#666] text-[14px] font-[400] flex items-center mt-[8px] mb-[16px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" class="siIBvPn"><path fill="currentColor" fill-rule="evenodd" d="M8 14.001a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM5.146 8.147a.5.5 0 0 1 .708 0L7 9.294l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 0-.708Z" clip-rule="evenodd"></path></svg>
                        <span className='ml-[5px]'>{taskInit.length} tasks</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-b pb-[8px] mb-[8px] border-solid border-[#eee]">
                    <Link to="/filters/detail?status=doing" className="flex items-center"><IoWaterOutline className="mr-[10px]" />Working</Link>
                    <div className='text-[#666] text-[14px] font-[400] flex items-center mt-[8px] mb-[16px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" class="siIBvPn"><path fill="currentColor" fill-rule="evenodd" d="M8 14.001a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM5.146 8.147a.5.5 0 0 1 .708 0L7 9.294l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 0-.708Z" clip-rule="evenodd"></path></svg>
                        <span className='ml-[5px]'>{taskDoing.length} tasks</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-b pb-[8px] mb-[8px] border-solid border-[#eee]">
                    <Link to="/filters/detail?status=finish" className="flex items-center"><IoWaterOutline className="mr-[10px]" />Completed</Link>
                    <div className='text-[#666] text-[14px] font-[400] flex items-center mt-[8px] mb-[16px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true" class="siIBvPn"><path fill="currentColor" fill-rule="evenodd" d="M8 14.001a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-1a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM5.146 8.147a.5.5 0 0 1 .708 0L7 9.294l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 0-.708Z" clip-rule="evenodd"></path></svg>
                        <span className='ml-[5px]'>{taskFinish.length} tasks</span>
                    </div>
                </div>
            </div>
        </>
    )
}