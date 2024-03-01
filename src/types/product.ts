export interface Product {
  id: string;
  name: string;
  description: string;
  value: string;
}

export type IProductTableFilters = {
  name: string;
};

export type IProductTableFilterValue = string | string[];
