import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import axios from 'axios';

import reportWebVitals from './reportWebVitals';
import reducer, { initialState } from './store/reducer';
import './index.css';
import JoinSession from './components/JoinSession';
import Session from './components/Session';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(reducer, initialState);

async function sessionLoader({ params }) {
  const response = await axios.get('http://localhost:3001/session', {
    params: {
      sessionId: params.sessionId,
    }
  });
  return { session: response.data };
}

async function sessionWithParticipantIdLoader({ params }) {
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
    element: <h1>Don't be a moron</h1>,
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
