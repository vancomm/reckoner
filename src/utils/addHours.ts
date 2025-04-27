const HOURS_IN_MS = 60 * 60 * 1000;

export default function addHours(date: Date, hours: number): Date {
    const added = new Date(date);
    added.setTime(added.getTime() + hours * HOURS_IN_MS);
    return added;
}
