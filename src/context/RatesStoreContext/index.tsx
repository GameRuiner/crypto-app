import React, {createContext, useContext} from "react";
import {useLocalStore} from "mobx-react-lite";
import {RatesResponseSchema} from "components/Rate";

type RatesStore = {
    rates: typeof RatesResponseSchema;
    loading: boolean;
    error: string | null;
    fetchRates: () => Promise<void>;
};

const RatesStoreContext = createContext<RatesStore>(null);

export const RatesStoreProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const store = useLocalStore(() => ({
        rates: {} as typeof RatesResponseSchema,
        loading: true,
        error: null as string | null,

        async fetchRates() {
            store.loading = true;
            store.error = null;
            try {
                const response = await fetch("https://app.youhodler.com/api/v3/rates/extended");
                if (!response.ok) {
                    throw new Error("Failed to fetch rates");
                }
                const rawData = await response.json();
                const data = RatesResponseSchema.parse(rawData);
                store.rates = data as unknown as typeof RatesResponseSchema;
            } catch {
                store.error = "We're updating our currency rates. Please check back later.";
            } finally {
                store.loading = false;
            }
        }
    }));

    return <RatesStoreContext.Provider value={store}>{children}</RatesStoreContext.Provider>;
};

export const useRatesStore = () => {
    const context = useContext(RatesStoreContext);
    return context;
};
