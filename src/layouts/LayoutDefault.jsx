import { Outlet } from "react-router-dom"
import { Sider } from "../components/Sider/Sider"

export const LayoutDefault = () => {
    return (
        <>
            <div className="flex">
                <Sider />

                <div className="flex-1 pt-[55px]">
                    <div className="w-[800px] mx-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}