import React, {useEffect, useState} from "react";
import {z} from "zod";

const RateSchema = z.object({
    rate: z.number(),
    ask: z.number(),
    bid: z.number(),
    diff24h: z.number()
});
const RatesResponseSchema = z.record(z.string(), z.record(z.string(), RateSchema));
type RateType = z.infer<typeof RateSchema>;

const HomePage: React.FC = () => {
    const [rates, setRates] = useState<{[key: string]: RateType}>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch("https://app.youhodler.com/api/v3/rates/extended");
                if (!response.ok) {
                    throw new Error("Failed to fetch rates");
                }
                const rawData = await response.json();
                const data = RatesResponseSchema.parse(rawData);
                const extractedRates: {[key: string]: RateType} = {};
                for (const currency in data) {
                    if (data[currency].usd) {
                        extractedRates[currency] = data[currency].usd;
                    }
                }
                setRates(extractedRates);
            } catch {
                setError("We're updating our currency rates. Please check back later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    return (
        <div>
            <h1 className="center">Cryptocurrency rates </h1>
            <p className="center mt-20">Relative to USD</p>
            {error && <p>{error}</p>}
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
        </div>
    );
};

export default HomePage;
