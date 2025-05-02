import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  peRatio: number;
}

interface ChartData {
  Date: string;
  Close: number;
}

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [stockResponse, historyResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/stock/${symbol}`),
          axios.get(`http://localhost:8000/api/stock/${symbol}/history`)
        ]);

        setStockData(stockResponse.data);
        
        const history: ChartData[] = historyResponse.data.history;
        setChartData({
          labels: history.map(item => new Date(item.Date).toLocaleTimeString()),
          datasets: [
            {
              label: `${symbol} Price`,
              data: history.map(item => item.Close),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    if (symbol) {
      fetchStockData();
    }
  }, [symbol]);

  if (!stockData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">{stockData.name}</Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>
              ${stockData.price.toFixed(2)}
            </Typography>
            <Typography
              variant="h6"
              color={stockData.change >= 0 ? 'success.main' : 'error.main'}
            >
              {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}%
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1">
                Market Cap: ${(stockData.marketCap / 1000000000).toFixed(2)}B
              </Typography>
              <Typography variant="body1">
                P/E Ratio: {stockData.peRatio.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Volume: {stockData.volume.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Price History</Typography>
        {chartData && (
          <Box sx={{ height: 400 }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StockDetail; 