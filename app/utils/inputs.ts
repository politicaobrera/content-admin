import { KeyboardEvent } from 'react'

export function NumericKeyDown(event: KeyboardEvent<HTMLInputElement>) {
  const regex = /^[0-9,]$/;
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
  if (!regex.test(event.key) && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}