interface ServerToClientEvents {
  [key: `session-updated-${string}`]: (Session) => void;
}

interface ClientToServerEvents {
  "update-estimate": ({
    sessionId: string,
    participantId: string,
    estimate: number,
  }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
