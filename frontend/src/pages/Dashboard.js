import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch initial popular stocks
    const fetchPopularStocks = async () => {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
      const stockData = await Promise.all(
        symbols.map(async (symbol) => {
          const response = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
          return response.data;
        })
      );
      setStocks(stockData);
    };

    fetchPopularStocks();
  }, []);

  const handleSearch = async () => {
    if (searchSymbol) {
      try {
        const response = await axios.get(`http://localhost:8000/api/stock/${searchSymbol}`);
        setStocks([response.data, ...stocks]);
        setSearchSymbol('');
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    }
  };

  const handleStockClick = async (stock) => {
    setSelectedStock(stock);
    try {
      const response = await axios.get(`http://localhost:8000/api/stock/${stock.symbol}/history`);
      const history = response.data.history;
      
      setChartData({
        labels: history.map(item => new Date(item.Date).toLocaleTimeString()),
        datasets: [
          {
            label: `${stock.symbol} Price`,
            data: history.map(item => item.Close),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching stock history:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Search Stock Symbol"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ minWidth: '100px' }}
              >
                Search
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            {chartData ? (
              <Line data={chartData} />
            ) : (
              <Typography variant="h6" align="center">
                Select a stock to view chart
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Stocks
            </Typography>
            {stocks.map((stock) => (
              <Paper
                key={stock.symbol}
                sx={{
                  p: 2,
                  mb: 1,
                  cursor: 'pointer',
                  backgroundColor: selectedStock?.symbol === stock.symbol ? 'action.hover' : 'background.paper',
                }}
                onClick={() => handleStockClick(stock)}
              >
                <Typography variant="subtitle1">{stock.symbol}</Typography>
                <Typography variant="h6">${stock.price.toFixed(2)}</Typography>
                <Typography
                  variant="body2"
                  color={stock.change >= 0 ? 'success.main' : 'error.main'}
                >
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </Typography>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 