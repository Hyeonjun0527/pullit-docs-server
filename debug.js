const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');

    fs.readdir(nodeModulesPath, (err, files) => {
        if (err) {
            return res.status(500).json({
                error: 'Could not read node_modules directory.',
                path: nodeModulesPath,
                errorMessage: err.message,
            });
        }

        const hasRedocly = files.includes('@redocly');
        let redoclyCliExists = false;
        if (hasRedocly) {
            try {
                const redoclyPath = path.join(nodeModulesPath, '@redocly');
                const redoclyFiles = fs.readdirSync(redoclyPath);
                redoclyCliExists = redoclyFiles.includes('cli');
            } catch (e) {
                // ignore
            }
        }

        res.status(200).json({
            pathSearched: nodeModulesPath,
            doesRedoclyDirExist: hasRedocly,
            doesRedoclyCliDirExist: redoclyCliExists,
            topLevelDirCount: files.length,
            topLevelDirs: files,
        });
    });
};
