import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        bgcolor: '#050B18',
        background: 'radial-gradient(circle at 88% 12%, rgba(22,119,255,.16), transparent 32%), #050B18',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel */}
      <Box
        className="login-left-panel"
        sx={{
          flex: { xs: 0, md: '0 0 42%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: 5,
          py: 4,
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: '#FFFFFF',
            mb: 3,
            letterSpacing: '-0.02em',
            fontSize: '2.4rem',
            lineHeight: 1.15,
          }}
        >
          VAPT Report Generator
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#FFFFFF',
            mb: 1,
            letterSpacing: '-0.02em',
            fontSize: '1.75rem',
            lineHeight: 1.2,
          }}
        >
          Smart Report Generator
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            color: '#00F2FE',
            fontWeight: 600,
            mb: 2,
            fontSize: '1rem',
          }}
        >
          AI-Powered VAPT Report Generator
        </Typography>

        <Box
          sx={{
            width: 48,
            height: 3,
            borderRadius: 2,
            bgcolor: '#00F2FE',
            mb: 2,
          }}
        />

        <Typography
          variant="body2"
          sx={{
            color: '#94A3B8',
            maxWidth: 380,
            lineHeight: 1.6,
            fontSize: '0.875rem',
          }}
        >
          Generate professional vulnerability assessment and penetration testing reports with the power of AI.
        </Typography>

        <Box className="cyber-wave-bg" />
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 4 },
          py: 2,
          overflow: 'hidden',
        }}
      >
        {/* Mobile wordmark */}
        <Typography
          sx={{
            display: { xs: 'block', md: 'none' },
            fontWeight: 900,
            color: '#FFFFFF',
            fontSize: '1.5rem',
            textAlign: 'center',
            mb: 2,
          }}
        >
          VAPT Report Generator
        </Typography>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 380,
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            bgcolor: 'rgba(10, 23, 43, .9)',
            backgroundImage: 'linear-gradient(145deg, rgba(17,41,71,.92), rgba(6,18,34,.96))',
            border: '1px solid rgba(0,217,255,.18)',
            boxShadow: '0 20px 50px -12px rgba(0,0,0,.55)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#F4F8FF',
                mb: 0.5,
                fontSize: '1.5rem',
              }}
            >
              Welcome Back!
            </Typography>
            <Typography variant="body2" sx={{ color: '#9EB2CD', fontSize: '0.85rem' }}>
              Sign in to continue to Smart Report Generator
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: '#BFD5F2', mb: 0.5, fontSize: '0.8rem' }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon sx={{ color: '#71E8FF', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: '#BFD5F2', mb: 0.5, fontSize: '0.8rem' }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: '#71E8FF', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ color: '#9EB2CD', fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ color: '#9EB2CD', fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{ color: '#527094', '&.Mui-checked': { color: '#00D9FF' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: '#9EB2CD', fontSize: '0.8rem' }}>
                    Remember me
                  </Typography>
                }
              />
              <MuiLink
                underline="hover"
                sx={{
                  color: '#71E8FF',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Forgot Password?
              </MuiLink>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.1,
                bgcolor: '#1677FF',
                '&:hover': { bgcolor: '#0B55C7' },
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <>
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Paper>

        <Typography
          variant="caption"
          sx={{
            mt: 2,
            color: '#7891B1',
            fontSize: '0.75rem',
            textAlign: 'center',
          }}
        >
          © 2026 VAPT Report Generator. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
