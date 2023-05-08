interface Participant {
  _id: string;
  name: string;
  estimate?: number;
}

interface Session {
  _id: string;
  name: string;
  finalEstimate?: number;
  participants: Participant[];
}
