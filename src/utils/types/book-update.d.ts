export interface UpdateBookDataType {
    id: number;
    title?: string;
    description?: string;
    author?: string;
    publicationDate?: string;
    pages?: number;
    isAvailable?: boolean;
}

export interface TransactionDataType {
    id: number;
    status: string;
    returnedDate: string;
}
