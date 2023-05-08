import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import axios from 'axios';

import reportWebVitals from './reportWebVitals';
import './index.css';
import JoinSession from './components/JoinSession';
import Session from './components/Session';
import EmptySession from 'components/EmptySession';

const root = ReactDOM.createRoot(document.getElementById('root')!);

async function sessionLoader({ params }: any) {
  const response = await axios.get('http://localhost:3001/session', {
    params: {
      sessionId: params.sessionId,
    }
  });
  return { session: response.data };
}

async function sessionWithParticipantIdLoader({ params }: any) {
  const response = await axios.get('http://localhost:3001/session', {
    params: {
      sessionId: params.sessionId,
    }
  });
  return { session: response.data, participantId: params.participantId };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <EmptySession />,
  },
  {
    path: "/join-session/:sessionId",
    element: <JoinSession />,
    loader: sessionLoader,
  },
  {
    path: "/session/:sessionId/:participantId",
    element: <Session />,
    loader: sessionWithParticipantIdLoader,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
