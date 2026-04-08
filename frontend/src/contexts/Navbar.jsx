import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Avatar, Snackbar, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton, ListItemAvatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, History, Home, Logout, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Navbar Component
const Navbar = ({ setFormState }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { handleGuestLogin } = React.useContext(AuthContext);
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const isGuest = localStorage.getItem('isGuest') === 'true';
  const profileName = isGuest
    ? localStorage.getItem('guestName') || 'Guest'
    : localStorage.getItem('userName') || localStorage.getItem('userUsername') || 'Profile';
  const profileInitial = profileName?.trim()?.charAt(0)?.toUpperCase() || 'U';

  const toggleDrawer = (val) => () => setOpen(val);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guestName');
    localStorage.removeItem('userName');
    localStorage.removeItem('userUsername');
    navigate('/auth');
  };

  const navItems = isAuthenticated
    ? [
        { text: 'Home', icon: <Home fontSize="small" />, onClick: () => navigate('/home') },
        { text: 'Profile', icon: <Person fontSize="small" />, onClick: () => navigate('/profile') },
        { text: 'History', icon: <History fontSize="small" />, onClick: () => navigate('/history') },
        { text: 'Logout', icon: <Logout fontSize="small" />, onClick: handleLogout },
      ]
    : [
        { text: 'Join as Guest', onClick: () => handleGuestLogin('Guest') },
        { text: 'Register', onClick: () => setFormState?.(1) },
        { text: 'Login', onClick: () => setFormState?.(0) },
      ];

  const brandClick = () => {
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(6px)',
        boxShadow: 'none',
        px: { xs: 2, md: 4 },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#ff7043',
            letterSpacing: 2,
            cursor: 'pointer',
          }}
          onClick={brandClick}
        >
          H i m X M e e t
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          {navItems.map((item, i) => (
            <Button
              key={i}
              onClick={item.onClick}
              sx={{
                color: 'white',
                fontWeight: 500,
                textTransform: 'none',
                display: 'flex',
                gap: 1,
                '&:hover': { color: '#ff7043' },
              }}
            >
              {item.icon}
              {item.text}
            </Button>
          ))}
          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/profile')}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 999,
                px: 1.25,
                py: 0.5,
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                '&:hover': { borderColor: '#ff7043', color: '#ff7043' },
              }}
            >
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#ff7043', fontSize: 14 }}>
                {profileInitial}
              </Avatar>
              {profileName}
            </Button>
          ) : null}
        </Box>

        {/* Mobile Hamburger */}
        <IconButton
          sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width: 220,
              p: 2,
              backgroundColor: 'rgba(0,0,0,0.9)',
              height: '100%',
            }}
          >
            <List>
              {navItems.map((item, i) => (
                <ListItem key={i} disablePadding>
                  <ListItemButton onClick={item.onClick} sx={{ borderRadius: 2 }}>
                    {item.icon ? (
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#ff7043', width: 32, height: 32 }}>
                          {item.text.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                    ) : null}
                    <ListItemText
                      primary={item.text}
                      sx={{ color: 'white', '&:hover': { color: '#ff7043' } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {isAuthenticated ? (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate('/profile')} sx={{ borderRadius: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#ff7043', width: 32, height: 32 }}>
                        {profileInitial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={profileName} sx={{ color: 'white' }} />
                  </ListItemButton>
                </ListItem>
              ) : null}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;