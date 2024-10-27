
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
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function evaluateIfDate2IsGreaterThanDate1(date1: Date, date2: Date): boolean {
  return date2.getTime() > date1.getTime();
}
