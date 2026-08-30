import express from 'express';
import health from './routes/health';

const PORT = 8765;
const ROUTES = [health];

function main() {
    const app = express();
    app.use(express.json());

    ROUTES.forEach((r) => app.use(r));

    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

// BACKEND ENTRYPOINT
main();