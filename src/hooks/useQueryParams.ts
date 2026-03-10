'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      page: parseInt(searchParams.get('page') || '1', 10),
      category: searchParams.get('category') || '',
      vegetarian: searchParams.get('vegetarian') || '',
      minRating: searchParams.get('minRating') || '',
      maxTime: searchParams.get('maxTime') || '',
    }),
    [searchParams],
  );

  const setParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      const queryString = newParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const setSearch = useCallback(
    (value: string) => {
      setParams({ search: value, page: 1 });
    },
    [setParams],
  );

  const setPage = useCallback(
    (value: number) => {
      setParams({ page: value });
    },
    [setParams],
  );

  const setFilter = useCallback(
    (key: string, value: string) => {
      setParams({ [key]: value, page: 1 });
    },
    [setParams],
  );

  return {
    ...params,
    setSearch,
    setPage,
    setFilter,
    setParams,
  };
};
