export default async function fetchAPI(endpoint = '/users/list', method = 'GET', token = '') {
  if (!token) throw new Error('A token must be supplied.');

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*'
    }
  });

  return data;
}