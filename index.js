let localization = require('./localization');
let wrap = require('co').wrap;

/**
 * Localize middleware generator function.
 *
 * @require: expressjs^4.0 
 * @param {req} req
 * @param {res} res
 * @param {function} next
 */
module.exports = function * (req, res, next) => {
    return wrap(localization(req, res, next));
};