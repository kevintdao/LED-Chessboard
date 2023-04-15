import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GameProvider from './contexts/GameContext';
import './index.css';
import Home from './pages/Home';
import Room from './pages/Room';
import Root from './pages/Root';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCupgmt57tzvco2d-yMpPIrmTzee20fC6o',
  authDomain: 'iot-project-led-chessboard.firebaseapp.com',
  databaseURL: 'https://iot-project-led-chessboard-default-rtdb.firebaseio.com',
  projectId: 'iot-project-led-chessboard',
  storageBucket: 'iot-project-led-chessboard.appspot.com',
  messagingSenderId: '605922107744',
  appId: '1:605922107744:web:fbae38a1c93fc233c0fe05',
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
getAuth(app);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <Room />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <GameProvider>
    <RouterProvider router={router} />
  </GameProvider>
  // </React.StrictMode>
);
