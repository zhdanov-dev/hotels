const getDatePeriod = (dateFrom: string, dateTo: string, bookingDateFrom: string, bookingDateTo: string): boolean => {
  let res = false;
  if (
    dateFrom === dateTo &&
    bookingDateFrom === bookingDateTo &&
    dateFrom === bookingDateFrom
  ) {
    res = true;
  }
  let d1 = bookingDateFrom.split('.');
  let d2 = bookingDateTo.split('.');
  let cFrom = String(dateFrom).split('.');
  let cTo = String(dateTo).split('.');

  const from = new Date(Number(d1[2]), parseInt(d1[1]) - 1, Number(d1[0]));
  const to = new Date(Number(d2[2]), parseInt(d2[1]) - 1, Number(d2[0]));
  const checksFrom = new Date(
    Number(cFrom[2]),
    parseInt(cFrom[1]) - 1,
    Number(cFrom[0])
  );
  const checksTo = new Date(
    Number(cTo[2]),
    parseInt(cTo[1]) - 1,
    Number(cTo[0])
  );
  if (
    (checksFrom >= from && checksFrom <= to) ||
    (checksTo >= from && checksTo <= to) ||
    (from >= checksFrom && from <= checksTo) ||
    (to >= checksFrom && to <= checksTo)
  ) {
    res = true;
  }
  return res
};

export default getDatePeriod
