import {
  define, definable, DefinableCompoennt,
  onConnected, onDisconnected, onAttributeChanged, onAdopted, onRendered,
  ATTRIBUTE_REMOVED, onAttribute, onCleanup,
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

  expect(ATTRIBUTE_REMOVED).toBeDefined()
  expect(onAttribute).toBeDefined()
  expect(onCleanup).toBeDefined()

  expect(component).toBeDefined()
  expect(<FunctionalComponent>{}).toBeDefined()
  expect(<ClassBasedComponent>{}).toBeDefined()
})
