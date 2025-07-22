export function formatTimestampWithHour(timestampStr?: string): string {
  if (!timestampStr) {
    return 'N/A';
  }
  const timestamp = new Date(timestampStr);
  return timestamp.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
