export interface UserFilterItem {
  name: string,
  type: UserFilterType
}

export enum UserFilterType {
  Store = 0,
  Category = 1,
  Options = 3,
  Query = 4
}