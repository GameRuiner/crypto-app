import {Rate, RateArrayItem} from "components/Rate";
import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

const CurrencyPage: React.FC = () => {
    const {currency: currencyParameter} = useParams<{currency: string}>();
    const [rateDataArray, setRateDataArray] = useState<RateArrayItem[]>([]);
    const [processedRates, setProcessedRate] = useState<RateArrayItem[]>([]);
    const [groupedRates, setGroupedRates] = useState<Record<string, RateArrayItem[]>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [filterValue, setFilterValue] = useState<string>("");
    const [groupBy, setGroupBy] = useState<boolean>(false);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch("https://app.youhodler.com/api/v3/rates/extended");
                if (!response.ok) {
                    throw new Error("Failed to fetch rates");
                }
                const data = await response.json();
                if (data[currencyParameter]) {
                    const currencyArray = Object.entries(
                        data[currencyParameter] as Record<string, Rate>
                    ).map(([rateCurrency, rateData]) => ({
                        currency: rateCurrency.toUpperCase(),
                        ...rateData
                    }));
                    setRateDataArray(currencyArray);
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
    }, [currencyParameter]);

    useEffect(() => {
        setProcessedRate(
            rateDataArray
                .filter((item) => item.currency.includes(filterValue.toUpperCase()))
                .sort((a, b) => {
                    if (!sortBy) return 0;
                    return a[sortBy] > b[sortBy] ? 1 : -1;
                })
        );
    }, [rateDataArray, filterValue, sortBy]);

    useEffect(() => {
        setGroupedRates(
            groupBy
                ? processedRates.reduce(
                      (acc, item) => {
                          const firstLetter = item.currency[0];
                          acc[firstLetter] = acc[firstLetter] || [];
                          acc[firstLetter].push(item);
                          return acc;
                      },
                      {} as Record<string, typeof processedRates>
                  )
                : {All: processedRates}
        );
    }, [groupBy, processedRates]);

    return (
        <main className="container">
            <h1>{currencyParameter?.toUpperCase()} Details</h1>
            <Link to="/">Back to Home</Link>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            <div>
                <label>Sort by:</label>
                <select onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">None</option>
                    <option value="rate">Rate</option>
                    <option value="ask">Ask</option>
                    <option value="bid">Bid</option>
                    <option value="diff24h">24h Change</option>
                </select>
                <input
                    type="text"
                    placeholder="Filter by currency..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={groupBy}
                        onChange={() => setGroupBy(!groupBy)}
                    />
                    Group by first letter
                </label>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Rate</th>
                            <th>Ask</th>
                            <th>Bid</th>
                            <th>24h %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedRates).map(([group, items]) => (
                            <React.Fragment key={group}>
                                <tr>
                                    <td colSpan={5}>
                                        <strong>{group}</strong>
                                    </td>
                                </tr>
                                {items.map(({currency, rate, ask, bid, diff24h}) => (
                                    <tr key={currency}>
                                        <td>{currency}</td>
                                        <td>{rate}</td>
                                        <td>{ask}</td>
                                        <td>{bid}</td>
                                        <td>{diff24h}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default CurrencyPage;
