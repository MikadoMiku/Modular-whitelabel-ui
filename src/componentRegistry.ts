// componentRegistry.js
interface RegisteredComponent {
  logicalName: string
  userViewableName: string
}

const globalComponents: RegisteredComponent[] = []

export function registerComponent(component: RegisteredComponent) {
  globalComponents.push(component)
}

export function getAllComponents() {
  return globalComponents
}
