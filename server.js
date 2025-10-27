const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { bundle } = require('@redocly/cli');

const app = express();
const port = process.env.PORT || 3000;

// public 폴더의 index.html을 기본 페이지로 제공
app.use(express.static('public'));

// Helper function to download a file
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {}); // Delete the file on error
            reject(err);
        });
    });
}

app.get('/api/docs/refresh', async (req, res) => {
    console.log('--- ✅ NEWEST SERVER CODE (v3) IS RUNNING! ✅ ---');

    // 중요: 이 URL은 실제 운영/테스트 중인 Pullit 백엔드 서버의 주소여야 합니다.
    const PULLIT_API_URL = 'https://qa.api.pull.it.kr/api-docs.yaml';
    
    const specPath = path.join('/tmp', 'spec.yaml');
    const outputPath = path.join('/tmp', 'index.html');

    console.log('문서 생성을 시작합니다...');
    try {
        console.log(`1/3: API 명세서를 다운로드합니다... (${PULLIT_API_URL})`);
        await downloadFile(PULLIT_API_URL, specPath);

        console.log('2/3: Redocly로 HTML 문서를 빌드합니다...');
        await bundle({
            files: [specPath],
            output: outputPath,
            ext: 'html',
            // Redocly 옵션 추가 (필요 시)
        });

        console.log('3/3: 생성된 HTML 파일을 읽습니다...');
        const htmlContent = fs.readFileSync(outputPath, 'utf8');
        
        console.log('문서 생성 완료. HTML을 전송합니다.');
        res.send(htmlContent);

    } catch (error) {
        console.error('문서 생성 중 오류 발생:', error);
        res.status(500).send(`<h1>오류 발생</h1><pre>${error.message}</pre>`);
    } finally {
        // 임시 생성된 파일들을 삭제합니다.
        if (fs.existsSync(specPath)) fs.unlinkSync(specPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
});

app.listen(port, () => {
    console.log(`문서 생성 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
