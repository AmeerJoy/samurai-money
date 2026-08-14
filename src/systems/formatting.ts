// Number and Time Formatting Utilities for Samurai Money

const SUFFIXES = [
  '',
  'K',   // Thousand
  'M',   // Million
  'B',   // Billion
  'T',   // Trillion
  'Qa',  // Quadrillion
  'Qi',  // Quintillion
  'Sx',  // Sextillion
  'Sp',  // Septillion
  'Oc',  // Octillion
  'No',  // Nonillion
  'Dc',  // Decillion
  'Ud',  // Undecillion
  'Dd',  // Duodecillion
  'Td',  // Tredecillion
  'Qad', // Quattuordecillion
  'Qid', // Quindecillion
  'Sxd', // Sexdecillion
  'Spd', // Septendecillion
  'Ocd', // Octodecillion
  'Nod', // Novemdecillion
  'Vg'   // Vigintillion
];

/**
 * Format money with $ prefix and standard abbreviations
 * e.g., formatMoney(1250) => "$1.25K"
 * e.g., formatMoney(1250000) => "$1.25M"
 */
export function formatMoney(amount: number, format: 'standard' | 'scientific' = 'standard'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0';
  }

  if (amount < 0) {
    return `-$${formatNumber(Math.abs(amount), format)}`;
  }

  return `$${formatNumber(amount, format)}`;
}

/**
 * Format raw number with abbreviation or scientific notation
 */
export function formatNumber(value: number, format: 'standard' | 'scientific' = 'standard'): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }

  if (value === 0) return '0';

  if (format === 'scientific' && value >= 1000000) {
    return value.toExponential(2).replace('e+', 'e');
  }

  if (value < 1000) {
    return Math.floor(value).toLocaleString('en-US');
  }

  const tier = Math.floor(Math.log10(Math.abs(value)) / 3);

  if (tier < SUFFIXES.length) {
    const scale = Math.pow(10, tier * 3);
    const scaled = value / scale;
    
    // Stable decimal formatting to prevent jumping/shaking during rapid income ticks
    let formatted: string;
    if (scaled >= 100) {
      formatted = scaled.toFixed(1);
    } else {
      formatted = scaled.toFixed(2);
    }

    return `${formatted}${SUFFIXES[tier]}`;
  }

  // Fallback to exponential for astronomical numbers
  return value.toExponential(2).replace('e+', 'e');
}

/**
 * Format integer count (clicks, upgrades, etc.)
 */
export function formatCount(count: number): string {
  return formatNumber(count, 'standard');
}

/**
 * Format income per second e.g. "+$125 / sec" or "+$18.4K / sec"
 */
export function formatPerSecond(amount: number, format: 'standard' | 'scientific' = 'standard'): string {
  return `+${formatMoney(amount, format)} / sec`;
}

/**
 * Format income per click e.g. "+$125 per click"
 */
export function formatPerClick(amount: number, format: 'standard' | 'scientific' = 'standard'): string {
  return `+${formatMoney(amount, format)} / click`;
}

/**
 * Format duration in seconds to human readable string
 * e.g., formatDuration(13342) => "3h 42m 22s"
 */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / 3600) % 24);
  const days = Math.floor(totalSeconds / 86400);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
