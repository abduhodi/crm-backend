import moment from 'moment';

export function getSelectedDaysFromDate(
  selectedDays: string[],
  fromDate: string,
  toDate: string,
) {
  const startDate = moment(fromDate);
  const endDate = moment(toDate);

  const result = [];

  let current = startDate.clone();

  while (current.isSameOrBefore(endDate, 'day')) {
    const dayName = current.format('dddd').toLowerCase();
    if (selectedDays.includes(dayName)) {
      result.push(current.format('YYYY-MM-DD'));
    }
    current.add(1, 'days');
  }

  return result;
}
