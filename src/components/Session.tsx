import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { io, Socket } from "socket.io-client";

type loaderData = {
  session: Session;
  participantId: string;
}

function copyLink(link: string) {
  navigator.clipboard.writeText(link);
}

function Session() {
  const [myEstimate, setMyEstimate] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const { session, participantId } = useLoaderData() as loaderData;

  useEffect(() => {
    if (session) {
      setParticipants(session.participants);
    }
  }, [session, setParticipants]);

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('ws://localhost:7071');
    setSocket(socket);

    function onConnect() {
      console.log('connected');
    }

    function onSessionUpdated(update: Session) {
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
    socket?.emit('update-estimate', {
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
  const shareLink = `${window.location.origin}/join-session/${session._id}`

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
      <button onClick={() => copyLink(shareLink)}>Copy share link</button>
    </div>
  )
}

export default Session;
