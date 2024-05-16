import { ProductCategory } from "./productCategory";
import { Promotion } from "./promotion";
import { Store } from "./store";

export interface Product {
    id: number,
    name: string,
    imageUrl: string,
    category: ProductCategory,
    store: Store,
    promotions: Promotion[],
}