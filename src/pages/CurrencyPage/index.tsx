import Filter from "components/Filter";
import {RateType, RateArrayItem} from "components/Rate";
import Toggle from "components/Toggle";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useRatesStore} from "src/context/RatesStoreContext";

const SORT_ORDER = ["none", "desc", "asc"];

const CurrencyPage: React.FC = () => {
    const {currency: currencyParameter} = useParams<{currency: string}>();
    const [rateDataArray, setRateDataArray] = useState<RateArrayItem[]>([]);
    const [processedRates, setProcessedRate] = useState<RateArrayItem[]>([]);
    const [groupedRates, setGroupedRates] = useState<Record<string, RateArrayItem[]>>({});
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrderIndex, setSortOrderIndex] = useState(0);
    const [filterValue, setFilterValue] = useState<string>("");
    const [groupBy, setGroupBy] = useState<boolean>(false);
    const store = useRatesStore();

    useEffect(() => {
        const fetchRates = async () => {
            if (Object.keys(store.rates).length === 0) await store.fetchRates();
            if (store.rates[currencyParameter]) {
                const currencyArray = Object.entries(
                    store.rates[currencyParameter] as Record<string, RateType>
                ).map(([rateCurrency, rateData]) => ({
                    currency: rateCurrency.toUpperCase(),
                    ...rateData
                }));
                setRateDataArray(currencyArray);
            } else {
                store.error = "Currency not found";
            }
        };

        fetchRates();
    }, [currencyParameter, store]);

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
            {store.error && <p>{store.error}</p>}
            {!store.loading && !store.error && (
                <div className="mt-10">
                    <div className="control-container">
                        <Filter filterHandler={setFilterValue}></Filter>
                        <Toggle toggleHandler={setGroupBy} value={groupBy}></Toggle>
                    </div>
                    <div className="table-container">
                        <table className="currency-data mt-20">
                            <thead className="table-head">
                                <tr>
                                    <th
                                        onClick={() => handleSort("currency")}
                                        className="name-column"
                                    >
                                        {getSortIcon("currency")} Name
                                    </th>
                                    <th onClick={() => handleSort("rate")}>
                                        {getSortIcon("rate")} Rate
                                    </th>
                                    <th onClick={() => handleSort("ask")}>
                                        {getSortIcon("ask")} Ask
                                    </th>
                                    <th onClick={() => handleSort("bid")}>
                                        {getSortIcon("bid")} Bid
                                    </th>
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
            )}
        </div>
    );
};

export default CurrencyPage;
