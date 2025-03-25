import React, {useEffect, useState} from "react";
import {RateType} from "components/Rate";
import {useRatesStore} from "src/context/RatesStoreContext";
import {Link} from "react-router-dom";

const HomePage: React.FC = () => {
    const [rates, setRates] = useState<{[key: string]: RateType}>({});
    const store = useRatesStore();

    useEffect(() => {
        const fetchRates = async () => {
            if (Object.keys(store.rates).length === 0) await store.fetchRates();
            const extractedRates: {[key: string]: RateType} = {};
            for (const currency in store.rates) {
                if (store.rates[currency].usd) {
                    extractedRates[currency] = store.rates[currency].usd;
                }
            }
            setRates(extractedRates);
        };

        fetchRates();
    }, [store]);

    return (
        <div>
            <h1 className="center">Cryptocurrency rates </h1>
            <p className="center mt-20">Relative to USD</p>
            {store.error && <p>{store.error}</p>}
            {!store.loading && !store.error && (
                <ul className="rates-list">
                    {Object.entries(rates).map(([currency, rateData]) => (
                        <li key={currency}>
                            <Link to={`/${currency}`} className="currency-item">
                                <strong>{currency.toUpperCase()}</strong>
                                <p>{rateData.rate}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HomePage;
