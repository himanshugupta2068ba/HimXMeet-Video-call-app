import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

import { IconButton } from '@mui/material';
import Navbar from '../contexts/Navbar.jsx';
export default function History() {


    const { getHistoryOfUser, getUserProfile } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([])
    const [profile, setProfile] = useState(null)
    const isGuest = localStorage.getItem("isGuest") === "true";


    const routeTo = useNavigate();

    useEffect(() => {
        if (isGuest) {
            setMeetings([]);
            return;
        }

        const fetchHistory = async () => {
            try {
                const [history, profileData] = await Promise.all([
                    getHistoryOfUser(),
                    getUserProfile()
                ]);

                const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
                setMeetings(sortedHistory);
                setProfile(profileData);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }

        fetchHistory();
    }, [isGuest, getHistoryOfUser, getUserProfile])

    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

    const formatDuration = (totalSeconds = 0) => {
        const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
        const hours = Math.floor(safeSeconds / 3600);
        const minutes = Math.floor((safeSeconds % 3600) / 60);
        const seconds = safeSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }

        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }

        return `${seconds}s`;
    };

    return (
        <div style={{ padding: "92px 18px 18px", background: "#111", minHeight: "100vh", color: "#fff" }}>

            <Navbar />

            <IconButton onClick={() => {
                routeTo("/home")
            }} style={{ color: "#fff" }}>
                <HomeIcon />
            </IconButton >
            {isGuest ? <p>Guest sessions do not store meeting history.</p> : null}

            {!isGuest && profile ? (
                <Card variant="outlined" style={{ marginBottom: "16px", background: "#191919", borderColor: "#2a2a2a" }}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#ffd3c8" }}>
                            {profile.name}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: "#c4c4c4", mb: 2 }}>
                            @{profile.username}
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: "#f0f0f0" }}>
                            Calls attended: {profile.totalCalls}
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: "#f0f0f0" }}>
                            Total time spent: {formatDuration(profile.totalDurationSeconds)}
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: "#f0f0f0" }}>
                            Avg call duration: {formatDuration(profile.averageDurationSeconds)}
                        </Typography>
                    </CardContent>
                </Card>
            ) : null}
            {
                (meetings.length !== 0) ? meetings.map((e, i) => {
                    return (

                        <Card key={i} variant="outlined" style={{ marginBottom: "10px", background: "#191919", borderColor: "#2a2a2a" }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 15, color: "#ffd3c8" }} gutterBottom>
                                    Code: {e.meetingCode}
                                </Typography>

                                <Typography sx={{ mb: 1.5, color: "#c4c4c4" }}>
                                    Date: {formatDate(e.date)}
                                </Typography>

                                <Typography sx={{ color: "#f0f0f0" }}>
                                    Duration: {formatDuration(e.durationSeconds || 0)}
                                </Typography>
                            </CardContent>
                        </Card>
                    )
                }) : <p style={{ color: "#ddd" }}>No meetings yet.</p>

            }

        </div>
    )
}