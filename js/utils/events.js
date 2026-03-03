export function createEmitter() {
  const listeners = new Map();

  return {
    on(eventName, callback) {
      const bucket = listeners.get(eventName) ?? [];
      bucket.push(callback);
      listeners.set(eventName, bucket);

      return () => {
        const next = (listeners.get(eventName) ?? []).filter((listener) => listener !== callback);
        listeners.set(eventName, next);
      };
    },
    emit(eventName, payload) {
      for (const listener of listeners.get(eventName) ?? []) {
        listener(payload);
      }
    },
  };
}
