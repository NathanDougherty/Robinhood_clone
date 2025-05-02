import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      price: 185.70,
      change: 2.5,
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: 875.30,
      change: 1.8,
    },
    {
      symbol: 'META',
      name: 'Meta Platforms, Inc.',
      price: 505.50,
      change: -0.5,
    },
  ]);

  const [newSymbol, setNewSymbol] = useState('');

  const handleAddSymbol = () => {
    if (newSymbol && !watchlist.find(item => item.symbol === newSymbol.toUpperCase())) {
      // In a real app, you would fetch the stock data from the API
      setWatchlist([
        ...watchlist,
        {
          symbol: newSymbol.toUpperCase(),
          name: 'Loading...',
          price: 0,
          change: 0,
        },
      ]);
      setNewSymbol('');
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>Watchlist</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <TextField
                  fullWidth
                  label="Add Stock Symbol"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL"
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddSymbol}
                  disabled={!newSymbol}
                >
                  Add to Watchlist
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <List>
              {watchlist.map((stock) => (
                <ListItem
                  key={stock.symbol}
                  divider
                  button
                  component="a"
                  href={`/stock/${stock.symbol}`}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {stock.symbol} - {stock.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body1"
                        color={stock.change >= 0 ? 'success.main' : 'error.main'}
                      >
                        ${stock.price.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.change}%)
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveSymbol(stock.symbol);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Watchlist; 