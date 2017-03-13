const DEFAULT_TRANSLATIONS_PATH = './resources/lang';
const DEFAULT_LOCALE = 'en';
let Translation = require('./translation');

class Translator
{
	/**
	 * Translator constructor.
	 *
	 * @return Translator
	 */
	constructor(locale = DEFAULT_LOCALE)
	{
		this.setTranslationsPath(DEFAULT_TRANSLATIONS_PATH);
		this.locale = locale;
		this.scheme = {};
		this.translations = {};

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
		try
		{
			let _path = `${this.getTranslationsPath()}/${locale ? locale : this.getLocale()}/general`;

			let scheme = require.main.require(_path);

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
		this.translations = (new Translation(scheme));

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

		if(trans instanceof Translation)
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
}

module.exports = Translator;