// Environment-based configuration
const getBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return process.env.NODE_ENV === 'production' 
    ? 'https://robinhood-clone-production.up.railway.app'  // This will be our Railway URL
    : 'http://localhost:8000';
};

const getWsBaseUrl = () => {
  if (process.env.REACT_APP_WS_URL) {
    return process.env.REACT_APP_WS_URL;
  }
  return process.env.NODE_ENV === 'production'
    ? 'wss://robinhood-clone-production.up.railway.app'  // This will be our Railway WebSocket URL
    : 'ws://localhost:8000';
};

export const API_BASE_URL = getBaseUrl();
export const WS_BASE_URL = getWsBaseUrl();

// Axios default configuration
export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
}; 