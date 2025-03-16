import {Rate} from "components/Rate";
import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

const CurrencyPage: React.FC = () => {
    const {currency} = useParams<{currency: string}>();
    console.log(currency);
    const [rateData, setRateData] = useState<Rate | null>(null);
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

                if (data[currency!] && data[currency!].usd) {
                    setRateData(data[currency!].usd);
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
        <>
            <h1>{currency?.toUpperCase()} Details</h1>
            <Link to="/">Back to Home</Link>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            {rateData && (
                <ul>
                    <li>Rate: {rateData.rate}</li>
                    <li>Ask: {rateData.ask}</li>
                    <li>Bid: {rateData.bid}</li>
                    <li>24h Change: {rateData.diff24h}</li>
                </ul>
            )}
        </>
    );
};

export default CurrencyPage;
