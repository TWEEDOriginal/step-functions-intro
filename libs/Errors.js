module.exports.NumberIsTooBig = class NumberIsTooBig extends Error {
    constructor(n) {
        super(`${n} is too big`);
        this.name = 'NumberisTooBigError';
        Error.captureStackTrace(this, NumberIsTooBig);
}
}