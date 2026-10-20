// Zero-dependency event bus. Exists so api/client.ts (which needs to react to
// 401s) and store/authStore.ts (which owns the user/token state) can talk to
// each other without importing one another and creating a circular import
// (client -> store -> endpoints -> client).
type Listener = () => void;
const listeners = new Set<Listener>();

export function onSessionExpired(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitSessionExpired() {
  listeners.forEach((listener) => listener());
}
