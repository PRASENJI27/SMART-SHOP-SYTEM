
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  completed: boolean;
}

export enum AisleCategory {
  PRODUCE = 'Produce',
  DAIRY = 'Dairy & Eggs',
  MEAT = 'Meat & Seafood',
  PANTRY = 'Pantry & Grains',
  BEVERAGES = 'Beverages',
  FROZEN = 'Frozen Foods',
  HOUSEHOLD = 'Household & Cleaning',
  PERSONAL_CARE = 'Personal Care',
  OTHER = 'Other'
}

export interface SmartSuggestion {
  name: string;
  category: AisleCategory;
}
