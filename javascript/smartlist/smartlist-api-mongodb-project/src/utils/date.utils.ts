export function getFormattedDate(): string {
  const d = new Date(),
    dformat =
      [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') +
      ' ' +
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
  return dformat;
}

export function getDateAtSOD(date: Date): Date {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}

export function getDateAtEOD(date: Date): Date {
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  return date;
}

export function getISOFormattedDateAtSOD(d: Date): string {
  return getISOFormattedDate(d) + ' 00:00:00';
}

export function getISOFormattedDateAtEOD(d: Date): string {
  return getISOFormattedDate(d) + ' 23:59:59';
}

export function getISOFormattedDate(d: Date): string {
  const year: number = d.getFullYear();
  const month: string =
    d.getMonth() + 1 <= 9 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1);
  const day: string = d.getDate() <= 9 ? '0' + d.getDate() : '' + d.getDate();

  return year + '-' + month + '-' + day;
}

export function getDateFromISOFormattedDate(isoDate: string): string {
  const date: Date = new Date(isoDate);
  const year: any = date.getFullYear();
  let month: any = date.getMonth() + 1;
  let day: any = date.getDate();

  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return month + '/' + day + '/' + year;
}

export function getDateInISOFormattedDate(date: Date): string {
  const year: any = date.getFullYear();
  let month: any = date.getMonth() + 1;
  let day: any = date.getDate();

  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return day + '/' + month + '/' + year;
}

export function getEpochStartDate(): Date {
  return new Date(1970, 0, 1);
}
