import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, Avatar, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';
import Navbar from '../contexts/Navbar.jsx';

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

function Profile() {
  const navigate = useNavigate();
  const { getUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

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
  }, [getUserProfile]);

  const profileName = profile?.name || localStorage.getItem('guestName') || localStorage.getItem('userName') || 'Guest';
  const profileUsername = profile?.username || localStorage.getItem('userUsername') || 'guest';
  const profileInitial = profileName.trim().charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f10, #281111 60%, #151515)', color: '#fff' }}>
      <Navbar />
      <div style={{ padding: '96px 20px 28px', maxWidth: 1100, margin: '0 auto' }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: 4, height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <Avatar sx={{ width: 96, height: 96, bgcolor: '#ff7043', fontSize: 36 }}>
                  {profileInitial}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {profileName}
                </Typography>
                <Typography sx={{ color: '#c7c7c7' }}>
                  @{profileUsername}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/home')}
                  sx={{ background: 'linear-gradient(135deg, #ff7043, #ff3d00)', borderRadius: 999, px: 3 }}
                >
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: 4, height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <CardContent>
                    <Typography sx={{ color: '#c7c7c7', mb: 1 }}>Calls</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{profile?.totalCalls ?? 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: 4, height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <CardContent>
                    <Typography sx={{ color: '#c7c7c7', mb: 1 }}>Total duration</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatDuration(profile?.totalDurationSeconds ?? 0)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: 4, height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <CardContent>
                    <Typography sx={{ color: '#c7c7c7', mb: 1 }}>Average</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>{formatDuration(profile?.averageDurationSeconds ?? 0)}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Account summary</Typography>
                    <Typography sx={{ color: '#d5d5d5', mb: 1 }}>
                      This profile page stays reachable from the navbar on every authenticated screen.
                    </Typography>
                    <Typography sx={{ color: '#d5d5d5' }}>
                      Use Home, History, or the profile button in the top bar to move around without signing in again.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default withAuth(Profile);
