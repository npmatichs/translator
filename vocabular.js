class Vocabular
{
    /**
     * Vocabular constructor
     *
     * @param {object} scheme Library with translations.
     * @return Vocabular
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
    		: (_default ? _default : key); 
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

module.exports = Vocabular;