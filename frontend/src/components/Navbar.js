import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function Navbar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
          }}
        >
          Robinhood Clone
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            startIcon={<TrendingUpIcon />}
            color="inherit"
          >
            Dashboard
          </Button>
          <Button
            component={RouterLink}
            to="/watchlist"
            startIcon={<WatchLaterIcon />}
            color="inherit"
          >
            Watchlist
          </Button>
          <Button
            component={RouterLink}
            to="/portfolio"
            startIcon={<AccountBalanceWalletIcon />}
            color="inherit"
          >
            Portfolio
          </Button>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 