import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { io } from "socket.io-client";

function Session() {
  const [myEstimate, setMyEstimate] = useState('');
  const [participants, setParticipants] = useState([]);
  const [socket, setSocket] = useState(null);

  const { session, participantId } = useLoaderData();

  useEffect(() => {
    if (session) {
      setParticipants(session.participants);
    }
  }, [session, setParticipants]);

  useEffect(() => {
    const socket = new io('ws://localhost:7071');
    setSocket(socket);

    function onConnect() {
      console.log('connected');
    }

    function onSessionUpdated(update) {
      setParticipants(update.participants);
    }

    socket.on('connect', onConnect);
    socket.on(`session-updated-${session._id}`, onSessionUpdated);

    return () => {
      socket.off('connect', onConnect);
      socket.off(`session-updated-${session._id}`);
    }
  }, [session, setParticipants, setSocket]);

  const updateEstimate = useCallback(async () => {
    socket.emit('update-estimate', {
      sessionId: session._id,
      participantId,
      estimate: myEstimate,
    });
    setMyEstimate('');
  }, [session, participantId, myEstimate]);

  if (!session || !participantId) {
    return null;
  }

  const participant = participants.find(p => p._id === participantId);
  const otherParticipants = participants.filter(p => p._id !== participantId);

  if (!participant) {
    return <h1>Participant not found.</h1>;
  }

  return (
    <div>
      <h1>{session.name}</h1>
      <p>You are: {participant.name}</p>
      <p>My estimate: {participant.estimate}</p>

      <h2>Participants</h2>
      <ul>
        {otherParticipants.map(p => (
          <li key={p._id}>{p.name} - {p.estimate}</li>
        ))}
      </ul>

      <input type="number" value={myEstimate} onChange={e => setMyEstimate(e.target.value)} />
      <button onClick={updateEstimate}>Update estimate</button>
    </div>
  )
}

export default Session;
