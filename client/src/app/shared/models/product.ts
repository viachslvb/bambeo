import { ProductCategory } from "./productCategory";
import { Store } from "./store";

export interface Product {
    id: number,
    name: string,
    imageUrl: string,
    productCategory: ProductCategory,
    store: Store,
}