const ARGENTINA_TIME_ZONE = 'America/Argentina/Buenos_Aires'

// Formatea una fecha (string ISO o Date) como dd/mm/aaaa, fijando siempre la
// timezone argentina -- evita que el locale/timezone del navegador del usuario
// (o del entorno donde corre el código) corra el día mostrado.
export function formatArgDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('es-AR', { timeZone: ARGENTINA_TIME_ZONE })
}

// Hoy (medianoche) en timezone argentina, como YYYY-MM-DD -- apto para comparar
// contra el campo `date` de eventos sin que la timezone del cliente lo desfase.
export function todayArgDateInput(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: ARGENTINA_TIME_ZONE })
}

// YYYY-MM-DD del día calendario en Argentina que representa este ISO de evento --
// comparable lexicográficamente contra todayArgDateInput().
export function toArgDateInput(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-CA', { timeZone: ARGENTINA_TIME_ZONE })
}
