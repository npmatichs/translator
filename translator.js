const DEFAULT_TRANSLATIONS_PATH = 'resources/lang';
const DEFAULT_LOCALE = 'en';
let Vocabular = require('./vocabular');
let fs = require('fs');
let path = require('path');
let b = require('bluebird');

class Translator
{
	/**
	 * Translator constructor.
	 *
	 * @return Translator
	 */
	constructor(locale = DEFAULT_LOCALE, currentUrl = '')
	{
		this.setTranslationsPath(DEFAULT_TRANSLATIONS_PATH);
		this.locale = locale;
		this.scheme = {};
		this.translations = {};
		this.currentUrl = currentUrl;

		if(! this.isDefaultTranslator())
		{
			this.defaultTranslator = (new Translator(DEFAULT_LOCALE))
		}

		// load translations ..
		this.loadTranslations();
	}

	/**
	 * Set translations path.
	 *
	 * @param {string} translationsPath
	 * @return {this}
	 */
	setTranslationsPath(translationsPath)
	{
		this.translationsPath = translationsPath;

		return this;
	}

	/**
	 * Get translations path.
	 *
	 * @return {string}
	 */
	getTranslationsPath()
	{
		return this.translationsPath;
	}

	/**
	 * Set translator locale.
	 *
	 * @param {string} locale
	 * @return {this} 
	 */
	setLocale(locale)
	{
		this.locale = locale;

		return this;
	}

	/**
	 * Get locale language.
	 *
	 * @return {string}
	 */
	getLocale()
	{
		return this.locale;
	}

	/**
	 * Load tranlsations to translator.
	 *
	 * @param {string} locale
	 * @return {this}
	 */
	loadTranslations(locale = null)
	{
		let _path = `${this.getTranslationsFullPath()}/${locale ? locale : this.getLocale()}/general`;

		try
		{
			let scheme = require(_path);

			this.initScheme(scheme);
		}
		catch (err)
		{
			this.printLoadError(err);
		}

		return this;
	}

	/**
	 * Log & print load translations scheme errors.
	 *
	 * @param {Error} err
	 * @return {undefined}
	 */
	printLoadError(err)
	{
		console.log(`Unable to load transltions scheme for "${this.getLocale()}"`);
		console.log(err);
	}

	/**
	 * Get locale translations blueprint.
	 *
	 * @return {Object}
	 */
	getTranslationsScheme()
	{
		return this.translationsScheme;
	}

	/**
	 * Get locale translations.
	 *
	 * @return {Object}
	 */
	getTranslations()
	{
		return this.translations;
	}

	/**
	 * Set locale translations with saving translations scheme.
	 *
	 * @return this
	 */
	setTranslations(scheme)
	{
		this.translations = (new Vocabular(scheme));

		return this;
	}

	/**
	 * Set translations scheme.
	 *
	 * @param {string} scheme
	 * @return {this}
	 */
	setScheme(scheme)
	{
		this.scheme = scheme;

		return this;
	}

	/**
	 * Get translations scheme.
	 *
	 * @return {string}
	 */
	getScheme()
	{
		return this.scheme;
	}

	/**
	 * Initialize loaded translations scheme to translator.
	 *
	 * @param {Object} scheme.
	 * @return {undefined}
	 */
	initScheme(scheme)
	{
		this.setScheme(scheme);

		if(! this.isDefaultTranslator())
		{
			this.setTranslations(
				this.mergeTranslations(scheme, this.getDefaultTranslator().getScheme())
			);
		} else {
			this.setTranslations(scheme);
		}
	}

	/**
	 * Check if translator of default locale.
	 *
	 * @return {Boolean}
	 */
	isDefaultTranslator()
	{
		return this.getLocale() == DEFAULT_LOCALE;
	}

	/**
	 * Merge setted translations with default.
	 *
	 * @param {object} scheme Setted object list
	 * @param {object} defaultScheme Default scheme translations
	 * @return {Object}
	 */
	mergeTranslations(scheme, defaultScheme)
	{
		let _keys_defaultScheme = Object.keys(defaultScheme);
		let _keys_scheme = Object.keys(scheme);
		let _temp = {};

		// manage default translations..
		for(let i = 0; i < _keys_defaultScheme.length; i++)
		{
			_temp[_keys_defaultScheme[i]] = defaultScheme[_keys_defaultScheme[i]];
		}

		// manage setted translations..
		for(let i = 0; i < _keys_scheme.length; i++)
		{
			_temp[_keys_scheme[i]] = scheme[_keys_scheme[i]];
		}

		return _temp;
	}

	/**
	 * Translate key.
	 *
	 * @param {string} key 
	 * @param {string} _default 
	 * @return {string}
	 */
	translate(key, _default = '')
	{
		let trans = this.getTranslations();

		if(trans instanceof Vocabular)
		{
			return trans.get(key, _default);
		}

		return _default;
	}

	/**
	 * Alias of .translate()
	 *
	 * @param {string} key
	 * @param {string} _default
	 * @return {string}
	 */
	trans(key, _default = '')
	{
		return this.translate(key, _default);
	}

	/**
	 * Alias of .getLocale()
	 *
	 * @return {string}
	 */
	lang()
	{
		return this.getLocale();
	}

	/**
	 * Get default locale translator.
	 *
	 * @return {Translator}
	 */
	getDefaultTranslator()
	{
		return this.defaultTranslator;
	}

	/**
	 * Get current url path.
	 *
	 * @return {string}
	 */
	getCurrentUrl()
	{
		return this.currentUrl;
	}

	/**
	 * Render locale url path.
	 *
	 * @return {string}
	 */
	renderLocaleUrl(locale = DEFAULT_LOCALE)
	{
		let currentUrl = this.getCurrentUrl();

		if(! currentUrl.indexOf(locale))
		{
			currentUrl = `/${locale}${currentUrl}`

		} else {
			currentUrl = currentUrl.replace(this.getLocale(), locale);
		}

		return currentUrl;
	}

	/**
	 * Slugify text version 2.
	 *
	 * @param {string} text
	 * @return {String}
	 */
	slug(text = '')
	{
	    if(text)
	    {
	        return text.toString().toLowerCase()
	            .replace(/\s+/g, '_')
	            .replace(/[^\w\-]+/g, '')
	            .replace(/\-\-+/g, '_')
	            .replace(/^-+/, '')
	            .replace(/-+$/, '');
	    }

	    return text;
	};

	/**
	 * Get async available languages based folders.
	 *
	 * @return {Promise|Array}
	 */
	getLanguagesAsync()
	{
		let languages = [];

		let deffered = b.defer();

		fs.readdir(this.getTranslationsFullPath(), (err, files) => {
			if(err)
			{
				console.log(err);
			}

			if(files)
			{
				let _count = files.length;

				for(let i = 0; i < _count; i++)
				{
					languages.push(files[i]);
				}
			}

			deffered.resolve(languages);
		});

		return deffered.promise;
	}

	/**
	 * Get sync available languages based folders.
	 *
	 * @return {Array}
	 */
	getLanguagesSync()
	{
		let languages = [];

		fs.readdirSync(this.getTranslationsFullPath(), (err, files) => {
			if(err)
			{
				console.log(err);
			}

			if(files)
			{
				let _count = files.length;

				for(let i = 0; i < _count; i++)
				{
					languages.push(files[i]);
				}
			}
		});

		return languages;
	}

	/**
	 * Get full translations path from the root app.
	 *
	 * @return {string}
	 */
	getTranslationsFullPath()
	{
		return path.dirname(require.main.filename) 
			+ '/' 
			+ this.getTranslationsPath();
	}
}

module.exports = Translator;