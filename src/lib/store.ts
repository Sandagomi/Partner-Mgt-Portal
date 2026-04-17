import { create } from "zustand";
import { Partner, Brand, SubBrand, TableConfig, ActivityItem } from "./types";
import { initialPartners, initialBrands, initialSubBrands, initialTables, initialActivities } from "./mock-data";

function genId() {
  return Math.random().toString(36).slice(2, 10);
}
const now = () => new Date().toISOString();

interface Store {
  partners: Partner[];
  brands: Brand[];
  subBrands: SubBrand[];
  tables: TableConfig[];
  activities: ActivityItem[];

  addPartner: (p: Omit<Partner, "id" | "createdAt" | "updatedAt">) => void;
  updatePartner: (id: string, p: Partial<Partner>) => void;
  deletePartner: (id: string) => void;

  addBrand: (b: Omit<Brand, "id" | "createdAt" | "updatedAt">) => void;
  updateBrand: (id: string, b: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  addSubBrand: (sb: Omit<SubBrand, "id" | "createdAt" | "updatedAt">) => void;
  updateSubBrand: (id: string, sb: Partial<SubBrand>) => void;
  deleteSubBrand: (id: string) => void;

  addTable: (t: Omit<TableConfig, "id" | "createdAt" | "updatedAt">) => void;
  updateTable: (id: string, t: Partial<TableConfig>) => void;
  deleteTable: (id: string) => void;

  addActivity: (action: string, entity: string, entityName: string) => void;
}

export const useStore = create<Store>((set) => ({
  partners: initialPartners,
  brands: initialBrands,
  subBrands: initialSubBrands,
  tables: initialTables,
  activities: initialActivities,

  addPartner: (p) => set((s) => {
    const np: Partner = { ...p, id: genId(), createdAt: now(), updatedAt: now() };
    return { partners: [...s.partners, np], activities: [{ id: genId(), action: "Created", entity: "Partner", entityName: p.name, timestamp: now() }, ...s.activities] };
  }),
  updatePartner: (id, p) => set((s) => ({
    partners: s.partners.map((x) => x.id === id ? { ...x, ...p, updatedAt: now() } : x),
    activities: [{ id: genId(), action: "Updated", entity: "Partner", entityName: p.name || s.partners.find(x => x.id === id)?.name || "", timestamp: now() }, ...s.activities],
  })),
  deletePartner: (id) => set((s) => {
    const name = s.partners.find(x => x.id === id)?.name || "";
    const brandIds = s.brands.filter(b => b.partnerId === id).map(b => b.id);
    const sbIds = s.subBrands.filter(sb => brandIds.includes(sb.brandId)).map(sb => sb.id);
    return {
      partners: s.partners.filter(x => x.id !== id),
      brands: s.brands.filter(b => b.partnerId !== id),
      subBrands: s.subBrands.filter(sb => !brandIds.includes(sb.brandId)),
      tables: s.tables.filter(t => !sbIds.includes(t.subBrandId)),
      activities: [{ id: genId(), action: "Deleted", entity: "Partner", entityName: name, timestamp: now() }, ...s.activities],
    };
  }),

  addBrand: (b) => set((s) => {
    const nb: Brand = { ...b, id: genId(), createdAt: now(), updatedAt: now() };
    return { brands: [...s.brands, nb], activities: [{ id: genId(), action: "Created", entity: "Brand", entityName: b.name, timestamp: now() }, ...s.activities] };
  }),
  updateBrand: (id, b) => set((s) => ({
    brands: s.brands.map((x) => x.id === id ? { ...x, ...b, updatedAt: now() } : x),
    activities: [{ id: genId(), action: "Updated", entity: "Brand", entityName: b.name || s.brands.find(x => x.id === id)?.name || "", timestamp: now() }, ...s.activities],
  })),
  deleteBrand: (id) => set((s) => {
    const name = s.brands.find(x => x.id === id)?.name || "";
    const sbIds = s.subBrands.filter(sb => sb.brandId === id).map(sb => sb.id);
    return {
      brands: s.brands.filter(x => x.id !== id),
      subBrands: s.subBrands.filter(sb => sb.brandId !== id),
      tables: s.tables.filter(t => !sbIds.includes(t.subBrandId)),
      activities: [{ id: genId(), action: "Deleted", entity: "Brand", entityName: name, timestamp: now() }, ...s.activities],
    };
  }),

  addSubBrand: (sb) => set((s) => {
    const nsb: SubBrand = { ...sb, id: genId(), createdAt: now(), updatedAt: now() };
    return { subBrands: [...s.subBrands, nsb], activities: [{ id: genId(), action: "Created", entity: "Sub Brand", entityName: sb.name, timestamp: now() }, ...s.activities] };
  }),
  updateSubBrand: (id, sb) => set((s) => ({
    subBrands: s.subBrands.map((x) => x.id === id ? { ...x, ...sb, updatedAt: now() } : x),
    activities: [{ id: genId(), action: "Updated", entity: "Sub Brand", entityName: sb.name || s.subBrands.find(x => x.id === id)?.name || "", timestamp: now() }, ...s.activities],
  })),
  deleteSubBrand: (id) => set((s) => {
    const name = s.subBrands.find(x => x.id === id)?.name || "";
    return {
      subBrands: s.subBrands.filter(x => x.id !== id),
      tables: s.tables.filter(t => t.subBrandId !== id),
      activities: [{ id: genId(), action: "Deleted", entity: "Sub Brand", entityName: name, timestamp: now() }, ...s.activities],
    };
  }),

  addTable: (t) => set((s) => {
    const nt: TableConfig = { ...t, id: genId(), createdAt: now(), updatedAt: now() };
    return { tables: [...s.tables, nt], activities: [{ id: genId(), action: "Created", entity: "Table", entityName: t.tableNumber, timestamp: now() }, ...s.activities] };
  }),
  updateTable: (id, t) => set((s) => ({
    tables: s.tables.map((x) => x.id === id ? { ...x, ...t, updatedAt: now() } : x),
    activities: [{ id: genId(), action: "Updated", entity: "Table", entityName: t.tableNumber || s.tables.find(x => x.id === id)?.tableNumber || "", timestamp: now() }, ...s.activities],
  })),
  deleteTable: (id) => set((s) => {
    const name = s.tables.find(x => x.id === id)?.tableNumber || "";
    return {
      tables: s.tables.filter(x => x.id !== id),
      activities: [{ id: genId(), action: "Deleted", entity: "Table", entityName: name, timestamp: now() }, ...s.activities],
    };
  }),

  addActivity: (action, entity, entityName) => set((s) => ({
    activities: [{ id: genId(), action, entity, entityName, timestamp: now() }, ...s.activities],
  })),
}));
