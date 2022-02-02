export type possibleTileState = "present" | "absent" | "correct" | "";
export type gameStateType = {
  columns: {
    [columnNum: string]: {
      key: string;
      state: possibleTileState;
    }[];
  };
};
