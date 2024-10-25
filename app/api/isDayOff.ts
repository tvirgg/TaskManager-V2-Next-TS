const API_URL = 'https://isdayoff.ru/api/getdata';

export const getMonthlyHolidays = async (
  year: number,
  month: number,
  countryCode = 'ru'
): Promise<number[]> => {
  const response = await fetch(
    `${API_URL}?year=${year}&month=${month}&cc=${countryCode}&delimeter=%0A`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch holidays');
  }
  const data = await response.text();
  return data
    .split('\n')
    .map((day, index) => (day === '1' ? index + 1 : null))
    .filter((day) => day !== null) as number[];
};
