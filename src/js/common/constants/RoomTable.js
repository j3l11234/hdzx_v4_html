const STATUS = {
    FREE: 1,
    ORDERED: 2,
    USED: 3,
    LOCKED: 4,
    CHOOOSED: 5
};

let statusClass = {};
statusClass[STATUS.FREE] = 'z-rt-free';
statusClass[STATUS.ORDERED] = 'z-rt-ordered';
statusClass[STATUS.USED] = 'z-rt-used';
statusClass[STATUS.LOCKED] = 'z-rt-locked';

const COLOR = {
  [STATUS.FREE]: {
    bgColor: '#93EBA5',
    textColor: '#000'
  },
  [STATUS.ORDERED]: {
    bgColor: '#F0C862',
    textColor: '#fff'
  },
  [STATUS.USED]: {
    bgColor: '#F37777',
    textColor: '#fff'
  },
  [STATUS.LOCKED]: {
    bgColor: '#CECECE',
    textColor: '#000'
  },
  [STATUS.CHOOOSED]: {
    bgColor: '#30971D',
    textColor: '#fff'
  }
};

export { STATUS, COLOR, statusClass };