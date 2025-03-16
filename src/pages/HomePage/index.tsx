import React, {useEffect, useState} from "react";

interface Rate {
    rate: number;
    ask: number;
    bid: number;
    diff24h: number;
}

const HomePage: React.FC = () => {
    const [rates, setRates] = useState<{[key: string]: Rate}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch("https://app.youhodler.com/api/v3/rates/extended");
                if (!response.ok) {
                    throw new Error("Failed to fetch rates");
                }
                const data = await response.json();
                const extractedRates: {[key: string]: Rate} = {};
                for (const currency in data) {
                    if (data[currency].usd) {
                        extractedRates[currency] = data[currency].usd;
                    }
                }
                setRates(extractedRates);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    return (
        <>
            <h1>Cryptocurrency rates </h1>
            <h2>Relative to USD</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            {!loading && !error && (
                <ul>
                    {Object.entries(rates).map(([currency, rateData]) => (
                        <li key={currency}>
                            <a href={`/${currency}`}>
                                <strong>{currency.toUpperCase()}:</strong> {rateData.rate}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default HomePage;
