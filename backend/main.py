from fastapi import FastAPI, WebSocket, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
import yfinance as yf
import pandas as pd
import json
from datetime import datetime, timedelta
import asyncio
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Robinhood Clone API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting variables
last_request_time = {}
MIN_REQUEST_INTERVAL = 2  # Minimum seconds between requests for the same symbol

# WebSocket connections
active_connections: List[WebSocket] = []

def get_stock_info(symbol: str):
    try:
        logger.info(f"Fetching data for symbol: {symbol}")
        stock = yf.Ticker(symbol)
        info = stock.info
        if not info:
            logger.error(f"No data returned for symbol: {symbol}")
            raise HTTPException(status_code=404, detail=f"No data found for symbol: {symbol}")
        logger.info(f"Successfully fetched data for {symbol}")
        return info
    except Exception as e:
        logger.error(f"Error fetching stock data for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching stock data: {str(e)}")

@app.websocket("/ws/stock/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            try:
                info = get_stock_info(symbol)
                data = {
                    "symbol": symbol,
                    "price": info.get('regularMarketPrice', 0),
                    "change": info.get('regularMarketChangePercent', 0),
                    "volume": info.get('regularMarketVolume', 0),
                    "timestamp": datetime.now().isoformat()
                }
                await websocket.send_json(data)
                await asyncio.sleep(2)  # Update every 2 seconds
            except Exception as e:
                await websocket.send_json({"error": str(e)})
                await asyncio.sleep(5)  # Wait longer if there's an error
    finally:
        active_connections.remove(websocket)

@app.get("/api/stock/{symbol}")
async def get_stock_data(symbol: str):
    try:
        info = get_stock_info(symbol)
        return {
            "symbol": symbol,
            "price": info.get('regularMarketPrice', 0),
            "change": info.get('regularMarketChangePercent', 0),
            "volume": info.get('regularMarketVolume', 0),
            "name": info.get('longName', ''),
            "marketCap": info.get('marketCap', 0),
            "peRatio": info.get('trailingPE', 0),
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException as e:
        logger.error(f"HTTP Exception for {symbol}: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stock/{symbol}/history")
async def get_stock_history(symbol: str, period: str = "1d", interval: str = "1m"):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period, interval=interval)
        return {
            "symbol": symbol,
            "history": hist.to_dict('records')
        }
    except Exception as e:
        logger.error(f"Error fetching history for {symbol}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000) 