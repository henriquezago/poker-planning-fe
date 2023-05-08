import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function JoinSession({ setSession, sessionJoined }) {
  const [participantName, setParticipantName] = useState('');
  const { session } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      setSession(session);
    }
  }, [session, setSession]);

  const joinSession = useCallback(async (socket) => {
    const response = await axios.post('http://localhost:3001/participate-in-session', {
      sessionId: session._id,
      participantName,
    });

    const participant = response.data;
    sessionJoined(participant);
    navigate(`/session/${session._id}/${participant._id}`);
  }, [session, participantName, navigate]);

  return (
    <div className="empty-session">
      <h2>Join session: {session.name}</h2>
      <input type="text" placeholder="Participant name" value={participantName} onChange={e => setParticipantName(e.target.value)} />
      <button onClick={() => joinSession()}>Create</button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    sessionName: state.sessionName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sessionJoined: (participant) => dispatch({ type: 'SET_PARTICIPANT', payload: participant }),
    setSession: (session) => dispatch({ type: 'SET_SESSION', payload: session }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinSession);
