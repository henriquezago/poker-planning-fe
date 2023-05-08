export const initialState = {
  participant: null,
  session: null,
  socket: null,
  isLoading: false,
}

export default function reducer(state = {}, action) {
  switch (action.type) {
    case 'SET_PARTICIPANT':
      return {
        ...state,
        participant: action.payload,
      };

    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
      };

    case 'SESSION_JOINED':
      const { _id, name } = action.payload;
      return {
        ...state,
        participantId: _id,
        participantName: name,
      };

    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload,
      };

    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}