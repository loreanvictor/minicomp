export interface SSRTemplate {
  hydrateRoot: (node: Node) => void
  create: () => Node
}


export function isSSRTemplate(object: any): object is SSRTemplate {
  return typeof object.hydrate === 'function' && typeof object.create === 'function'
}
