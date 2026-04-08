import React, { useContext, useEffect, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, TextField } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../contexts/Navbar.jsx';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [profile, setProfile] = useState(null);
    const { getUserProfile } = useContext(AuthContext);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileData = await getUserProfile();
                setProfile(profileData);
            } catch {
                setProfile(null);
            }
        };

        loadProfile();
    }, []);


    let handleJoinVideoCall = async () => {
        const trimmedMeetingCode = meetingCode.trim();
        if (!trimmedMeetingCode) {
            return;
        }

        navigate(`/${trimmedMeetingCode}`)
    }

    return (
        <>
       <div className='home'>
            <Navbar />


            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <div className="profileSummary">
                            <span>{profile?.name || localStorage.getItem("userName") || localStorage.getItem("guestName") || "Guest"}</span>
                            <span style={{ color: "#d5d5d5" }}>@{profile?.username || localStorage.getItem("userUsername") || "guest"}</span>
                        </div>
                        <h2>Your Meeting Room, Just One Click Away</h2>

                        <div style={{ display: 'flex', gap: "10px" }}>

                            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" />
                            <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>

                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/homepagelogo.png' alt="" />
                </div>
            </div>
            </div>
        </>
    )
}


export default withAuth(HomeComponent)