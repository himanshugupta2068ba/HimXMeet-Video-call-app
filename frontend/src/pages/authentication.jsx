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
import Navbar from '../contexts/Navbar.jsx';
// 🎨 Theme
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#ff190056', // orange theme
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

// ✅ Authentication Page
export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0); // 0 = Login, 1 = Register
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  let handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      }
      if (formState === 1) {
        let result = await handleRegister(name, username, password);
        setUsername('');
        setMessage(result);
        setOpen(true);
        setError('');
        setFormState(0);
        setPassword('');
      }
    } catch (err) {
      let message = err.response?.data?.message || 'Something went wrong';
      setError(message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: '100vh',
          backgroundImage: 'url("/loginimage.jpg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <CssBaseline />
        {/* ✅ Navbar */}
        <Navbar setFormState={setFormState} />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(30,0,0,0.6))',
            zIndex: 0,
          }}
        />

        {/* Motion wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ zIndex: 1 }}
        >
          <Paper
            elevation={10}
            sx={{
              width: 420,
              maxWidth: '90vw',
              p: 4,
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              color: 'white',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                {formState === 0 ? 'Sign In' : 'Sign Up'}
              </Typography>

              <Box component="form" noValidate sx={{ mt: 1 }}>
                {formState === 1 && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Full Name"
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    InputLabelProps={{
                      style: { color: '#f5f5f53f', fontWeight: '600' },
                    }}
                    InputProps={{
                      style: { color: 'white' },
                    }}
                  />
                )}

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputLabelProps={{
                    style: { color: '#ec151572', fontWeight: '900' },
                  }}
                  InputProps={{
                    style: { color: 'white' },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{
                    style: { color: '#ec151572', fontWeight: '600' },
                  }}
                    InputProps={{ style: { color: 'white' } }}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.2,
                    fontWeight: 'bold',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ff4800, #ff190056)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff190056, #ff4800)',
                    },
                  }}
                  onClick={handleAuth}
                >
                  {formState === 0 ? 'Login' : 'Register'}
                </Button>

                <Grid container justifyContent="center">
                  <Grid item>
                    <Button
                      onClick={() => setFormState(formState === 0 ? 1 : 0)}
                      sx={{
                        color: '#ff7043',
                        fontWeight: '600',
                        textTransform: 'none',
                      }}
                    >
                      {formState === 0
                        ? "Don't have an account? Sign Up"
                        : 'Already have an account? Sign In'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <Snackbar open={open} autoHideDuration={4000} message={message} />
      </Grid>
    </ThemeProvider>
  );
}

