export default function html(strings, ...values) {
  return String.raw({ raw: strings }, ...values);
}
