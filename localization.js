let Translator = require('./index');
const DEFAULT_LOCALE = 'en';

module.exports = function * (req, res, next) {
    let locale = req.params.lang;

    if(req.method != 'GET') 
    {
        // le costeliano ...
        if(req.session.lang)
        {
            req.translator = (new Translator(
                req.session.lang, req.originalUrl
            ));
        }

        // skip post, put, delete methods.
        return next();
    }

    if(locale)
    {
        req.session.lang = locale || req.session.lang;    

        req.translator = (new Translator(
            req.session.lang, req.originalUrl
        ));

    } else {

        req.session.lang = req.session.lang || DEFAULT_LOCALE;    

        return res.redirect(`/${req.session.lang}${req.originalUrl}`);
    }

    return next();
}