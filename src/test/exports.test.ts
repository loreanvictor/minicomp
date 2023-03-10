import {
  define, definable, DefinableCompoennt, PropableElement,
  onConnected, onDisconnected, onAttributeChanged, onAdopted, onRendered,
  onPropertyChanged, currentNode,
  ATTRIBUTE_REMOVED, onAttribute, onProperty, onCleanup, on,
  component, FunctionalComponent, ClassBasedComponent,
} from '../index'


test('stuff are exported properly.', () => {
  expect(define).toBeDefined()
  expect(definable).toBeDefined()
  expect(<DefinableCompoennt>{}).toBeDefined()

  expect(onConnected).toBeDefined()
  expect(onDisconnected).toBeDefined()
  expect(onAttributeChanged).toBeDefined()
  expect(onAdopted).toBeDefined()
  expect(onRendered).toBeDefined()
  expect(onPropertyChanged).toBeDefined()
  expect(currentNode).toBeDefined()

  expect(ATTRIBUTE_REMOVED).toBeDefined()
  expect(onAttribute).toBeDefined()
  expect(onProperty).toBeDefined()
  expect(onCleanup).toBeDefined()
  expect(on).toBeDefined()

  expect(component).toBeDefined()
  expect(<FunctionalComponent>{}).toBeDefined()
  expect(<ClassBasedComponent>{}).toBeDefined()
  expect(<PropableElement>{}).toBeDefined()
})
