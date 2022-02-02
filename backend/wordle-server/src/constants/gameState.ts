const COLUMNS = 6,
  ROWS = 5;
export const state: {
  columns: {
    [key: string]: {
      key: string;
      state: 'present' | 'absent' | 'correct' | '';
    }[];
  };
} = {
  columns: {
    '0': [
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
    ],
    '1': [
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
    ],
    '2': [
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
    ],
    '3': [
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
    ],
    '4': [
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
    ],
    '5': [
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
      { key: '', state: '' },
    ],
  },
};
