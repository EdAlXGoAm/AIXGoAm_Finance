
export function getDate(): Date {
  const date = new Date();
  const noTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); 
  return noTimeDate;
}

export function getDatePlusOneDay(): Date {
  const date = getDatePlusDays(getDate(), 1)
  return date
}

export function getDatePlusDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function getDaysBetweenDates(date1: Date, date2: Date): number {
  if (typeof date1 === 'string') {
    date1 = new Date(date1);
  }
  if (typeof date2 === 'string') {
    date2 = new Date(date2);
  }
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function evaluateIfDate2IsGreaterThanDate1(date1: Date, date2: Date): boolean {
  return date2.getTime() > date1.getTime();
}

export function toISOStringLocal(date: Date): string {
  const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
  const dateObj = new Date(date);
  return new Date(dateObj.getTime() - userTimezoneOffset).toISOString();
}

export function toDateLocal(date: string): Date {
  const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
  const dateObj = new Date(date);
  return new Date(dateObj.getTime());
}

export function toDateLocalString(date: Date): string {
  const fullDateString = new Date(date).toISOString();
  const dateObj = toDateLocal(fullDateString);
  return dateObj.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function toTimeLocalString(date: Date): string {
  const fullDateString = new Date(date).toISOString();
  const dateObj = toDateLocal(fullDateString);
  return dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}
