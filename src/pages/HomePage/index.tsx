import {Rate} from "components/Rate";
import React, {useEffect, useState} from "react";

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
        <main className="container">
            <h1 className="mt-10">Cryptocurrency rates </h1>
            <p className="mt-20">Relative to USD</p>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            {!loading && !error && (
                <ul className="rates-list">
                    {Object.entries(rates).map(([currency, rateData]) => (
                        <li key={currency}>
                            <a href={`/${currency}`} className="currency-item">
                                <strong>{currency.toUpperCase()}</strong>
                                <p>{rateData.rate}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default HomePage;
