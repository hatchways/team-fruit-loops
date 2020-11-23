import React, { useEffect } from 'react';
import Board from "../components/Board";
import { useParams } from 'react-router';

const BoardWrapper = ({ state, setState, socket}) => {
  const { gameID } = useParams();
  // This is responsible for re-rendering if websocket receives update
  // from front end.
  useEffect(() => {
    const updateHandler = next => {
      if (process.env.NODE_ENV === 'development') {
        console.log("update recieved: ", next);
      }
      state.gameState = next;
      setState({player: state.player, gameState: state.gameState});
    }

    socket.on("update", updateHandler);
    return () => {
      socket.off("update", updateHandler);
    }
  }, [setState, socket, state.gameState, state.player]);

  return (
    <Board
      state={state}
      setState={setState}
      gameID={gameID}
      socket={socket}
    />
  );
};

export default BoardWrapper;
