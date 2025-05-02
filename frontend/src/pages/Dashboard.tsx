import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  ButtonGroup,
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
  TimeScale,
  TimeSeriesScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import { API_BASE_URL, API_CONFIG } from '../config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
);

interface StockData {
  symbol: string;
  price: number;
  change: number;
  name: string;
  volume: number;
}

interface StockHistoryData {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

interface TimeRange {
  label: string;
  period: string;
  interval: string;
}

const timeRanges: TimeRange[] = [
  { label: '1D', period: '1d', interval: '5m' },
  { label: '5D', period: '5d', interval: '15m' },
  { label: '1M', period: '1mo', interval: '1h' },
  { label: '6M', period: '6mo', interval: '1d' },
  { label: '1Y', period: '1y', interval: '1d' },
  { label: '5Y', period: '5y', interval: '1wk' },
  { label: 'MAX', period: 'max', interval: '1mo' },
];

type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRanges[0]);

  const fetchStockHistory = async (symbol: string, range: TimeRange = selectedRange) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/stock/${symbol}/history?period=${range.period}&interval=${range.interval}`,
        API_CONFIG
      );
      const history = response.data.history;

      // Parse dates and ensure they're valid, then sort by date
      const validData = history
        .filter((item: StockHistoryData) => {
          const date = new Date(item.Date);
          return !isNaN(date.getTime());
        })
        .sort((a: StockHistoryData, b: StockHistoryData) => {
          return new Date(a.Date).getTime() - new Date(b.Date).getTime();
        });

      const data = {
        labels: validData.map((item: StockHistoryData) => new Date(item.Date)),
        datasets: [
          {
            label: `${symbol} Price`,
            data: validData.map((item: StockHistoryData) => ({
              x: new Date(item.Date),
              y: item.Close
            })),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0,
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `${symbol} Stock Price (${range.label})`,
          },
          tooltip: {
            callbacks: {
              title: (context: any) => {
                const date = new Date(context[0].raw.x);
                return date.toLocaleString();
              },
              label: (context: any) => {
                return `$${context.raw.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time' as const,
            time: {
              unit: getTimeUnit(range.period),
              displayFormats: {
                millisecond: 'HH:mm:ss.SSS',
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'MM/dd HH:mm',
                day: 'MM/dd/yyyy',
                week: 'MM/dd/yyyy',
                month: 'MM/yyyy',
                quarter: 'MM/yyyy',
                year: 'yyyy',
              },
            },
            title: {
              display: true,
              text: 'Date',
            },
            grid: {
              display: true,
              drawBorder: true,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 10,
              callback: function(value: any) {
                const date = new Date(value);
                const format = getDateDisplayFormat(selectedRange.period);
                return formatDate(date, format);
              }
            },
            reverse: false // Ensure older dates are on the left
          },
          y: {
            title: {
              display: true,
              text: 'Price ($)',
            },
            grid: {
              display: true,
              drawBorder: true,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index' as const,
        },
      };

      setChartData({ data, options });
    } catch (error) {
      console.error('Error fetching stock history:', error);
      setError('Failed to fetch stock history data');
    }
  };

  const formatDate = (date: Date, format: string): string => {
    const pad = (n: number) => n < 10 ? `0${n}` : `${n}`;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    switch (format) {
      case 'time':
        return `${pad(hour12)}:${pad(minutes)} ${ampm}`;
      case 'datetime':
        return `${months[date.getMonth()]} ${date.getDate()}, ${pad(hour12)}:${pad(minutes)} ${ampm}`;
      case 'date':
        return `${months[date.getMonth()]} ${date.getDate()}`;
      case 'month':
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      default:
        return date.toLocaleDateString();
    }
  };

  const getDateDisplayFormat = (period: string): string => {
    switch (period) {
      case '1d':
        return 'time';
      case '5d':
      case '1mo':
        return 'datetime';
      case '6mo':
      case '1y':
        return 'date';
      case '5y':
      case 'max':
        return 'month';
      default:
        return 'date';
    }
  };

  const getTimeUnit = (period: string): TimeUnit => {
    switch (period) {
      case '1d':
        return 'hour';
      case '5d':
        return 'day';
      case '1mo':
        return 'day';
      case '6mo':
        return 'month';
      case '1y':
        return 'month';
      case '5y':
        return 'year';
      case 'max':
        return 'year';
      default:
        return 'day';
    }
  };

  useEffect(() => {
    const fetchPopularStocks = async () => {
      setLoading(true);
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
      try {
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await axios.get(`${API_BASE_URL}/api/stock/${symbol}`, API_CONFIG);
            return response.data;
          })
        );
        setStocks(stockData);
        if (!selectedStock && stockData.length > 0) {
          setSelectedStock(stockData[0].symbol);
          await fetchStockHistory(stockData[0].symbol);
        }
        setError(null);
      } catch (error: any) {
        console.error('Error fetching stocks:', error);
        if (error.response) {
          setError(`Error: ${error.response.data.detail || 'Failed to fetch stock data'}`);
        } else if (error.request) {
          setError('Network error: Unable to connect to the server.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPopularStocks();
    const interval = setInterval(fetchPopularStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchStockHistory(selectedStock, selectedRange);
    }
  }, [selectedStock, selectedRange]);

  const handleSearch = async () => {
    if (searchSymbol) {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stock/${searchSymbol}`, API_CONFIG);
        const newStock = response.data;
        setStocks(prevStocks => {
          const existingIndex = prevStocks.findIndex(s => s.symbol === newStock.symbol);
          if (existingIndex >= 0) {
            const updatedStocks = [...prevStocks];
            updatedStocks[existingIndex] = newStock;
            return updatedStocks;
          }
          return [newStock, ...prevStocks];
        });
        setSelectedStock(newStock.symbol);
        setSearchSymbol('');
        setError(null);
      } catch (error: any) {
        console.error('Error fetching stock:', error);
        if (error.response) {
          setError(`Error: ${error.response.data.detail || 'Failed to fetch stock data'}`);
        } else if (error.request) {
          setError('Network error: Unable to connect to the server.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
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
                disabled={loading}
                sx={{ minWidth: '100px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Paper>
        </Grid>

        {selectedStock && chartData && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <ButtonGroup variant="outlined" size="small">
                  {timeRanges.map((range) => (
                    <Button
                      key={range.label}
                      onClick={() => setSelectedRange(range)}
                      variant={selectedRange.label === range.label ? 'contained' : 'outlined'}
                    >
                      {range.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
              <Box sx={{ height: '400px' }}>
                <Line data={chartData.data} options={chartData.options} />
              </Box>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Stocks
            </Typography>
            <Grid container spacing={2}>
              {stocks.map((stock) => (
                <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer',
                      bgcolor: selectedStock === stock.symbol ? 'action.selected' : 'background.paper',
                    }}
                    onClick={() => setSelectedStock(stock.symbol)}
                  >
                    <Typography variant="h6">{stock.symbol}</Typography>
                    <Typography variant="subtitle1">{stock.name}</Typography>
                    <Typography variant="h4">${stock.price.toFixed(2)}</Typography>
                    <Typography
                      variant="body1"
                      color={stock.change >= 0 ? 'success.main' : 'error.main'}
                    >
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2">
                      Volume: {stock.volume.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 