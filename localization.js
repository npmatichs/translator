let Translator = require('./index');
const DEFAULT_LOCALE = 'en';

module.exports = function * (req, res, next) {
    if(req.method != 'GET') 
    {
        // skip post, put, delete methods.
        return next();
    }
    
    let locale = req.params.lang;

    if(locale)
    {
        req.session.lang = locale || req.session.lang;    

        req.translator = (new Translator(req.session.lang));

    } else {

        req.session.lang = req.session.lang || DEFAULT_LOCALE;    

        return res.redirect(`/${req.session.lang}${req.originalUrl}`);
    }

    return next();
}