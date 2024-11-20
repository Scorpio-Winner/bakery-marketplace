import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { userRoutes } from "./userRoutes";
import { bakeryRoutes } from "./bakeryRoutes";
import { BAKERY_PAGE_ROUTE, LOGIN_ROUTE, USER_MAIN_MENU_ROUTE } from "../utils/consts";

const AppRouter = () => {
    const [token, setToken] = useState(localStorage.getItem("accessToken"));
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
            navigate("/");
        };

        window.addEventListener("storage", handleStorageChange);
    }, [navigate]);

    /*if ((token && localStorage.getItem("role") === "user")) {
        return (
            <Routes>
                {userRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} exact />
                ))}
                <Route key="*" path="*" element={<Navigate to={USER_MAIN_MENU_ROUTE} />} />
            </Routes>
        );
    }*/

    if ((token && localStorage.getItem("role") === "bakery")) {
         return (
             <Routes>
                 {bakeryRoutes.map(({ path, Component }) => (
                     <Route key={path} path={path} element={<Component />} exact />
                 ))}
                 <Route key="*" path="*" element={<Navigate to={BAKERY_PAGE_ROUTE} />} />
             </Routes>
         );
         }

    if (!token) {
        return (
            <Routes>
                {publicRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} exact />
                ))}
                <Route key="*" path="*" element={<Navigate to={LOGIN_ROUTE} />} />
            </Routes>
        );
    }
};

export default AppRouter;