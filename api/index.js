const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { withAccelerate } = require('@prisma/extension-accelerate');

// --- Start Debugging ---
console.log('--- Environment Variables ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING ? 'Loaded' : 'NOT LOADED');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'NOT LOADED');
console.log('---------------------------');
// --- End Debugging ---


// Conditionally initialize Prisma Client
let prisma;
if (process.env.NODE_ENV === 'development') {
    // In local development, use a direct connection to the database
    // This ensures that `prisma db seed` changes are reflected immediately
    console.log('Running in development mode: using direct database connection.');
    prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.POSTGRES_URL_NON_POOLING,
            },
        },
    });
} else {
    // In production (Vercel), use Prisma Accelerate for performance
    console.log('Running in production mode: using Prisma Accelerate.');
    prisma = new PrismaClient().$extends(withAccelerate());
}

const app = express();

app.use(express.json());
app.use(express.static('public'));

// API to get all documents
app.get('/api/documents', async (req, res) => {
    try {
        const documents = await prisma.document.findMany();
        res.status(200).json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents', details: error.message });
    }
});

// API to get a single document by its path
app.get('/api/documents/:category/:id', async (req, res) => {
    try {
        const { category, id } = req.params;
        const path = `${category}/${id}`;
        
        const document = await prisma.document.findUnique({
            where: { path: path },
        });

        if (document) {
            res.status(200).json(document);
        } else {
            res.status(404).json({ error: 'Document not found' });
        }
    } catch (error) {
        console.error(`Error fetching document at path: ${req.params.category}/${req.params.id}`, error);
        res.status(500).json({ error: 'Failed to fetch document', details: error.message });
    }
});

// API to update a document
app.put('/api/documents/:category/:id', async (req, res) => {
    try {
        const { category, id } = req.params;
        const path = `${category}/${id}`;
        const { content } = req.body;

        if (typeof content !== 'string') {
            return res.status(400).json({ error: 'Content must be a string.' });
        }

        const updatedDocument = await prisma.document.update({
            where: { path: path },
            data: { content: content },
        });

        res.status(200).json(updatedDocument);
    } catch (error) {
        // Handle cases where the document to update is not found
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Document not found' });
        }
        console.error(`Error updating document at path: ${req.params.category}/${req.params.id}`, error);
        res.status(500).json({ error: 'Failed to update document', details: error.message });
    }
});


// Seed the database with an initial document
// This should be run once, perhaps manually or via a separate script.
/*
async function seed() {
    try {
        const testDoc = await prisma.document.upsert({
            where: { path: 'temporary/01-editable-test' },
            update: {},
            create: {
                path: 'temporary/01-editable-test',
                content: '# 임시 편집 테스트 문서\n\n이 페이지는 Prisma Accelerate를 통해 데이터베이스에서 실시간으로 불러온 내용입니다! 🎉',
            },
        });
        console.log('Database seeded with test document:', testDoc);
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}
*/
// Seed the database when the server starts (for demonstration)
// seed();

module.exports = app;
