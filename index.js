const DEFAULT_TRANSLATIONS_PATH = './resources/lang';
const DEFAULT_LOCALE = 'en';
let TranslationBluePrint = require('./translation');

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
	 * @return {this}
	 */
	loadTranslations()
	{
		try
		{
			let _path = `${this.getTranslationsPath()}/${this.getLocale()}`;

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
		console.log(`Unable to load transltions scheme for ${this.getLocale()}`);
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
		this.translations = (new TranslationBluePrint(scheme));

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

		this.setTranslations(scheme);
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
		return this.getTranslations().get(key, _default);
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
}

module.exports = Translator;