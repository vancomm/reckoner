export default function format(totals) {
  return totals.map(({ user, total }) => `${user}:\t${total / 100}`)
    .join('\n');
}
