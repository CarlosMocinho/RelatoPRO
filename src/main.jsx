import { createRoot } from 'react-dom/client';
import './index.css';
import React from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/LandingPage/Home.jsx';
import Error from './pages/Error/Error.jsx';
import Login from './pages/Login/Login.jsx';
import Registro from './pages/Registro/Registro.jsx';
import Relatorios from './pages/Relatorios/Relatorios.jsx';
import New from './pages/New/New.jsx';
import Conta from './pages/Conta/Conta.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registro",
    element: <Registro />,
  },
  {
    path: "/relatorios",
    element: <Relatorios />,
  },
  {
    path: "/novo-relatorio",
    element: <New />,
  },
  {
    path: "*",
    element: <Error />,
  },
  {
    path: "/conta",
    element: <Conta/>,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
