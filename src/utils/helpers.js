export function getExcerpt(string, wordLimit = 8) {
  let words = string.split(' ');
  let excerpt = words.slice(0, wordLimit).join(' ').replaceAll('&nbsp;', '');
  if (words.length > 8) excerpt += '…';
  return excerpt;
}