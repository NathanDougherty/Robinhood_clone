import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Line } from 'react-chartjs-2';

function Portfolio() {
  const [portfolio, setPortfolio] = useState({
    totalValue: 100000,
    cash: 50000,
    positions: [
      {
        symbol: 'AAPL',
        shares: 10,
        averagePrice: 170.50,
        currentPrice: 175.20,
        value: 1752.00,
        gain: 47.00,
        gainPercent: 2.76,
      },
      {
        symbol: 'GOOGL',
        shares: 5,
        averagePrice: 2800.00,
        currentPrice: 2950.00,
        value: 14750.00,
        gain: 750.00,
        gainPercent: 5.36,
      },
    ],
  });

  const [portfolioHistory] = useState({
    labels: ['1D', '1W', '1M', '3M', '6M', '1Y'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [100000, 102000, 105000, 98000, 110000, 115000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>Portfolio</Typography>
            <Typography variant="h3">${portfolio.totalValue.toLocaleString()}</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Cash Available: ${portfolio.cash.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Portfolio Performance</Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={portfolioHistory}
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
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Positions</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Shares</TableCell>
                    <TableCell align="right">Avg Price</TableCell>
                    <TableCell align="right">Current Price</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Gain/Loss</TableCell>
                    <TableCell align="right">%</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolio.positions.map((position) => (
                    <TableRow key={position.symbol}>
                      <TableCell>{position.symbol}</TableCell>
                      <TableCell align="right">{position.shares}</TableCell>
                      <TableCell align="right">${position.averagePrice.toFixed(2)}</TableCell>
                      <TableCell align="right">${position.currentPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">${position.value.toFixed(2)}</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: position.gain >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        ${position.gain.toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: position.gainPercent >= 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {position.gainPercent.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" color="primary">
                          Trade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Portfolio; 