import { Params } from "../types/requests";

export function buildQueryString(searchParams: Params): string {
  const queryString = Object.entries(searchParams)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        // Si el valor es un array, formatearlo como key=value1&key=value2...
        // probar sino key=value,value2
        return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
      }
      // Formatear key=value
      return `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`;
    })
    .join('&');
  
  return queryString;
}
