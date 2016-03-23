const status = {
    FREE: 1,
    ORDERED: 2,
    USED: 3,
    LOCKED: 4
};

let statusClass = {};
statusClass[status.FREE] = 'z-rt-free';
statusClass[status.ORDERED] = 'z-rt-ordered';
statusClass[status.USED] = 'z-rt-used';
statusClass[status.LOCKED] = 'z-rt-locked';

export {status, statusClass};