export interface Pagination<T> {
    pageIndex: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    count: number;
    data: T;
}