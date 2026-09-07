import { createTheme, alpha } from '@mui/material/styles';

// ── Design tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg0:      '#050d1f',   // deepest background
  bg1:      '#071426',   // panel background
  bg2:      '#0a1e35',   // elevated card
  bg3:      '#0d2440',   // hover / selected
  border:   '#1a3a5c',   // subtle border
  borderGlow: '#00d9ff33',
  blue:     '#1677ff',
  cyan:     '#00d9ff',
  cyanDim:  '#00d9ff22',
  white:    '#e8f4ff',
  muted:    '#6b8cae',
  mutedDim: '#3a5a7a',

  // Severity
  critical: '#ff4444',
  high:     '#ff7a00',
  medium:   '#f5c518',
  low:      '#00d9ff',
  info:     '#7c8aff',

  // Status
  green:  '#00c896',
  amber:  '#f59e0b',
  red:    '#ef4444',
};

export const glow = (color: string, size = 20, opacity = 0.25) =>
  `0 0 ${size}px ${alpha(color, opacity)}`;

export const cardStyle = {
  bgcolor: C.bg1,
  border: `1px solid ${C.border}`,
  borderRadius: 3,
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    borderColor: C.borderGlow,
    boxShadow: glow(C.cyan, 24, 0.12),
  },
};

// ── MUI Theme ─────────────────────────────────────────────────────────────────
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: C.bg0, paper: C.bg1 },
    primary:   { main: C.blue,  light: C.cyan,   dark: '#0d5bd1' },
    secondary: { main: C.cyan,  light: '#5ef5ff', dark: '#00a8cc' },
    error:     { main: C.red },
    warning:   { main: C.amber },
    success:   { main: C.green },
    text: {
      primary:   C.white,
      secondary: C.muted,
      disabled:  C.mutedDim,
    },
    divider: C.border,
  },

  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600, color: C.white },
    subtitle2: { fontWeight: 600, color: C.muted },
    body1:  { color: C.white },
    body2:  { color: C.muted },
    caption: { color: C.mutedDim },
  },

  shape: { borderRadius: 10 },

  components: {
    // ── Paper ──────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: C.bg1,
          border: `1px solid ${C.border}`,
        },
      },
    },

    // ── Button ─────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${C.blue} 0%, #0d5bd1 100%)`,
          boxShadow: glow(C.blue, 16, 0.3),
          '&:hover': {
            background: `linear-gradient(135deg, #2b88ff 0%, ${C.blue} 100%)`,
            boxShadow: glow(C.blue, 24, 0.45),
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${C.cyan} 0%, #0099bb 100%)`,
          color: C.bg0,
          boxShadow: glow(C.cyan, 16, 0.3),
          '&:hover': {
            boxShadow: glow(C.cyan, 24, 0.45),
          },
        },
        outlined: {
          borderColor: C.border,
          color: C.white,
          '&:hover': {
            borderColor: C.cyan,
            color: C.cyan,
            backgroundColor: C.cyanDim,
            boxShadow: glow(C.cyan, 12, 0.15),
          },
        },
        text: {
          color: C.muted,
          '&:hover': { color: C.cyan, backgroundColor: C.cyanDim },
        },
      },
    },

    // ── TextField ──────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: C.bg2,
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: C.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: C.mutedDim,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: C.cyan,
            boxShadow: glow(C.cyan, 8, 0.2),
          },
        },
        input: { color: C.white },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: C.muted,
          '&.Mui-focused': { color: C.cyan },
        },
      },
    },

    // ── Select ─────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: { color: C.muted },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: C.bg2,
          border: `1px solid ${C.border}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), ${glow(C.cyan, 20, 0.06)}`,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: C.white,
          '&:hover': { backgroundColor: C.bg3, color: C.cyan },
          '&.Mui-selected': { backgroundColor: `${C.blue}22` },
        },
      },
    },

    // ── Table ──────────────────────────────────────────────────────────────
    MuiTable: {
      styleOverrides: {
        root: {
          tableLayout: 'auto',
          width: '100%',
          borderCollapse: 'collapse',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: C.bg1,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: C.bg2,
            color: C.muted,
            fontWeight: 700,
            fontSize: '0.73rem',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            borderBottom: `1px solid ${C.border}`,
            padding: '10px 16px',
            whiteSpace: 'nowrap',
            lineHeight: 1.4,
          },
          '& tr th:first-of-type': { borderTopLeftRadius: 12 },
          '& tr th:last-of-type':  { borderTopRightRadius: 12 },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: `${C.bg3} !important` },
          '& .MuiTableCell-body': {
            borderBottom: `1px solid ${C.border}22`,
            color: C.white,
            backgroundColor: 'transparent',
            padding: '12px 16px',
            verticalAlign: 'middle',
          },
          '&:last-of-type .MuiTableCell-body': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: `${C.border}44`,
          backgroundColor: 'transparent',
          padding: '12px 16px',
        },
      },
    },

    // ── Dialog ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: C.bg1,
          backgroundImage: 'none',
          border: `1px solid ${C.border}`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.8), ${glow(C.cyan, 40, 0.08)}`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { color: C.white, fontWeight: 700 },
      },
    },

    // ── Chip ───────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },

    // ── Tabs ───────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${C.border}` },
        indicator: { backgroundColor: C.cyan, height: 2 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: C.muted,
          fontWeight: 600,
          textTransform: 'none',
          '&.Mui-selected': { color: C.cyan },
        },
      },
    },

    // ── Divider ────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: C.border },
      },
    },

    // ── Autocomplete ───────────────────────────────────────────────────────
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: C.bg2,
          border: `1px solid ${C.border}`,
        },
        option: {
          color: C.white,
          '&:hover': { backgroundColor: C.bg3 },
          '&[aria-selected="true"]': { backgroundColor: `${C.blue}22` },
        },
        noOptions: { color: C.muted },
      },
    },

    // ── Alert ──────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
        standardError: { backgroundColor: `${C.red}18`, color: '#ff8080', border: `1px solid ${C.red}44` },
        standardWarning: { backgroundColor: `${C.amber}18`, color: '#fbbf24', border: `1px solid ${C.amber}44` },
        standardSuccess: { backgroundColor: `${C.green}18`, color: '#34d399', border: `1px solid ${C.green}44` },
        standardInfo: { backgroundColor: `${C.cyan}18`, color: C.cyan, border: `1px solid ${C.cyan}44` },
      },
    },

    // ── Switch ─────────────────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        track: { backgroundColor: C.border },
        switchBase: {
          '&.Mui-checked': { color: C.cyan },
          '&.Mui-checked + .MuiSwitch-track': { backgroundColor: `${C.cyan}66` },
        },
      },
    },

    // ── Tooltip ────────────────────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: C.bg2,
          border: `1px solid ${C.border}`,
          color: C.white,
          fontSize: '0.75rem',
        },
      },
    },
  },
});
