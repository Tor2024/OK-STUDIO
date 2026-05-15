import { useState, useEffect } from 'react';

const cache: Record<string, any> = {};

export function preloadItem(collection: string, id: string) {
  const path = `${collection}/${id}.json`;
  if (cache[path]) return;
  fetch(`/data/${path}`)
    .then(r => r.ok ? r.json() : null)
    .then(d => { if (d) cache[path] = d; });
}

export function useData<T>(path: string) {
  const [data, setData] = useState<T | null>(cache[path] || null);
  const [loading, setLoading] = useState(!cache[path]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache[path]) {
      setData(cache[path]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch(`/data/${path}?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { 
        cache[path] = d;
        setData(d); 
        setLoading(false); 
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [path]);

  return { data, loading, error };
}

// Load collection index (list without full content)
export function useCollection<T>(name: string) {
  const { data, loading, error } = useData<T[]>(`${name}/index.json`);
  return { data: data ?? [], loading, error };
}

// Load single item with full content
export function useItem<T>(collection: string, id: string) {
  const { data, loading, error } = useData<T>(`${collection}/${id}.json`);
  return { data, loading, error };
}

export function useSettings() {
  const { data, loading } = useData<Record<string, string>>('settings.json');
  const get = (key: string, fallback: string) => data?.[key] ?? fallback;
  return { settings: data ?? {}, loading, get };
}
