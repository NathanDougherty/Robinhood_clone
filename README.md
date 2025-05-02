# Robinhood Clone

A full-stack trading application built with React and FastAPI.

## Live Demo

- Frontend: [https://robinhood-clone-react.vercel.app](https://robinhood-clone-react.vercel.app)
- Backend API: [https://robinhood-clone-production.up.railway.app](https://robinhood-clone-production.up.railway.app)

## Features

- Real-time stock price tracking
- Interactive stock charts with multiple timeframes
- Portfolio management
- Watchlist functionality
- Search for stocks
- Responsive design

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Chart.js
  - Axios

- Backend:
  - FastAPI
  - Python
  - yfinance
  - SQLAlchemy
  - WebSockets

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/robinhood-clone.git
cd robinhood-clone
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host localhost --port 8000
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

## Deployment

### Frontend (Vercel)

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the frontend directory
4. Set environment variables in Vercel:
   - REACT_APP_API_URL=https://your-railway-app-url
   - REACT_APP_WS_URL=wss://your-railway-app-url

### Backend (Railway)

1. Create a Railway account at https://railway.app
2. Install Railway CLI: `npm i -g @railway/cli`
3. Run `railway login`
4. Run `railway init` in the backend directory
5. Deploy: `railway up`

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-railway-app-url
REACT_APP_WS_URL=wss://your-railway-app-url
```

### Backend (.env)
```
DATABASE_URL=your-database-url
PORT=8000
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License. 