import { useEffect, useState } from 'react';
import {
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector,
    Tooltip,
} from 'recharts';
import { API_URL, PIE_COLORS } from '../../consts';
import type { pieChartProps, pieSlice } from '../../types/charts';

export default function PieChartDiv({ title, endpoint }: pieChartProps) {
    const [data, setData] = useState<{ name: string; value: number }[] | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(`${API_URL}/${endpoint}`);

                if (!resp.ok) {
                    throw new Error(`Error fetching data: ${resp.status}`);
                }

                const json: pieSlice[] = await resp.json();
                const withColors = json.map((d, i) => ({
                    ...d,
                    fill: PIE_COLORS[i % PIE_COLORS.length],
                }));

                setData(withColors);
            } catch (err) {
                console.error(err);
                setError(
                    err instanceof Error ? err.message : 'Failed to load data',
                );
            }
        })();
    }, []);

    if (error)
        return (
            <div>
                Failed to load {title}: {error}
            </div>
        );
    if (!data) return <div>Loading {title}...</div>;

    return (
        <div
            style={{
                width: '75vw',
                margin: '0 auto',
                textAlign: 'center',
                border: '2px solid black',
            }}
        >
            <h2>{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart title="test">
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={140}
                        label={({ name, percent }) =>
                            `${name} ${(percent! * 100).toFixed(1)}%`
                        }
                        shape={(props: any) => (
                            <Sector
                                {...props}
                                fill={
                                    PIE_COLORS[props.index % PIE_COLORS.length]
                                }
                            />
                        )}
                    ></Pie>
                    <Legend />
                    <Tooltip
                        formatter={(value, name) => [
                            `${(
                                (typeof value === 'number'
                                    ? value
                                    : Number(value ?? 0)) * 100
                            ).toFixed(2)}%`,
                            String(name),
                        ]}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
