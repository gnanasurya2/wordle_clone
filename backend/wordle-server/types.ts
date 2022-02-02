export type possibleTileState = 'present' | 'absent' | 'correct' | '';
export type gameStateType = {
  columns: {
    [key: string]: {
      key: string;
      state: possibleTileState;
    }[];
  };
};

export type userStateType = {
  todayDate: string;
  gameState: {
    columns: {
      [key: string]: {
        key: string;
        state: possibleTileState;
      };
    }[];
  };
  currentRow: number;
  isComplete: boolean;
  id: string;
};
