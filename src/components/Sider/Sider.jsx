import messiImg from '../../assets/images/messi.webp';
import { MdAddCircle } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { PiCalendarDuotone } from "react-icons/pi";
import { TbCalendarMonth } from "react-icons/tb";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { Search } from '../Search/Search';
import Cookies from "js-cookie";
import { UserContext } from '../Route/ProtectedRoute';

const menu = [
    {
        label: "Today",
        icon: PiCalendarDuotone,
        path: "/today",
    },
    {
        label: "Upcoming",
        icon: TbCalendarMonth,
        path: "/upcoming",
    },
    {
        label: "Filters",
        icon: HiOutlineSquares2X2,
        path: "/filters",
    }
]

export const Sider = (props) => {
    // const user = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("q");
        setKeyword(q);
    }, [location.search]);

    const handleSearch = (kw) => {
        setKeyword(kw);
        setOpen(false);

        navigate(`/search/result?q=${encodeURIComponent(kw)}`);
    };

    const handleClickLogOut = () => {
        Cookies.remove("token");
        navigate("/users/login");
    }
    return (
        <>
            <div className="w-[280px] !h-screen bg-[#fcfaf8] p-[4px] flex flex-col">
                <div className="p-[12px]">
                    <div className='flex items-center rounded-[6px] hover:bg-[#f2efed] cursor-pointer'>
                        <div className="w-[40px] aspect-square p-1 ml-1.5">
                            <img src={messiImg} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="text-[14px] text-[#202020] font-[600] ml-[10px]">Bùi Anh Dũng</div>
                    </div>
                </div>
                <div className='px-[12px] flex flex-1 flex-col'>
                    <div className='py-[6px] flex items-center rounded-[5px] hover:bg-[#f2efed] cursor-pointer'>
                        <MdAddCircle className='text-[#D14F3E] text-[24px] ml-1.5' />
                        <div className='text-[14px] text-[#a81f00] ml-[7px] font-[600]'>Add task</div>
                    </div>
                    <div onClick={() => setOpen(true)} className='py-[6px] flex items-center rounded-[5px] hover:bg-[#f2efed] cursor-pointer'>
                        <CiSearch className='text-[#666] text-[24px] ml-1.5' />
                        <div className='text-[14px] text-[#202020] ml-[7px] font-[400]'>Search</div>
                    </div>

                    {menu.map((item, index) => (
                        <NavLink key={index} to={item.path} className='py-[6px] flex items-center rounded-[5px] hover:bg-[#f2efed] cursor-pointer'>
                            <item.icon className='text-[#666] text-[24px] ml-1.5' />
                            <div className='text-[14px] text-[#202020] ml-[7px] font-[400]'>{item.label}</div>
                        </NavLink>
                    ))}
                    <div onClick={handleClickLogOut} className='mt-auto mb-[5px] py-[6px] flex items-center rounded-[5px] hover:bg-[#f2efed] cursor-pointer'>
                        <MdLogout className='text-[#666] text-[24px] ml-1.5' />
                        <div className='text-[14px] text-[#202020] ml-[7px] font-[400]'>Log out</div>
                    </div>
                </div>
            </div>

            {open && <Search onSearch={handleSearch} onClose={() => setOpen(false)} />}
        </>
    )
}