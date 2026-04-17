import { Partner, Brand, SubBrand, TableConfig, ActivityItem } from "./types";

const now = new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const initialPartners: Partner[] = [
  { id: "p1", name: "Grand Hospitality Group", email: "admin@grandhg.com", username: "grandhg", password: "pass123", address: "100 Park Avenue, New York, NY 10017", contact: "+1 212-555-0100", createdAt: daysAgo(30), updatedAt: daysAgo(2) },
  { id: "p2", name: "Pacific Resorts International", email: "ops@pacificresorts.com", username: "pacificri", password: "pass123", address: "2500 Ocean Blvd, Honolulu, HI 96815", contact: "+1 808-555-0200", createdAt: daysAgo(25), updatedAt: daysAgo(5) },
  { id: "p3", name: "Alpine Lodge Collection", email: "info@alpinelodge.ch", username: "alpinelc", password: "pass123", address: "Bahnhofstrasse 42, 8001 Zürich, Switzerland", contact: "+41 44 555 0300", createdAt: daysAgo(15), updatedAt: daysAgo(1) },
];

export const initialBrands: Brand[] = [
  { id: "b1", partnerId: "p1", name: "The Grand Hotel", location: "Manhattan, NY", address: "100 Park Avenue, New York", contact: "+1 212-555-0110", createdAt: daysAgo(28), updatedAt: daysAgo(3) },
  { id: "b2", partnerId: "p1", name: "Grand Bistro", location: "Brooklyn, NY", address: "45 Court Street, Brooklyn", contact: "+1 718-555-0120", createdAt: daysAgo(20), updatedAt: daysAgo(4) },
  { id: "b3", partnerId: "p2", name: "Pacific Suites", location: "Waikiki, HI", address: "2501 Kalakaua Ave, Honolulu", contact: "+1 808-555-0210", createdAt: daysAgo(22), updatedAt: daysAgo(6) },
  { id: "b4", partnerId: "p3", name: "Alpine Chalet", location: "Zermatt, CH", address: "Kirchstrasse 10, Zermatt", contact: "+41 27 555 0310", createdAt: daysAgo(12), updatedAt: daysAgo(2) },
];

export const initialSubBrands: SubBrand[] = [
  { id: "sb1", brandId: "b1", name: "Grand Rooftop Bar", location: "Floor 40, Manhattan", address: "100 Park Avenue, 40th Floor", contact: "+1 212-555-0111", createdAt: daysAgo(26), updatedAt: daysAgo(5) },
  { id: "sb2", brandId: "b1", name: "Grand Lobby Lounge", location: "Ground Floor, Manhattan", address: "100 Park Avenue, Lobby", contact: "+1 212-555-0112", createdAt: daysAgo(24), updatedAt: daysAgo(3) },
  { id: "sb3", brandId: "b2", name: "Grand Bistro Main", location: "Brooklyn Main", address: "45 Court Street, Main Hall", contact: "+1 718-555-0121", createdAt: daysAgo(18), updatedAt: daysAgo(7) },
  { id: "sb4", brandId: "b3", name: "Pacific Poolside", location: "Pool Deck", address: "2501 Kalakaua Ave, Pool Level", contact: "+1 808-555-0211", createdAt: daysAgo(20), updatedAt: daysAgo(4) },
  { id: "sb5", brandId: "b4", name: "Chalet Dining Room", location: "Main Lodge", address: "Kirchstrasse 10, Main Floor", contact: "+41 27 555 0311", createdAt: daysAgo(10), updatedAt: daysAgo(1) },
];

export const initialTables: TableConfig[] = [
  { id: "t1", subBrandId: "sb1", tableNumber: "R-01", chairCount: 4, createdAt: daysAgo(24), updatedAt: daysAgo(2) },
  { id: "t2", subBrandId: "sb1", tableNumber: "R-02", chairCount: 2, createdAt: daysAgo(24), updatedAt: daysAgo(2) },
  { id: "t3", subBrandId: "sb1", tableNumber: "R-03", chairCount: 6, createdAt: daysAgo(23), updatedAt: daysAgo(1) },
  { id: "t4", subBrandId: "sb2", tableNumber: "L-01", chairCount: 4, createdAt: daysAgo(22), updatedAt: daysAgo(3) },
  { id: "t5", subBrandId: "sb2", tableNumber: "L-02", chairCount: 8, createdAt: daysAgo(22), updatedAt: daysAgo(3) },
  { id: "t6", subBrandId: "sb3", tableNumber: "B-01", chairCount: 4, createdAt: daysAgo(16), updatedAt: daysAgo(5) },
  { id: "t7", subBrandId: "sb3", tableNumber: "B-02", chairCount: 2, createdAt: daysAgo(16), updatedAt: daysAgo(5) },
  { id: "t8", subBrandId: "sb4", tableNumber: "P-01", chairCount: 4, createdAt: daysAgo(18), updatedAt: daysAgo(4) },
  { id: "t9", subBrandId: "sb5", tableNumber: "D-01", chairCount: 6, createdAt: daysAgo(8), updatedAt: daysAgo(1) },
  { id: "t10", subBrandId: "sb5", tableNumber: "D-02", chairCount: 4, createdAt: daysAgo(8), updatedAt: daysAgo(1) },
  { id: "t11", subBrandId: "sb5", tableNumber: "D-03", chairCount: 2, createdAt: daysAgo(7), updatedAt: daysAgo(1) },
];

export const initialActivities: ActivityItem[] = [
  { id: "a1", action: "Created", entity: "Table", entityName: "D-03 at Chalet Dining Room", timestamp: daysAgo(1) },
  { id: "a2", action: "Updated", entity: "Partner", entityName: "Alpine Lodge Collection", timestamp: daysAgo(1) },
  { id: "a3", action: "Created", entity: "Sub Brand", entityName: "Chalet Dining Room", timestamp: daysAgo(2) },
  { id: "a4", action: "Updated", entity: "Brand", entityName: "The Grand Hotel", timestamp: daysAgo(3) },
  { id: "a5", action: "Created", entity: "Table", entityName: "R-03 at Grand Rooftop Bar", timestamp: daysAgo(3) },
  { id: "a6", action: "Updated", entity: "Partner", entityName: "Pacific Resorts International", timestamp: daysAgo(5) },
  { id: "a7", action: "Created", entity: "Brand", entityName: "Alpine Chalet", timestamp: daysAgo(7) },
  { id: "a8", action: "Created", entity: "Partner", entityName: "Alpine Lodge Collection", timestamp: daysAgo(15) },
];
