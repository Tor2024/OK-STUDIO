import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — OK Studio` : 'OK Studio';
    return () => { document.title = 'OK Studio'; };
  }, [title]);
}
