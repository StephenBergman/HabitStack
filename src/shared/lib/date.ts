import dayjs from 'dayjs';

export function formatToday() {
  return dayjs().format('dddd, MMM D');
}
