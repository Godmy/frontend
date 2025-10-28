import { writable } from 'svelte/store';

function createOnlineStore() {
  const { subscribe, set } = writable<boolean>(true); // Assume online initially

  if (typeof window !== 'undefined') {
    const setOnlineStatus = () => set(navigator.onLine);

    window.addEventListener('online', setOnlineStatus);
    window.addEventListener('offline', setOnlineStatus);

    // Initial check
    setOnlineStatus();
  }

  return {
    subscribe,
    // No explicit set/update needed as it's driven by browser events
  };
}

export const onlineStore = createOnlineStore();