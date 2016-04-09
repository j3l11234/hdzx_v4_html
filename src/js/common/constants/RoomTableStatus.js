const STATUS = {
    FREE: 1,
    ORDERED: 2,
    USED: 3,
    LOCKED: 4
};

let statusClass = {};
statusClass[STATUS.FREE] = 'z-rt-free';
statusClass[STATUS.ORDERED] = 'z-rt-ordered';
statusClass[STATUS.USED] = 'z-rt-used';
statusClass[STATUS.LOCKED] = 'z-rt-locked';

export {STATUS, statusClass};