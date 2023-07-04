import {
  define, definable, DefinableCompoent, PropableElement,
  onConnected, onDisconnected, onAttributeChanged, onAdopted, onRendered,
  onPropertyChanged, currentNode, hooksMeta, ownerDocument,
  ATTRIBUTE_REMOVED, onAttribute, onProperty, onCleanup, on,
  component, FunctionalComponent, ClassBasedComponent,
  useDispatch, onHydrated, onFirstRender,
} from '../index'


test('stuff are exported properly.', () => {
  expect(define).toBeDefined()
  expect(definable).toBeDefined()
  expect(<DefinableCompoent>{}).toBeDefined()

  expect(onConnected).toBeDefined()
  expect(onDisconnected).toBeDefined()
  expect(onAttributeChanged).toBeDefined()
  expect(onAdopted).toBeDefined()
  expect(onRendered).toBeDefined()
  expect(onPropertyChanged).toBeDefined()
  expect(currentNode).toBeDefined()
  expect(hooksMeta).toBeDefined()
  expect(ownerDocument).toBeDefined()

  expect(ATTRIBUTE_REMOVED).toBeDefined()
  expect(onAttribute).toBeDefined()
  expect(onProperty).toBeDefined()
  expect(onCleanup).toBeDefined()
  expect(on).toBeDefined()
  expect(useDispatch).toBeDefined()
  expect(onHydrated).toBeDefined()
  expect(onFirstRender).toBeDefined()

  expect(component).toBeDefined()
  expect(<FunctionalComponent>{}).toBeDefined()
  expect(<ClassBasedComponent>{}).toBeDefined()
  expect(<PropableElement>{}).toBeDefined()
})
