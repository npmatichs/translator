class Translation
{
    /**
     * Translation constructor
     *
     * @param {object} scheme Library with translations.
     * @return Translation
     */
    constructor(scheme)
    {
    	this.scheme = scheme;
    }

    /**
     * Get key trasnlation from the scheme library.
     * 
     * @param {string} key
     * @param {string|''} _default
     * @return {string}
     */
    get(key, _default = '')
    {
    	return this.getScheme()[key] 
    		? this.getScheme()[key] 
    		: _default; 
    }

    /**
     * Get translations library.
     *
     * @return {object}
     */
    getScheme()
    {
    	return this.scheme;
    }
}

module.exports = Translation;