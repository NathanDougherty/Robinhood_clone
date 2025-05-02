# Robinhood Clone

A full-stack trading application that replicates core features of Robinhood, built with React and FastAPI.

## Features
- Real-time stock price tracking
- Interactive stock charts
- Portfolio management
- Watchlist functionality
- Responsive design

## Tech Stack
### Frontend
- React
- TypeScript
- Material-UI
- Chart.js
- Axios

### Backend
- FastAPI
- Python
- yfinance
- SQLAlchemy
- WebSockets

## Getting Started

### Prerequisites
- Node.js
- Python 3.9+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NathanDougherty/Robinhood_clone.git
cd Robinhood_clone
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
