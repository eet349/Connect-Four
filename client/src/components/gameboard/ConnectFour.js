import React from 'react';
import GameBoard from './GameBoard';
import PlayerNameplates from './PlayerNameplates';

const ConnectFour = () => {
  let styles = {
    width: '100%'
  }
  return (
    <div>
      <div className="ui container center" styles={styles}>
      <PlayerNameplates />
      <GameBoard />
      </div>
    </div>
  );
}

export default ConnectFour;