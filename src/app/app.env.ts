export const ENV: Environment = (<any>window).ENV;

export interface Environment {
    COKERYEN_DB_AUTH: string,
    COKERYEN_DB_URL: string,
}