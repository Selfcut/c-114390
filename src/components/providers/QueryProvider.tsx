
import { ReactQueryProvider } from './ReactQueryProvider';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  );
}
