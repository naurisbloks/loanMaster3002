import { create } from 'zustand';

interface ValuationItem {
  id: number;
  deviceType: string;
  manufacturer: string;
  model: string;
  value: number;
  date: string;
}

interface ValuationStore {
  internalValuation: number;
  externalValuation: number;
  recommendedValuation: number;
  finalValue: number | null;
  similarDevices: ValuationItem[];
  scrapedItems: ValuationItem[];
  internalValuationOpen: boolean;
  externalValuationOpen: boolean;
  setFinalValue: (value: number | null) => void;
  setInternalValuationOpen: (open: boolean) => void;
  setExternalValuationOpen: (open: boolean) => void;
}

// Mock data for development
const mockSimilarDevices: ValuationItem[] = [
  {
    id: 1,
    deviceType: "Smartphone",
    manufacturer: "Apple",
    model: "iPhone 13",
    value: 450,
    date: "2024-02-15",
  },
  {
    id: 2,
    deviceType: "Smartphone",
    manufacturer: "Apple",
    model: "iPhone 12",
    value: 350,
    date: "2024-02-10",
  },
];

const mockScrapedItems: ValuationItem[] = [
  {
    id: 1,
    deviceType: "Smartphone",
    manufacturer: "Apple",
    model: "iPhone 13",
    value: 500,
    date: "2024-02-20",
  },
  {
    id: 2,
    deviceType: "Smartphone",
    manufacturer: "Apple",
    model: "iPhone 13",
    value: 480,
    date: "2024-02-19",
  },
];

export const useValuationStore = create<ValuationStore>((set) => ({
  internalValuation: 400,
  externalValuation: 490,
  recommendedValuation: 450,
  finalValue: null,
  similarDevices: mockSimilarDevices,
  scrapedItems: mockScrapedItems,
  internalValuationOpen: false,
  externalValuationOpen: false,
  setFinalValue: (value) => set({ finalValue: value }),
  setInternalValuationOpen: (open) => set({ internalValuationOpen: open }),
  setExternalValuationOpen: (open) => set({ externalValuationOpen: open }),
}));