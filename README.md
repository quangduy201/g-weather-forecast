# G Weather Forecast Web Application

## Features

- Search Weather: Users can search for a city's current weather and view up to 2-week forecast.
- Weather History: The application stores recent weather searches locally for later revisit.
- Subscription: Users can subscribe to daily weather updates via email.

## Technologies Used

- Frontend: ReactJS, SCSS
- Backend: Spring Boot, PostgreSQL, Redis (caching)
- Deployment: Docker, Render (backend), Vercel (database)

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm (v8.x or later)
- Docker

### Running the project locally

Follow these steps to set up and run the project on your local machine.

1. Clone the repository
   ```shell
   git clone https://github.com/quangduy201/g-weather-forecast.git
   cd g-weather-forecast
   ```

2. Configure environment variables
   - There are 2 .env-example files in both frontend and backend.
   - Create .env files for both frontend and backend based on the .env-example accordingly.
   - Make sure to replace the placeholder values with your actual credentials.
     - PostgreSQL: Create a PostgreSQL database locally on your machine or remotely on the clouds (e.g., Vercel)
     - SMTP: Use any SMTP service provider to send emails (e.g., Gmail SMTP, Mailtrap).
     - Redis: Set up Redis via Docker or use a remote Redis instance.

3. Set up the backend (Spring Boot)
   - Navigate to backend directory
      ```shell
      cd g-weather-forecast-backend
      ```

   - Build and run the services with Docker Compose
      ```shell
      docker-compose up --build
      ```

   - Access the services
      ```
      http://localhost:8080
      ```

4. Set up the frontend (React)
   - Navigate to the frontend directory
      ```shell
      cd g-weather-forecast-frontend
      ```

   - Install dependencies
      ```shell
      npm install
      ```
      
   - Start the development server
      ```shell
      npm run dev
      ```

   - Access the application
      ```
      http://localhost:5173
      ```
   