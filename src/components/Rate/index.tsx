import {z} from "zod";

export const RateSchema = z.object({
    rate: z.number(),
    ask: z.number(),
    bid: z.number(),
    diff24h: z.number()
});
export const RateArrayItemSchema = RateSchema.extend({
    currency: z.string()
});
export const RatesResponseSchema = z.record(z.string(), z.record(z.string(), RateSchema));
export type RateArrayItem = z.infer<typeof RateArrayItemSchema>;
export type RateType = z.infer<typeof RateSchema>;
