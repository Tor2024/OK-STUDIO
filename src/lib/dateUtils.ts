export function parseMonthYear(dateStr: string): number {
  if (!dateStr) return 0;
  
  const months: Record<string, number> = {
    'JAN': 0, 'FEB': 1, 'MRZ': 2, 'MAR': 2, 'APR': 3, 'MAI': 4, 'MAY': 4, 'JUN': 5, 
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OKT': 9, 'OCT': 9, 'NOV': 10, 'DEZ': 11, 'DEC': 11
  };

  const parts = dateStr.toUpperCase().split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] ?? 0;
    const year = parseInt(parts[1], 10) || 2025;
    return new Date(year, month, 1).getTime();
  }
  
  // Try fallback for ISO dates
  const timestamp = Date.parse(dateStr);
  return isNaN(timestamp) ? 0 : timestamp;
}
