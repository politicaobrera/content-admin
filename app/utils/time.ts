export function calculateDuration(started_at: string, completed_at: string): number | null {
  const startDate = new Date(started_at);
  const completedDate = new Date(completed_at);
  if (isNaN(startDate.getTime()) || isNaN(completedDate.getTime())) {
    return null;
  }
  const duration = completedDate.getTime() - startDate.getTime();
  return duration/1000;
}