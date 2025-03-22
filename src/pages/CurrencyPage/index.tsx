import Filter from "components/Filter";
import {Rate, RateArrayItem} from "components/Rate";
import Toggle from "components/Toggle";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const SORT_ORDER = ["none", "desc", "asc"];

const CurrencyPage: React.FC = () => {
    const {currency: currencyParameter} = useParams<{currency: string}>();
    const [rateDataArray, setRateDataArray] = useState<RateArrayItem[]>([]);
    const [processedRates, setProcessedRate] = useState<RateArrayItem[]>([]);
    const [groupedRates, setGroupedRates] = useState<Record<string, RateArrayItem[]>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrderIndex, setSortOrderIndex] = useState(0);
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
            [...rateDataArray]
                .filter((item) => item.currency.includes(filterValue.toUpperCase()))
                .sort((a, b) => {
                    if (!sortBy || sortOrderIndex == 0) return 0;
                    if (a[sortBy] > b[sortBy]) return SORT_ORDER[sortOrderIndex] === "asc" ? 1 : -1;
                    if (a[sortBy] < b[sortBy]) return SORT_ORDER[sortOrderIndex] === "asc" ? -1 : 1;
                    return 0;
                })
        );
    }, [rateDataArray, filterValue, sortBy, sortOrderIndex]);

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

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrderIndex((sortOrderIndex + 1) % 3);
        } else {
            setSortBy(column);
            setSortOrderIndex(1);
        }
    };

    const getSortIcon = (column) => {
        if (sortBy === column) {
            const mapper = {
                asc: "▲",
                desc: "▼",
                none: ""
            };
            return mapper[SORT_ORDER[sortOrderIndex]];
        }
        return "";
    };

    return (
        <div>
            <h1 className="center">{currencyParameter?.toUpperCase()} Details</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{color: "red"}}>{error}</p>}
            <div className="mt-10">
                <div className="control-container">
                    <Filter filterHandler={setFilterValue}></Filter>
                    <Toggle toggleHandler={setGroupBy} value={groupBy}></Toggle>
                </div>
                <table className="currency-data mt-20">
                    <thead className="table-head">
                        <tr>
                            <th onClick={() => handleSort("currency")} className="name-column">
                                {getSortIcon("currency")} Name
                            </th>
                            <th onClick={() => handleSort("rate")}>{getSortIcon("rate")} Rate</th>
                            <th onClick={() => handleSort("ask")}>{getSortIcon("ask")} Ask</th>
                            <th onClick={() => handleSort("bid")}>{getSortIcon("bid")} Bid</th>
                            <th onClick={() => handleSort("diff24h")}>
                                {getSortIcon("diff24h")} 24h %
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedRates).map(([group, items]) => (
                            <React.Fragment key={group}>
                                <tr>
                                    <td colSpan={5} className="group-name">
                                        <strong>{group}</strong>
                                    </td>
                                </tr>
                                {items.map(({currency, rate, ask, bid, diff24h}) => (
                                    <tr key={currency}>
                                        <td className="name-column">{currency}</td>
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
        </div>
    );
};

export default CurrencyPage;
