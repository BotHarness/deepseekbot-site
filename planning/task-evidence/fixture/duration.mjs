/** Convert an H:MM / HH:MM duration under 24 hours to whole minutes. */
export function parseDuration(value) {
  if (typeof value !== 'string' || !/^\d{1,2}:\d{2}$/u.test(value)) {
    throw new TypeError('Expected H:MM or HH:MM');
  }
  const [hours, minutes] = value.split(':').map(Number);
  if (hours > 23 || minutes > 59) {
    throw new RangeError('Duration must be between 0:00 and 23:59');
  }
  return hours * 60 + minutes;
}
