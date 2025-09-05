import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

// ✅ Navbar Component
const Navbar = ({ setFormState }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (val) => () => setOpen(val);

  const navItems = [
    { text: 'Join as Guest', onClick: () => console.log('Guest Mode') },
    { text: 'Register',  onClick: () => setFormState(1) },
    { text: 'Login', onClick: () => setFormState(0) },
  ];

  return (
    <AppBar
      position="absolute"
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
          onClick={() => navigate('/')}
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
                '&:hover': { color: '#ff7043' },
              }}
            //   variant={item.text === 'Login' ? 'outlined' : 'text'}
            >
              {item.text}
            </Button>
          ))}
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
                <ListItem button key={i} onClick={item.onClick}>
                  <ListItemText
                    primary={item.text}
                    sx={{ color: 'white', '&:hover': { color: '#ff7043' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;