import PieChartDiv from './charts/PieChart';

function App() {
    return (
        <>
            <main style={{ textAlign: 'center' }}>
                <h1>OSS Open Source Repository Browser</h1>
                <PieChartDiv
                    title="Language Distribution"
                    endpoint="langdist"
                />
                <PieChartDiv
                    title="Project Type Distribution"
                    endpoint="typedist"
                />
                <PieChartDiv title="License Distribution" endpoint="licndist" />
            </main>
        </>
    );
}

export default App;
