import express from 'express';
import cors from 'cors';
import health from './routes/health';
import langdist from './routes/langdist';
import typedist from './routes/typedist';
import licndist from './routes/licndist';

const PORT = 8765;
const ROUTES = [health, langdist, typedist, licndist];

function main() {
    const app = express();
    app.use(express.json());
    app.use(cors({ origin: 'http://localhost:6284', credentials: true }));

    ROUTES.forEach((r) => app.use(r));

    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

// BACKEND ENTRYPOINT
main();
