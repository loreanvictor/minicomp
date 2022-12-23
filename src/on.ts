import { currentNode } from './hooks'


export function on<EventName extends keyof HTMLElementEventMap>(
  event: EventName,
  fn: (_: HTMLElementEventMap[EventName]) => void,
)
export function on(event: string, fn: (_: Event) => void)
export function on(event: string, fn: (_: Event) => void) {
  currentNode()?.addEventListener(event, fn)
}
