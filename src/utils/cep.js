import { apiURL } from "./env";

export default async function cep(cep, token) {
  const res = await fetch(`${apiURL}/cep/${cep}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}
