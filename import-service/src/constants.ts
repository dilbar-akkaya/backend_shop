export const DB_PRODUCTS = process.env.PRODUCTS_TABLE ?? "";
export const DB_STOCKS = process.env.STOCK_TABLE ?? "";
export const REGION = process.env.REGION ?? "";
export const BUCKET = process.env.BUCKET;
export const TYPE_CSV = "text/csv";
export const queueUrl = "https://sqs.eu-west-1.amazonaws.com/637423586618/catalogItemsQueue";