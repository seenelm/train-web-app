# Train Web App

A modern, secure authentication web application built with React, TypeScript, and Firebase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6.svg)
![Firebase](https://img.shields.io/badge/Firebase-11.6.0-FFCA28.svg)

## Features

- **Secure Authentication**: Sign in with email/password or Google OAuth
- **Modern UI**: Clean, responsive interface with a minimalist design
- **TypeScript**: Full type safety throughout the application
- **Firebase Integration**: Robust backend authentication services
- **Vite Build System**: Fast development and optimized production builds

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Authentication**: Firebase Authentication
- **Build Tool**: Vite 6
- **Linting**: ESLint 9

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/train-web-app.git
   cd train-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=your_backend_api_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## Project Structure

```
train-web-app/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   ├── firebase/       # Firebase configuration
│   ├── services/       # Service modules (auth, API, etc.)
│   ├── styles/         # CSS and style files
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Deployment

Build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service like Firebase Hosting, Vercel, Netlify, or GitHub Pages.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
