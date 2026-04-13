import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment.js";


export const AuthContext = createContext({});

const client = axios.create({
    // baseURL: `${server}/api/v1/users`
    baseURL: `${server}/api/v1/users`,
    timeout: 20000
})


export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);


    const [userData, setUserData] = useState(authContext);


    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            // console.log(username, password)
            // console.log(request.data)

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                localStorage.setItem("userName", request.data.user?.name || "");
                localStorage.setItem("userUsername", request.data.user?.username || "");
                localStorage.removeItem("isGuest");
                localStorage.removeItem("guestName");
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    const handleGuestLogin = (name) => {
        const guestName = (name || "Guest").trim() || "Guest";
        const guestToken = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

        localStorage.setItem("token", guestToken);
        localStorage.setItem("isGuest", "true");
        localStorage.setItem("guestName", guestName);
        localStorage.removeItem("userName");
        localStorage.removeItem("userUsername");
        router("/home");
    }

    const getHistoryOfUser = async () => {
        if (localStorage.getItem("isGuest") === "true") {
            return [];
        }

        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        if (localStorage.getItem("isGuest") === "true") {
            return null;
        }

        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request.data;
        } catch (e) {
            throw e;
        }
    }

    const completeUserHistory = async (activityId, durationSeconds) => {
        if (localStorage.getItem("isGuest") === "true" || !activityId) {
            return;
        }

        try {
            await client.post("/complete_activity", {
                token: localStorage.getItem("token"),
                activity_id: activityId,
                duration_seconds: durationSeconds
            });
        } catch (e) {
            throw e;
        }
    }

    const getUserProfile = async () => {
        if (localStorage.getItem("isGuest") === "true") {
            return {
                name: localStorage.getItem("guestName") || "Guest",
                username: "guest",
                totalCalls: 0,
                totalDurationSeconds: 0,
                averageDurationSeconds: 0
            };
        }

        const request = await client.get("/profile", {
            params: {
                token: localStorage.getItem("token")
            }
        });

        return request.data;
    }


    const data = {
        userData,
        setUserData,
        addToUserHistory,
        completeUserHistory,
        getHistoryOfUser,
        getUserProfile,
        handleRegister,
        handleLogin,
        handleGuestLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}