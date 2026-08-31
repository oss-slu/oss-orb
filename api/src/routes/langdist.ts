import { Router } from 'express';
import type { parquetData } from '../types/parquetData';
import { getDistribution } from '../utils/math';
import sampleData from '../../data/sample/sampleRepoData.json';

const router = Router();

const data = sampleData as parquetData[];

router.get('/langdist', (_req, res) => {
    const distData = getDistribution(data, (row) => row.language!);
    res.json(Object.entries(distData).map(([name, value]) => ({ name, value })));
});

export default router;
