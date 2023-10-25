export function getSelectedDaysFromDate(
  selectedDays: string[],
  fromDate: string,
  number_of_lessons: number,
) {
  const current = new Date(fromDate);
  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const result = [];

  while (result.length < number_of_lessons) {
    const day = daysOfWeek[current.getDay()];
    if (selectedDays.includes(day)) {
      result.push(current.toISOString());
    }
    current.setDate(current.getDate() + 1);
  }
  return result;
}
