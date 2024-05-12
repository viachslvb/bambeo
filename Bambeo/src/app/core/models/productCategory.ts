export interface ProductCategory {
    id: number,
    name: string,
    selected?: boolean,
    opened?: boolean,
    subCategories?: ProductCategory[]
  }