const SPEC_URL = 'https://qa.api.pull.it.kr/api-docs.yaml';
const crypto = require('crypto');

module.exports = async (req, res) => {
    try {
        const specResponse = await fetch(SPEC_URL, {
            headers: {
                'User-Agent': 'Vercel-Proxy'
            }
        });

        if (!specResponse.ok) {
            const errorBody = await specResponse.text();
            console.error(`Upstream error: ${specResponse.status} ${specResponse.statusText}`, errorBody);
            res.setHeader('Content-Type', 'text/plain');
            return res.status(specResponse.status).send(errorBody);
        }

        const specText = await specResponse.text();
        const etag = crypto.createHash('sha1').update(specText).digest('hex');

        res.setHeader('ETag', etag);

        if (req.headers['if-none-match'] === etag) {
            return res.status(304).send();
        }

        const contentType = specResponse.headers.get('content-type') || 'text/yaml';
        res.setHeader('Content-Type', contentType);
        
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.status(200).send(specText);
    } catch (error) {
        console.error('Proxy error:', error);
        res.setHeader('Content-Type', 'text/plain');
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
};
