import { useState, useEffect } from 'react';
import { setCookie, getCookie, deleteCookie } from './cookies';

export function useAuthCookie() {
    const [token, setToken] = useState(null);

    useEffect(()=>{
        const savedToken = getCookie("token");
        if(savedToken){
            SetToken(savedToken);
        }
    },[]);

    const login = () => {
        const fakeToken = "galletas";
        setCookie("token", fakeToken, 1);
        setToken(fakeToken);
    }

    const logout = () => {
        deleteCookie("token");
        setToken(null);
    }

    return { token, login, logout };
}