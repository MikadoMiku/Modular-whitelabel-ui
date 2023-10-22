// componentRegistry.js
const globalComponents: string[] = []

export function registerComponent(name: string) {
  globalComponents.push(name)
}

export function getAllComponents() {
  return globalComponents
}
