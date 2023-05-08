import axios from "axios";
import { useState } from "react";

export default function EmptySession({ onSessionCreated }) {
  const [sessionName, setSessionName] = useState('');
  const [participantName, setParticipantName] = useState('');

  const createSession = () => {
    axios.post('http://localhost:3001/create-session', {
      sessionName: sessionName,
      participantName: participantName,
    }).then((response) => {
      const { _id, name, participants } = response.data;
      onSessionCreated(_id, name, participants);
    });
  }

  return (
    <div className="empty-session">
      <h2>Create new session</h2>
      <input type="text" placeholder="Session name" value={sessionName} onChange={e => setSessionName(e.target.value)} />
      <input type="text" placeholder="Participant name" value={participantName} onChange={e => setParticipantName(e.target.value)} />
      <button onClick={() => createSession()}>Create</button>
    </div>
  );
}