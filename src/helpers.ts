import type { InventoryItem, InventoryStatus, OpnameMeta } from './types';

export const calculateVariance = (physicalStock: number, systemStock: number): number => physicalStock - systemStock;

export const calculateStatus = (item: InventoryItem): InventoryStatus => {
  const variance = calculateVariance(item.physicalStock, item.systemStock);
  if (item.physicalStock === 0) return 'Out of Stock';
  if (item.physicalStock > 0 && item.physicalStock <= 3) return 'Low Stock';
  if (variance !== 0) return 'Need Review';
  return 'Safe';
};

const esc = (value: string | number): string => `"${String(value).replace(/"/g, '""')}"`;

export const toCsv = (items: InventoryItem[], meta: OpnameMeta): string => {
  const header = ['Date','Staff','Checked','Item Name','Category','Unit','System Stock','Physical Stock','Variance','Notes','Status'];
  const rows = items.map((item) => {
    const variance = calculateVariance(item.physicalStock, item.systemStock);
    return [meta.date,meta.staffName,item.checked ? 'Yes' : 'No',item.name,item.category,item.unit,item.systemStock,item.physicalStock,variance,item.notes,calculateStatus(item)].map(esc).join(',');
  });
  return [header.map(esc).join(','), ...rows].join('\n');
};

export const toBackupJson = (items: InventoryItem[], meta: OpnameMeta): string => JSON.stringify({ meta, items }, null, 2);
export const parseBackupJson = (raw: string): { meta: OpnameMeta; items: InventoryItem[] } => JSON.parse(raw) as { meta: OpnameMeta; items: InventoryItem[] };
