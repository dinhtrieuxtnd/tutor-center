'use client';

import { Provider } from 'react-redux';
import { useEffect, useRef } from 'react';
import { store } from './store';
import { initializeAuth } from './features';

export function Providers({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      console.log('🎉 Provider mounted, initializing auth...');
      // Khởi tạo auth state và fetch user info từ API
      store.dispatch(initializeAuth());
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
