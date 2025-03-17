import {Rate} from "components/Rate";
import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

const CurrencyPage: React.FC = () => {
    const {currency} = useParams<{currency: string}>();
    const [rateDataDict, setRateDataDict] = useState<{string: Rate} | null>(null);
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
                if (data[currency]) {
                    setRateDataDict(data[currency]);
                } else {
                    setError("Currency not found");
                }
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, [currency]);

    return (
        <main className="container">
            <h1>{currency?.toUpperCase()} Details</h1>
            <Link to="/">Back to Home</Link>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            {rateDataDict && (
                <ul>
                    {Object.entries(rateDataDict).map(([rateCurrency, rateData]) => (
                        <li key={rateCurrency}>
                            <strong>{rateCurrency.toUpperCase()}</strong>
                            <p>Rate: {rateData.rate}</p>
                            <p>Ask: {rateData.ask}</p>
                            <p>Bid: {rateData.bid}</p>
                            <p>24h Change: {rateData.diff24h}</p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default CurrencyPage;
