type Listener<T> = (value: T) => void;

export const createSignal = <T,>(initial: T) => {
  let value = initial;
  const listeners = new Set<Listener<T>>();
  return {
    get: () => value,
    set: (next: T) => {
      if (Object.is(next, value)) return;
      value = next;
      for (const l of listeners) l(value);
    },
    subscribe: (l: Listener<T>) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
};

export type Pointer = { coarse: boolean; reduced: boolean };

export const env: Pointer = {
  coarse:
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches,
  reduced:
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

export const isMobile = () =>
  env.coarse || (typeof window !== 'undefined' && window.innerWidth < 768);
