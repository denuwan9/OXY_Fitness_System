# OXY FITNESS - Frontend

This is the frontend application for the OXY FITNESS system, built with React and Vite.

## Features

- Modern and responsive UI design
- User authentication (Login/Register)
- Profile management
- Program browsing and enrollment
- Coach profiles and scheduling
- Membership management
- Contact information
- Online shop

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd frontend/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
frontend/client/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       ├── Layout.css
│   │       ├── Header.jsx
│   │       ├── Header.css
│   │       ├── Footer.jsx
│   │       └── Footer.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   └── Register.css
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── images/
├── .env
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
