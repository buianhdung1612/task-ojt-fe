import { useState } from 'react';
import { PiCalendarDuotone } from "react-icons/pi";
import { TbCalendarMonth } from "react-icons/tb";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { RxCountdownTimer } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import Cookies from "js-cookie";

export function Search({ onClose, onSearch }) {
    const token = Cookies.get("token");
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState(["Học bài", "Ngủ"]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            setRecentSearches(prev => {
                const updated = [inputValue, ...prev.filter(item => item !== inputValue)];
                return updated.slice(0, 7);
            });

            onSearch(inputValue.trim());
            onClose();

            setInputValue('');
            setSuggestions([]);
        }
    };

    const handleDeleteRecent = (itemToDelete) => {
        setRecentSearches(prev => prev.filter(item => item !== itemToDelete));
    };

    // const handleClickSearch = () => {
    //     const keyword = inputValue;

    //     fetch(`https://task-ojt.onrender.com/tasks?keyword=${keyword}`, {
    //         headers: { Authorization: `Bearer ${token}` }
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log(data);
    //         });
    // }


    return (
        <div className="fixed inset-0 z-50 flex justify-center mb-[100px] items-center" onClick={onClose}>
            <div className="w-[650px] h-[450px] shadow-xl/30 rounded-[10px] bg-gray-50" onClick={(e) => e.stopPropagation()}>
                <div className='flex items-center border-b border-black/20 pb-2'>
                    <CiSearch className='text-[#2A2A2A] text-[24px] mt-[15px] ml-[10px]' />
                    <input className='ml-[15px] mt-[15px] w-[550px] outline-none'
                        type="text" placeholder="Search or type a command..."
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}></input>
                </div>
                <div className='custom-scroll overflow-y-auto h-[395px]'>


                    {/* Suggestions // Đợi API */}
                    <div className="ml-[15px] mt-2 max-h-[150px]">
                        {suggestions.length > 0 ? (
                            suggestions.map((item, idx) => (
                                <div key={idx} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                                    {item}
                                </div>
                            ))
                        ) : (
                            inputValue && <p className="text-gray-500 ">No results found</p>
                        )}
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <div className="mt-4">
                            <p className="text-gray-500 text-sm mb-2 ml-[15px]">Recent Searches</p>
                            <div className="flex flex-col">
                                {recentSearches.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 hover:border-l-2 hover:border-solid hover:border-[#dc4c3e] cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            <RxCountdownTimer className='text-[#666] text-[24px] ml-1.5' />
                                            <span className='ml-[10px] text-[14px]'>{item}</span>
                                        </div>
                                        <div onClick={() => handleDeleteRecent(item)}>
                                            <IoMdClose className='text-[18px] text-[#666]' />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Navigation */}
                    <div className='mt-[15px]'>
                        <div className="flex flex-col">
                            <p className="text-gray-500 text-sm ml-[15px] mb-[2px]">Navigation</p>
                            <Link to="/today" className='flex items-center px-3 py-2 hover:bg-gray-100 hover:border-l-2 hover:border-solid hover:border-[#dc4c3e] cursor-pointer'>
                                <PiCalendarDuotone className='text-[#666] text-[24px] ml-1.5' />
                                <p className='ml-[10px] text-[14px]'>Go to Today</p>
                            </Link>
                            <Link to="/upcoming" className='flex items-center px-3 py-2 hover:bg-gray-100 hover:border-l-2 hover:border-solid hover:border-[#dc4c3e] cursor-pointer'>
                                <TbCalendarMonth className='text-[#666] text-[24px] ml-1.5' />
                                <p className='ml-[10px] text-[14px]'>Go to Upcoming</p>
                            </Link>
                            <Link to="/filters" className='flex items-center px-3 py-2 hover:bg-gray-100 hover:border-l-2 hover:border-solid hover:border-[#dc4c3e] cursor-pointer'>
                                <HiOutlineSquares2X2 className='text-[#666] text-[24px] ml-1.5' />
                                <p className='ml-[10px] text-[14px]'>Go to Filters</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}