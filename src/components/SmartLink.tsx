import { Link, LinkProps } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'; // Assuming they use react-query or I can implement manual prefetch
// Wait, they use a custom useItem hook. I should check how it works.

// Looking at src/hooks/useData.ts to see if I can trigger a pre-fetch.
import { preloadItem } from '../hooks/useData';

interface SmartLinkProps extends LinkProps {
  prefetch?: 'project' | 'insight' | 'landing';
  itemId?: string;
}

export default function SmartLink({ prefetch, itemId, children, ...props }: SmartLinkProps) {
  const handleMouseEnter = () => {
    if (prefetch && itemId) {
      // Logic to trigger prefetch
      preloadItem(prefetch === 'project' ? 'projects' : prefetch === 'insight' ? 'insights' : 'landings', itemId);
    }
  };

  return (
    <Link {...props} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
}
