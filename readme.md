# NodeJS Localizer based vocabulars.

Do you need to have translations vocabularic?? Now it easy with this package!!! Easy install, easy connect, easy to add your translations to vocabular. Learn the documentation below how to use.

# Requirements
 - nodejs ```^6.9.0```
 - npm ```^3.10.8```
 - express ```^4.14.0``` NodeJS framework.

# Install (step I)
    npm install git+ssh://git@10.1.1.159:npm-packages/translator.git --save

# Connect as middleware (step II)
Require the package ``` let localization = require("translator");``` to your middleware like in example below:
    
    app.use('/:lang?/', wrap(localize), require('./app/router'));
where the ```lang``` parameter is required

# How to use (step III)
Create in your application root directory the next folders ```resources/lang``` and in the this folders add your languages to the app, for example we will add the english folder. This folder ```MUST``` be named and used as language slug, so create the ```en``` folder. It must looks like ```resources/lang/en```,  and the next create the ```general.json``` file witch be used as vocabular and add to them some key with a translated value for this language.
```
{
    "hello_world" : "Hello World!!!"
}
```

Now just share from your action controller where you have connected before the ```localization``` middleware and access the incoming translator object from req ```req.translator```. So share to view some method from this instance like:
```
// In the example I used pug as 
exports.function = index = (req, res, next) => {
    return res.renderFile('views/index', {
        trans : (key, _default = '') => req.translator ? req.translator.trans(key, _default) : _default;
    })
}
```
That's it. Just use in your view the next code to translate some key:

``` 
p Just look at my translated !{trans('hello_world')}.

```

it will printet the "<p>Just look at my translated Hello World!!!</p>".


# Advices

Parse all directories and render the language panel. Exists 2 possibilities to get languages ```async``` and ```sync```. To get Folders ```sync``` call the ```getLanguagesSync()``` method of ```Translator``` instance and for ```async``` use ```getLanguagesAsync()```. It will returns the ```Array``` with your folders, now below I show the example how we can use it (as a template generator i used ```pug```):

```
if(languages)
    li
        a.dropdown-toggle(data-toggle="dropdown") !{translator.getLocale().toUpperCase()}

        ul.dropdown-menu
            each language in languages
                li.dropdown
                    if(language != translator.getLocale())
                    a.m-r-sm.white(href=translator.renderLocaleUrl(language))
                        |  !{language.toUpperCase()}
```