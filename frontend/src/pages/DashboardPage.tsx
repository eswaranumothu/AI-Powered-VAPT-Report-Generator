import React from 'react';
import {
  Box, Typography, Button, Chip, ButtonBase, Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArticleIcon from '@mui/icons-material/Article';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PeopleIcon from '@mui/icons-material/People';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BugReportIcon from '@mui/icons-material/BugReport';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, getProjectStatusLabel } from '../api/projects';
import { masterVulnerabilitiesApi } from '../api/masterVulnerabilities';
import { usersApi } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { C, glow } from '../theme';

const panelSx = {
  bgcolor: C.bg1,
  border: `1px solid ${C.border}`,
  borderRadius: '12px',
  p: 2.5,
  transition: 'border-color 0.2s, box-shadow 0.2s',
  '&:hover': { borderColor: `${C.cyan}33`, boxShadow: glow(C.cyan, 20, 0.07) },
};

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  DRAFT:       { bg: `${C.muted}18`, color: C.muted,   border: `${C.muted}44` },
  STAGE1:      { bg: `${C.green}18`, color: C.green,   border: `${C.green}44` },
};

const SEV_META = [
  { label: 'Total Templates', sub: 'All catalog entries',       color: C.blue,     sev: null },
  { label: 'Critical Issues', sub: 'Needs immediate attention', color: C.critical, sev: 'Critical' },
  { label: 'High Severity',   sub: 'Important to address',      color: C.high,     sev: 'High' },
  { label: 'Medium Severity', sub: 'Review recommended',        color: C.medium,   sev: 'Medium' },
  { label: 'Low Severity',    sub: 'Info / Best practices',     color: C.low,      sev: 'Low' },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const { data: projects = [] }    = useQuery({ queryKey: ['projects'],              queryFn: projectsApi.list });
  const { data: masterVulns = [] } = useQuery({ queryKey: ['masterVulnerabilities'], queryFn: masterVulnerabilitiesApi.list });
  const { data: users = [] }       = useQuery({ queryKey: ['users'],                 queryFn: usersApi.list, enabled: isAdmin });

  const myProjects        = projects.filter((p) => p.created_by === user?.id || p.assigned_to === user?.id);
  const generatedReports = projects.filter((p) => p.report_generated_at).length;
  const draftProjects     = projects.filter((p) => p.status === 'DRAFT');

  const kpis = isAdmin
    ? [
        { label: 'Total Projects',         value: projects.length,          icon: <FolderOpenIcon />, color: C.blue,   path: '/projects' },
        { label: 'Reports Generated',      value: generatedReports,        icon: <ArticleIcon />,   color: C.cyan,   path: '/projects' },
        { label: 'Draft Projects',         value: draftProjects.length,     icon: <GppGoodIcon />,   color: C.green,  path: '/projects' },
        { label: 'Total Users',            value: users.length,             icon: <PeopleIcon />,    color: C.medium, path: '/users' },
      ]
    : [
        { label: 'My Projects',            value: myProjects.length,        icon: <FolderOpenIcon />, color: C.blue,   path: '/my-projects' },
        { label: 'Reports Generated',      value: generatedReports,        icon: <ArticleIcon />,   color: C.cyan,   path: '/projects' },
        { label: 'Draft Projects',         value: draftProjects.length,     icon: <GppGoodIcon />,   color: C.green,  path: '/projects' },
        { label: 'Vuln Templates',         value: masterVulns.length,       icon: <SecurityIcon />,  color: C.medium, path: '/master-vulnerabilities' },
      ];

  const sevCounts = SEV_META.map(({ sev }) =>
    sev ? masterVulns.filter((v) => v.severity === sev).length : masterVulns.length,
  );

  const recent = [...projects]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  // Quick actions — role-aware, no Import Project, no Manage Users for auditors
  const quickActions = [
    {
      Icon: NoteAddIcon,
      label: 'New Project',
      sub: 'Start a new VAPT assessment',
      to: '/my-projects?new=true',
      color: C.blue,
    },
    {
      Icon: SummarizeIcon,
      label: 'Generate Report',
      sub: 'Create a professional PDF report',
      to: '/projects',
      color: C.cyan,
    },
    {
      Icon: SecurityIcon,
      label: 'Vulnerability Catalog',
      sub: 'Browse master vulnerability templates',
      to: '/master-vulnerabilities',
      color: C.green,
    },
    ...(isAdmin ? [{
      Icon: ManageAccountsIcon,
      label: 'Manage Users',
      sub: 'Add or manage team members',
      to: '/users',
      color: C.medium,
    }] : [{
      Icon: AssessmentIcon,
      label: 'My Projects',
      sub: 'View your assigned assessments',
      to: '/my-projects',
      color: C.medium,
    }]),
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'relative', overflow: 'hidden',
        borderRadius: '12px',
        border: `1px solid ${C.border}`,
        backgroundImage: 'url(/banner_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: { xs: '28px 24px', md: '32px 40px' },
        minHeight: { xs: 180, md: 160 },
      }}>
        {/* Soft dark overlay on the left so text stays readable over the image */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(5,13,31,0.72) 0%, rgba(5,13,31,0.35) 55%, transparent 100%)',
        }} />

        {/* 3D document illustration — glowing icon stack */}
        <Box sx={{
          position: 'absolute',
          right: { md: 36, lg: 56 }, top: '50%', transform: 'translateY(-50%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          width: 130, height: 130,
          pointerEvents: 'none',
        }}>
          {/* Glowing platform ring */}
          <Box sx={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 22, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,217,255,0.25) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }} />
          {/* Stacked document pages */}
          {[{ offset: 12, opacity: 0.25 }, { offset: 6, opacity: 0.45 }, { offset: 0, opacity: 1 }].map((layer, i) => (
            <Box key={i} sx={{
              position: 'absolute',
              bottom: layer.offset,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 68 - i * 4,
              height: 84 - i * 4,
              borderRadius: '6px',
              bgcolor: `rgba(22,119,255,${layer.opacity * 0.18})`,
              border: `1px solid rgba(0,217,255,${layer.opacity * 0.5})`,
              boxShadow: `0 0 ${12 + i * 6}px rgba(0,217,255,${layer.opacity * 0.3})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {i === 2 && (
                /* Shield checkmark on front page */
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  bgcolor: 'rgba(22,119,255,0.4)',
                  border: '1.5px solid rgba(0,217,255,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(0,217,255,0.6)',
                  fontSize: '0.9rem',
                }}>
                  ✓
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Left text content */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '100%', md: 520 } }}>
          <Typography sx={{ fontSize: '0.82rem', color: C.muted, mb: 0.5, fontWeight: 400 }}>
            Welcome, {user?.full_name?.trim() || user?.email || 'User'}
          </Typography>
          <Typography sx={{
            color: '#fff', fontWeight: 900, mb: 1.25, lineHeight: 1.1,
            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' },
          }}>
            VAPT Report Generator
          </Typography>
          <Typography sx={{
            color: C.muted, fontSize: '0.875rem', mb: 2.75,
            lineHeight: 1.65, maxWidth: 420,
          }}>
            Create, manage and generate professional vulnerability assessment
            reports with ease powered by your security knowledge.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/my-projects?new=true')}
              sx={{
                fontWeight: 700, px: 2.5, py: 0.9,
                background: `linear-gradient(135deg, ${C.blue} 0%, #0d5bd1 100%)`,
                boxShadow: glow(C.blue, 14, 0.4),
                '&:hover': { boxShadow: glow(C.blue, 22, 0.55) },
              }}>
              Create New Report
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/projects')}
              sx={{
                px: 2.5, py: 0.9,
                borderColor: `${C.border}`,
                color: C.muted,
                '&:hover': { borderColor: C.cyan, color: C.cyan, bgcolor: C.cyanDim },
              }}>
              All Projects
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }, gap: 1.5 }}>
        {kpis.map((kpi) => (
          <ButtonBase key={kpi.label} onClick={() => navigate(kpi.path)}
            sx={{ borderRadius: '10px', display: 'block', textAlign: 'left', width: '100%' }}>
            <Box sx={{
              bgcolor: C.bg1, border: `1px solid ${C.border}`, borderRadius: '10px',
              p: '14px 16px',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              '&:hover': { borderColor: `${kpi.color}55`, boxShadow: glow(kpi.color, 14, 0.16) },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ p: 0.7, borderRadius: '7px', bgcolor: `${kpi.color}18`, color: kpi.color,
                  display: 'inline-flex', '& svg': { fontSize: '1rem' } }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Typography sx={{ fontWeight: 800, lineHeight: 1, fontSize: '1.5rem', color: '#fff' }}>
                {kpi.value}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: C.muted, mt: 0.35 }}>{kpi.label}</Typography>
            </Box>
          </ButtonBase>
        ))}
      </Box>

      {/* ── Recent Projects — full width ────────────────────────────────── */}
      <Box sx={{ bgcolor: C.bg1, border: `1px solid ${C.border}`, borderRadius: '12px', p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderOpenIcon sx={{ color: C.cyan, fontSize: '1.05rem' }} />
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Recent Projects</Typography>
          </Box>
          <Button size="small" endIcon={<ArrowForwardIcon sx={{ fontSize: '0.75rem !important' }} />}
            onClick={() => navigate('/projects')}
            sx={{ color: C.cyan, fontSize: '0.75rem', p: 0, minWidth: 0,
              '&:hover': { bgcolor: 'transparent', opacity: 0.75 } }}>
            View All
          </Button>
        </Box>

        {recent.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <FolderOpenIcon sx={{ fontSize: 36, color: C.mutedDim, mb: 1 }} />
            <Typography sx={{ color: C.muted, fontSize: '0.82rem', mb: 1.5 }}>No projects yet</Typography>
            <Button variant="contained" size="small" onClick={() => navigate('/projects')}
              sx={{ bgcolor: C.blue, fontSize: '0.78rem' }}>Create Project</Button>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Project Name', 'Code', 'Client', 'Created On', 'Status'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '3px 12px 8px',
                      fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.6px',
                      color: C.muted, textTransform: 'uppercase',
                      borderBottom: `1px solid ${C.border}55`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => {
                  const st = STATUS_STYLE[p.status] ?? STATUS_STYLE.DRAFT;
                  return (
                    <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
                      style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.bg3)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}22` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FolderOpenIcon sx={{ fontSize: '0.85rem', color: C.cyan, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                            {p.project_name}
                          </Typography>
                        </Box>
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '0.77rem', color: '#69b0ff',
                        fontWeight: 700, borderBottom: `1px solid ${C.border}22`, whiteSpace: 'nowrap' }}>
                        {p.project_code}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '0.77rem', color: C.muted,
                        borderBottom: `1px solid ${C.border}22` }}>
                        {p.client_name}
                      </td>
                      <td style={{ padding: '8px 12px', fontSize: '0.77rem', color: C.muted,
                        borderBottom: `1px solid ${C.border}22`, whiteSpace: 'nowrap' }}>
                        {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}22` }}>
                        <Chip label={getProjectStatusLabel(p.status)} size="small" sx={{
                          bgcolor: st.bg, color: st.color, border: `1px solid ${st.border}`,
                          fontWeight: 600, fontSize: '0.67rem', height: 20,
                        }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        )}
      </Box>

      {/* ── Quick Actions + CVE Insights — equal height ─────────────────── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2,
        alignItems: 'stretch',
      }}>

        {/* Quick Actions */}
        <Box sx={{ bgcolor: C.bg1, border: `1px solid ${C.border}`, borderRadius: '12px', p: 2.5,
          display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BoltIcon sx={{ color: C.cyan, fontSize: '1.05rem' }} />
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>Quick Actions</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, flex: 1 }}>
            {quickActions.map(({ Icon, label, sub, to, color }) => (
              <Box key={label} onClick={() => navigate(to)}
                sx={{
                  p: 2, borderRadius: '10px', cursor: 'pointer',
                  bgcolor: C.bg2, border: `1px solid ${C.border}`,
                  display: 'flex', flexDirection: 'column',
                  transition: 'all 0.18s',
                  '&:hover': {
                    borderColor: `${color}44`, bgcolor: C.bg3,
                    boxShadow: glow(color, 12, 0.1),
                    '& .qa-arrow': { opacity: 1, transform: 'translateX(3px)' },
                  },
                }}>
                <Box sx={{ color, mb: 1, display: 'flex' }}>
                  <Icon sx={{ fontSize: '1.4rem' }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.81rem', color: '#fff', mb: 0.3 }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: '0.69rem', color: C.muted, lineHeight: 1.4, flex: 1 }}>
                  {sub}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowForwardIcon className="qa-arrow"
                    sx={{ fontSize: '0.78rem', color, opacity: 0, transition: 'all 0.18s' }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CVE Insights */}
        <Box sx={{ bgcolor: C.bg1, border: `1px solid ${C.border}`, borderRadius: '12px', p: 2.5,
          display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BugReportIcon sx={{ color: C.cyan, fontSize: '1.05rem' }} />
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>
              Security · CVE Insights
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
            {SEV_META.map((s, i) => (
              <Box key={s.label} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                p: '10px 14px', borderRadius: '8px',
                bgcolor: C.bg2, border: `1px solid ${C.border}`,
                flex: 1,
                transition: 'border-color 0.18s',
                '&:hover': { borderColor: `${s.color}44` },
              }}>
                <Box sx={{ flex: 1, minWidth: 0, mr: 1.5 }}>
                  <Typography sx={{ fontSize: '0.81rem', fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>
                    {s.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: C.muted }}>{s.sub}</Typography>
                </Box>
                <Avatar sx={{
                  width: 26, height: 26, fontSize: '0.72rem', fontWeight: 800,
                  bgcolor: `${s.color}22`, color: s.color, flexShrink: 0,
                }}>
                  {sevCounts[i]}
                </Avatar>
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};
