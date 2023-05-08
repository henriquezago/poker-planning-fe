import axios from "axios";
import { useCallback, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function JoinSession() {
  const [participantName, setParticipantName] = useState('');

  const { session } = useLoaderData() as { session: Session };
  const navigate = useNavigate();

  const joinSession = useCallback(async () => {
    const response = await axios.post('http://localhost:3001/participate-in-session', {
      sessionId: session._id,
      participantName,
    });

    const participant = response.data;
    navigate(`/session/${session._id}/${participant._id}`);
  }, [session, participantName, navigate]);

  return (
    <div className="empty-session">
      <h2>Join session: {session.name}</h2>
      <input type="text" placeholder="Participant name" value={participantName} onChange={e => setParticipantName(e.target.value)} />
      <button onClick={() => joinSession()}>Join</button>
    </div>
  );
}
