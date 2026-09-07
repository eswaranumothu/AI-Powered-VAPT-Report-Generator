import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, Divider,
  IconButton, Avatar, Chip, Menu, MenuItem, Tooltip,
  ListItemIcon, InputBase, Paper,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import GppGoodIcon from '@mui/icons-material/GppGood';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { projectsApi } from '../../api/projects';
import { masterVulnerabilitiesApi } from '../../api/masterVulnerabilities';
import { C, glow } from '../../theme';

const DRAWER_W        = 200;
const NAV_ACCENT      = '#00d9ff';
const NAV_BG          = '#050d1f';
const NAV_HOVER       = 'rgba(255,255,255,0.04)';
const NAV_TEXT        = '#6b8cae';

// ── Pre-computed dot positions for background wave (avoids IIFE in JSX) ──────
const waveDots: { key: string; cx: number; cy: number; r: number; fill: string; opacity: number }[] = [];
(function buildDots() {
  const rows = 18, cols = 22;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = 680 + c * 34;
      const waveY = 420 + Math.sin((c / cols) * Math.PI * 1.4) * 140;
      const cy = waveY + (r - rows / 2) * 22;
      const dist = Math.abs(cy - waveY);
      const fade = 1 - dist / ((rows / 2) * 22);
      if (fade < 0.05) continue;
      const xFade = (c / cols) * 0.6 + 0.3;
      const opacity = Math.round(fade * xFade * 0.72 * 100) / 100;
      const radius  = Math.round((0.9 + fade * xFade * 1.5) * 10) / 10;
      const fill    = c > cols * 0.6 && r >= rows * 0.3 && r <= rows * 0.7 ? '#00aaff' : '#1566dd';
      waveDots.push({ key: `d${r}-${c}`, cx, cy, r: radius, fill, opacity });
    }
  }
})();

// ── Background SVG component ───────────────────────────────────────────────────
const BgPattern: React.FC = () => (
  <Box component="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    sx={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>

    {/* Flowing wave lines */}
    <g fill="none" strokeLinecap="round">
      <path d="M-20,560 C120,530 260,460 380,400 C500,340 580,260 700,230 C820,200 920,240 1020,300"
        stroke="#1255cc" strokeWidth="1.0" opacity="0.22"/>
      <path d="M-20,590 C120,558 265,485 388,424 C508,363 590,280 712,248 C834,216 935,256 1038,318"
        stroke="#1a66dd" strokeWidth="1.0" opacity="0.19"/>
      <path d="M-20,618 C122,585 270,510 394,447 C516,385 600,300 724,267 C848,234 950,274 1055,336"
        stroke="#1e77ee" strokeWidth="0.9" opacity="0.17"/>
      <path d="M-20,646 C124,611 274,534 400,470 C524,406 610,320 736,286 C862,252 966,293 1072,356"
        stroke="#2288ff" strokeWidth="0.9" opacity="0.15"/>
      <path d="M-20,674 C126,637 278,558 406,493 C532,427 620,340 748,305 C876,270 982,312 1090,376"
        stroke="#1a77ee" strokeWidth="0.9" opacity="0.13"/>
      <path d="M-20,702 C128,663 282,582 412,516 C540,448 630,360 760,324 C890,288 998,331 1108,396"
        stroke="#1266dd" strokeWidth="0.8" opacity="0.11"/>
      <path d="M-20,532 C118,503 255,435 374,376 C492,317 570,240 688,212 C806,184 906,225 1006,285"
        stroke="#0e4db8" strokeWidth="0.9" opacity="0.17"/>
      <path d="M-20,504 C116,477 250,411 368,353 C484,295 560,220 676,193 C792,166 892,208 990,268"
        stroke="#0c44a6" strokeWidth="0.8" opacity="0.13"/>
    </g>

    {/* Wave dot field */}
    <g>
      {waveDots.map(d => (
        <circle key={d.key} cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} opacity={d.opacity} />
      ))}
    </g>
  </Box>
);

// ── Main layout ────────────────────────────────────────────────────────────────
export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl,    setAnchorEl]    = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen,  setSearchOpen]  = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const effectiveWidth = sidebarOpen ? DRAWER_W : 0;

  const { data: allProjects = [] } = useQuery({ queryKey: ['projects'],              queryFn: projectsApi.list });
  const { data: allVulns    = [] } = useQuery({ queryKey: ['masterVulnerabilities'], queryFn: masterVulnerabilitiesApi.list });

  const q = searchQuery.trim().toLowerCase();
  const matchedProjects = useMemo(() => q.length < 2 ? [] : allProjects.filter(p =>
    p.project_name.toLowerCase().includes(q) ||
    p.project_code.toLowerCase().includes(q) ||
    p.client_name.toLowerCase().includes(q)
  ).slice(0, 5), [q, allProjects]);

  const matchedVulns = useMemo(() => q.length < 2 ? [] : allVulns.filter(v =>
    v.title.toLowerCase().includes(q) ||
    (v.cwe ?? '').toLowerCase().includes(q) ||
    (v.owasp ?? '').toLowerCase().includes(q)
  ).slice(0, 4), [q, allVulns]);

  const hasResults = matchedProjects.length > 0 || matchedVulns.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { setAnchorEl(null); logout(); navigate('/login'); };

  const navItems = [
    { text: 'Dashboard',              icon: <DashboardIcon fontSize="small" />,    path: '/' },
    { text: 'My Projects',            icon: <FolderSharedIcon fontSize="small" />, path: '/my-projects' },
    { text: 'All Projects',           icon: <FolderOpenIcon fontSize="small" />,   path: '/projects' },
    { text: 'Master Vulnerabilities', icon: <GppGoodIcon fontSize="small" />,      path: '/master-vulnerabilities',
      subtext: isAdmin ? undefined : 'Read Only' },
    ...(isAdmin ? [{ text: 'Users', icon: <GroupIcon fontSize="small" />, path: '/users' }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/projects') return location.pathname === '/projects' || location.pathname.startsWith('/projects/');
    return location.pathname.startsWith(path);
  };

  // ── Sidebar content ──────────────────────────────────────────────────────────
  const sidebar = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      bgcolor: NAV_BG, borderRight: `1px solid ${C.border}`, overflow: 'hidden',
    }}>
      {/* Wordmark */}
      <Box sx={{ px: 2, pt: 3, pb: 2.5, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{
          fontWeight: 900, fontSize: '1rem', lineHeight: 1.25, textAlign: 'center',
          color: '#fff', letterSpacing: '0.04em',
          textShadow: '0 0 12px rgba(0,217,255,0.55)',
        }}>
          VAPT<br />Report Generator
        </Typography>
      </Box>

      <Divider sx={{ borderColor: `${C.border}55`, mx: 2, mb: 2 }} />

      {/* Nav items */}
      <Box sx={{ flex: 1, px: 1.5, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Box key={item.text}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: 2, py: 1.1, mb: 0.5, borderRadius: '10px', cursor: 'pointer',
                bgcolor: active ? C.blue : 'transparent',
                boxShadow: active ? glow(C.blue, 14, 0.35) : 'none',
                transition: 'all 0.15s ease',
                '&:hover': { bgcolor: active ? C.blue : NAV_HOVER },
              }}>
              <Box sx={{ color: active ? '#fff' : NAV_TEXT, display: 'flex', flexShrink: 0,
                '& svg': { fontSize: '1.1rem' } }}>
                {item.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: active ? 700 : 400,
                  color: active ? '#fff' : NAV_TEXT, lineHeight: 1.2 }}>
                  {item.text}
                </Typography>
                {item.subtext && (
                  <Typography sx={{ fontSize: '0.55rem', color: NAV_ACCENT,
                    letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 700 }}>
                    {item.subtext}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* User card */}
      <Box sx={{ p: 1.5, borderTop: `1px solid ${C.border}44` }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: 1.25, borderRadius: '10px',
          bgcolor: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}44`,
        }}>
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <Avatar sx={{ bgcolor: C.blue, width: 34, height: 34, fontSize: '0.85rem', fontWeight: 800 }}>
              {user?.full_name?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9,
              bgcolor: C.green, borderRadius: '50%', border: `2px solid ${NAV_BG}` }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>
              {user?.full_name ?? 'User'}
            </Typography>
            <Typography noWrap sx={{ fontSize: '0.68rem', color: NAV_TEXT }}>
              {user?.email}
            </Typography>
          </Box>
          <Tooltip title="Logout">
            <IconButton size="small" onClick={handleLogout}
              sx={{ color: NAV_TEXT, '&:hover': { color: C.red } }}>
              <LogoutIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: C.bg0 }}>

      {/* Background wave pattern */}
      <BgPattern />

      {/* AppBar */}
      <AppBar position="fixed" elevation={0} sx={{
        width: { sm: `calc(100% - ${effectiveWidth}px)` },
        ml: { sm: `${effectiveWidth}px` },
        bgcolor: `${C.bg1}f0`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        transition: 'width 0.25s ease, margin-left 0.25s ease',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}>
        <Toolbar sx={{ gap: 2, minHeight: '56px' }}>
          <IconButton color="inherit" onClick={() => setMobileOpen(true)}
            sx={{ display: { sm: 'none' }, color: NAV_TEXT }}>
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setSidebarOpen(p => !p)}
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, color: NAV_TEXT }}>
            <MenuIcon fontSize="small" />
          </IconButton>

          {/* Live search */}
          <Box ref={searchRef} sx={{ flex: 1, maxWidth: 360, mx: 'auto', position: 'relative' }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              bgcolor: C.bg2, border: `1px solid ${searchOpen ? C.cyan : C.border}`,
              borderRadius: '8px', px: 1.5, py: 0.5,
              boxShadow: searchOpen ? glow(C.cyan, 8, 0.18) : 'none',
              transition: 'all 0.2s',
            }}>
              <SearchIcon sx={{ fontSize: '0.9rem', color: NAV_TEXT, flexShrink: 0 }} />
              <InputBase
                placeholder="Search projects, vulnerabilities…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                sx={{ flex: 1, fontSize: '0.82rem', color: C.white,
                  '& input::placeholder': { color: NAV_TEXT, opacity: 1 } }}
              />
              {searchQuery && (
                <IconButton size="small"
                  onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                  sx={{ color: NAV_TEXT, p: 0.2, '&:hover': { color: C.white } }}>
                  <CloseIcon sx={{ fontSize: '0.85rem' }} />
                </IconButton>
              )}
            </Box>

            {searchOpen && searchQuery.length >= 2 && (
              <Paper elevation={0} sx={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                bgcolor: C.bg2, border: `1px solid ${C.border}`, borderRadius: '10px',
                zIndex: 9999, boxShadow: `0 12px 40px rgba(0,0,0,0.6)`,
                overflow: 'hidden', maxHeight: 380, overflowY: 'auto',
              }}>
                {!hasResults ? (
                  <Box sx={{ px: 2, py: 2.5, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '0.82rem', color: NAV_TEXT }}>
                      No results for "{searchQuery}"
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {matchedProjects.length > 0 && (
                      <Box>
                        <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700,
                            color: NAV_TEXT, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            Projects
                          </Typography>
                        </Box>
                        {matchedProjects.map(p => (
                          <Box key={p.id}
                            onClick={() => { navigate(`/projects/${p.id}`); setSearchOpen(false); setSearchQuery(''); }}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5,
                              px: 2, py: 1.1, cursor: 'pointer',
                              '&:hover': { bgcolor: C.bg3 }, transition: 'background 0.15s' }}>
                            <FolderOpenIcon sx={{ fontSize: '0.95rem', color: C.cyan, flexShrink: 0 }} />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: C.white }} noWrap>
                                {p.project_name}
                              </Typography>
                              <Typography sx={{ fontSize: '0.68rem', color: NAV_TEXT }}>
                                {p.project_code} · {p.client_name}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                    {matchedVulns.length > 0 && (
                      <Box>
                        <Divider sx={{ borderColor: `${C.border}66`, my: 0.5 }} />
                        <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700,
                            color: NAV_TEXT, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            Vulnerabilities
                          </Typography>
                        </Box>
                        {matchedVulns.map(v => (
                          <Box key={v.id}
                            onClick={() => { navigate('/master-vulnerabilities'); setSearchOpen(false); setSearchQuery(''); }}
                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5,
                              px: 2, py: 1.1, cursor: 'pointer',
                              '&:hover': { bgcolor: C.bg3 }, transition: 'background 0.15s' }}>
                            <GppGoodIcon sx={{ fontSize: '0.95rem', color: '#f59e0b', flexShrink: 0 }} />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: C.white }} noWrap>
                                {v.title}
                              </Typography>
                              <Typography sx={{ fontSize: '0.68rem', color: NAV_TEXT }}>
                                {v.severity ?? 'N/A'}{v.cwe ? ` · ${v.cwe}` : ''}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                    <Box sx={{ height: 6 }} />
                  </Box>
                )}
              </Paper>
            )}
          </Box>

          {/* Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ color: NAV_TEXT, '&:hover': { color: C.white } }}>
                <NotificationsNoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Chip label={user?.role ?? 'AUDITOR'} size="small" sx={{
              bgcolor: user?.role === 'ADMIN' ? `${C.red}22` : `${C.blue}22`,
              color:   user?.role === 'ADMIN' ? '#ff8080' : '#69b0ff',
              border: `1px solid ${user?.role === 'ADMIN' ? C.red : C.blue}44`,
              fontWeight: 700, fontSize: '0.7rem', height: 22,
            }} />
            <Box onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'pointer',
                p: 0.5, borderRadius: '8px', '&:hover': { bgcolor: NAV_HOVER } }}>
              <Avatar sx={{ bgcolor: C.blue, width: 28, height: 28, fontSize: '0.78rem', fontWeight: 800 }}>
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography sx={{ fontSize: '0.82rem', color: C.white, fontWeight: 600,
                display: { xs: 'none', sm: 'block' } }}>
                {user?.full_name?.split(' ')[0] ?? 'User'}
              </Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: '0.9rem', color: NAV_TEXT }} />
            </Box>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
              <MenuItem disabled>
                <Typography variant="caption" sx={{ color: NAV_TEXT }}>{user?.email}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: C.red, gap: 1 }}>
                <ListItemIcon sx={{ color: C.red, minWidth: 'auto' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar drawers */}
      <Box component="nav" sx={{ width: { sm: effectiveWidth }, flexShrink: { sm: 0 }, transition: 'width 0.25s ease' }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_W, border: 'none' } }}>
          {sidebar}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: DRAWER_W, border: 'none',
              transform: sidebarOpen ? 'translateX(0)' : `translateX(-${DRAWER_W}px)`,
              transition: 'transform 0.25s ease', overflow: 'hidden' } }}
          open>
          {sidebar}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box component="main" sx={{
        flexGrow: 1, minHeight: '100vh', bgcolor: 'transparent',
        pt: '56px',
        width: { sm: `calc(100% - ${effectiveWidth}px)` },
        transition: 'width 0.25s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 1.5, borderTop: `1px solid ${C.border}44`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontSize: '0.72rem', color: NAV_TEXT }}>
            VAPT REPORT GENERATOR
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: NAV_TEXT }}>
            2026 &nbsp;|&nbsp; Secure. Professional. Reliable.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
