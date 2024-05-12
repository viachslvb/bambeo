export interface IPromotionFilter {
  search: string;
  categoryIds: number[];
  storeIds: number[];
  includeUpcomingPromotions: boolean;
  sortType: string;
  pageIndex: number;
  pageSize: number;
}