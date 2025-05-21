import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const UserContext = createContext();

export const ProtectedRoute = (props) => {
    const token = Cookies.get("token");
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        fetch(`https://task-ojt.onrender.com/users/profile`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === "success") {
                    setUser(data.data);
                } else {
                    setUser(null);
                }
            });
    }, []);

    if (user === null) return <Navigate to="/users/login" />;

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    );
};
