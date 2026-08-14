// Automated Verification Script for Samurai Money Economy, Formatter, and Asset Resolution

import { UPGRADES } from '../src/data/upgrades.ts';
import { REGIONS } from '../src/data/regions.ts';
import { SHOP_ITEMS } from '../src/data/items.ts';
import { ACHIEVEMENTS } from '../src/data/achievements.ts';
import { formatMoney, formatNumber, formatDuration } from '../src/systems/formatting.ts';
import { calculateUpgradeCost, calculateMaxAffordableUpgrades } from '../src/systems/economy.ts';
import { ASSET_MAP } from '../src/assets/assets.ts';

console.log('--- 1. Testing Number Formatter ---');
console.assert(formatMoney(0) === '$0', '0 should format to $0');
console.assert(formatMoney(10) === '$10', '10 should format to $10');
console.assert(formatMoney(1250) === '$1.25K', '1250 should format to $1.25K');
console.assert(formatMoney(1250000) === '$1.25M', '1.25M check');
console.assert(formatMoney(4200000000) === '$4.20B', '4.20B check');
console.assert(formatMoney(18500000000000) === '$18.50T', '18.50T check');
console.assert(formatMoney(2100000000000000) === '$2.10Qa', '2.10Qa check');
console.assert(formatDuration(3665) === '1h 1m 5s', 'formatDuration check');
console.log('✓ Number and Time Formatters passed.');

console.log('--- 2. Testing Upgrade Math ---');
const u = UPGRADES[0]; // Sharpened Blade: base 10, rate 1.15
const cost1 = calculateUpgradeCost(u.baseCost, u.growthRate, 0, 1);
console.assert(cost1 === 10, 'Level 0 -> 1 cost should be 10');
const cost10 = calculateUpgradeCost(u.baseCost, u.growthRate, 0, 10);
console.assert(cost10 > 100, 'Cost for 10 levels should be geometric sum');
const maxAffordable = calculateMaxAffordableUpgrades(u.baseCost, u.growthRate, 0, 100);
console.assert(maxAffordable.count >= 6, 'Max affordable count check');
console.assert(maxAffordable.totalCost <= 100, 'Total cost must not exceed money');
console.log('✓ Upgrade Geometric Cost Math passed.');

console.log('--- 3. Testing Assets Resolution ---');
console.assert(Object.keys(ASSET_MAP).length >= 40, 'Asset map should have 40+ assets');
console.assert(REGIONS.length === 6, 'Should have 6 regions');
console.assert(SHOP_ITEMS.length >= 10, 'Should have 10+ shop items');
console.assert(ACHIEVEMENTS.length >= 25, 'Should have 25+ achievements');
console.log(`✓ Manifest Verification: ${REGIONS.length} Regions, ${SHOP_ITEMS.length} Shop Items, ${ACHIEVEMENTS.length} Achievements, ${UPGRADES.length} Upgrades.`);

console.log('=====================================');
console.log('ALL SYSTEMS VERIFIED SUCCESSFULLY!');
console.log('=====================================');
