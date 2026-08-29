import { buildQueryString } from './query'

describe('buildQueryString', () => {
  it('builds a query string from simple key/value pairs', () => {
    expect(buildQueryString({ name: 'tag-name', page: "2" })).toBe('name=tag-name&page=2')
  })

  it('repeats the key for array values', () => {
    expect(buildQueryString({ tags: ['a', 'b'] })).toBe('tags=a&tags=b')
  })

  it('omits undefined values', () => {
    expect(buildQueryString({ name: 'tag-name', page: undefined })).toBe('name=tag-name')
  })

  it('url-encodes keys and values', () => {
    expect(buildQueryString({ 'a b': 'c&d' })).toBe('a%20b=c%26d')
  })
})
