import { renderHook, act } from "@testing-library/react"
import useDebouncedValue from "./useDebouncedValue"

describe("useDebouncedValue", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("a"))
    expect(result.current).toBe("a")
  })

  it("does not update before the delay elapses", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: "a" },
    })

    rerender({ value: "b" })
    act(() => {
      jest.advanceTimersByTime(299)
    })

    expect(result.current).toBe("a")
  })

  it("updates to the latest value after the delay elapses", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: "a" },
    })

    rerender({ value: "b" })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe("b")
  })

  it("only reflects the last value when changed rapidly", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: "a" },
    })

    rerender({ value: "b" })
    act(() => {
      jest.advanceTimersByTime(100)
    })
    rerender({ value: "c" })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe("c")
  })
})
