export type ExpressPrams<T> = {
    originalUrl: string;
} & T;

export type ExpressResBody<T> = T & string;
