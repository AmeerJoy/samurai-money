// Standalone Automated Verification Script

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

function formatMoney(amount) {
  if (isNaN(amount) || amount === 0) return '$0';
  if (amount < 1000) return `$${amount}`;
  const tier = Math.floor(Math.log10(Math.abs(amount)) / 3);
  const scale = Math.pow(10, tier * 3);
  const scaled = amount / scale;
  let formatted = scaled >= 100 ? scaled.toFixed(1).replace(/\.0$/, '') : scaled.toFixed(2).replace(/\.?0+$/, '');
  return `$${formatted}${SUFFIXES[tier] || ''}`;
}

function calculateUpgradeCost(baseCost, growthRate, currentLevel, count = 1) {
  if (count <= 0) return 0;
  if (count === 1) return Math.floor(baseCost * Math.pow(growthRate, currentLevel));
  const firstTermCost = baseCost * Math.pow(growthRate, currentLevel);
  const totalCost = firstTermCost * (Math.pow(growthRate, count) - 1) / (growthRate - 1);
  return Math.floor(totalCost);
}

function calculateMaxAffordableUpgrades(baseCost, growthRate, currentLevel, currentMoney) {
  if (currentMoney <= 0) return { count: 0, totalCost: 0 };
  const firstCost = calculateUpgradeCost(baseCost, growthRate, currentLevel, 1);
  if (currentMoney < firstCost) return { count: 0, totalCost: 0 };
  const r = growthRate;
  const term = 1 + (currentMoney * (r - 1)) / firstCost;
  let count = Math.floor(Math.log(term) / Math.log(r));
  if (count <= 0) count = 1;
  let totalCost = calculateUpgradeCost(baseCost, growthRate, currentLevel, count);
  while (totalCost > currentMoney && count > 0) {
    count--;
    totalCost = calculateUpgradeCost(baseCost, growthRate, currentLevel, count);
  }
  return { count, totalCost };
}

console.log('=== TEST 1: NUMBER FORMATTER ===');
console.log('0 ->', formatMoney(0));
console.log('10 ->', formatMoney(10));
console.log('1250 ->', formatMoney(1250));
console.log('1250000 ->', formatMoney(1250000));
console.log('4200000000 ->', formatMoney(4200000000));
console.log('18500000000000 ->', formatMoney(18500000000000));
console.log('2100000000000000 ->', formatMoney(2100000000000000));

if (formatMoney(1250) !== '$1.25K') throw new Error('1250 failed');
if (formatMoney(1250000) !== '$1.25M') throw new Error('1.25M failed');
if (formatMoney(4200000000) !== '$4.2B') throw new Error('4.2B failed');
if (formatMoney(18500000000000) !== '$18.5T') throw new Error('18.5T failed');
if (formatMoney(2100000000000000) !== '$2.1Qa') throw new Error('2.1Qa failed');

console.log('=== TEST 2: UPGRADE EXPONENTIAL & BUY MAX FORMULAS ===');
const cost1 = calculateUpgradeCost(10, 1.15, 0, 1);
const cost10 = calculateUpgradeCost(10, 1.15, 0, 10);
const maxAfford = calculateMaxAffordableUpgrades(10, 1.15, 0, 100);

console.log('Cost 1 (Level 0):', cost1);
console.log('Cost 10 (Level 0):', cost10);
console.log('Max affordable with $100:', maxAfford);

if (cost1 !== 10) throw new Error('cost1 failed');
if (cost10 <= 100) throw new Error('cost10 failed');
if (maxAfford.count < 5 || maxAfford.totalCost > 100) throw new Error('maxAfford failed');

console.log('====================================================');
console.log('SUCCESS: ALL CORE LOGIC AND ECONOMY MATH VERIFIED!');
console.log('====================================================');
