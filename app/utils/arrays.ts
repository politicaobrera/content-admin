export function isInArray(arr:any[], key:string, value:any):boolean {
  console.log("key", key)
  console.log("value", value)
  
  const val = arr.find(i => i[key] === value)
  if (val) return true
  return false
}