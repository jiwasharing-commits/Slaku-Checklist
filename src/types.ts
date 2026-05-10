export type InventoryStatus = 'Safe' | 'Need Review' | 'Low Stock' | 'Out of Stock';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  systemStock: number;
  physicalStock: number;
  notes: string;
  checked: boolean;
}

export interface OpnameMeta {
  date: string;
  staffName: string;
}
