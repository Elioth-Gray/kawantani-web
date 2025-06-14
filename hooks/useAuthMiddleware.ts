'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { validateToken } from '@/api/authApi';

export const useAuthMiddleware = (allowedRoles: string[]) => {
  const [loading, setLoading] = useState(true); // ← true saat awal

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        window.location.replace('/auth/login');
        return;
      }

      const result = await validateToken();

      if (!result.valid) {
        localStorage.removeItem('accessToken');
        window.location.replace('/auth/login');
        return;
      }

      if (!allowedRoles.includes(result.user.role)) {
        if (
          allowedRoles.includes('admin') ||
          allowedRoles.includes('facilitator')
        ) {
          window.location.replace('/auth/super');
        } else {
          window.location.replace('/auth/login');
        }
        return;
      }

      setLoading(false); // ✅ selesai cek
    };

    check();
  }, []);

  return loading; // true = masih loading
};
