export type Author = {
    _id? : string,
    name: string,
    contact: {phone: string, email: string},
    descriptions?: string[]
}