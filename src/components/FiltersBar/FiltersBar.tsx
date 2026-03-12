'use client';

import { useStore } from '@/stores/RootStore';
import styles from './FiltersBar.module.scss';
import { MultiDropdown, CheckBox, Loading } from '@/components';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

interface FiltersBarProps {
  filters: {
    categoryId: string | null;
    vegetarian: boolean | null;
  };
  onChange: (key: string, value: any) => void;
}

export const FiltersBar = observer(({ filters, onChange }: FiltersBarProps) => {
  const { recipesStore  } = useStore();

  const categories = recipesStore.categories;
  const isLoading = recipesStore.isLoading;
  const error = recipesStore.error;

  useEffect(() => {
    recipesStore.fetchCategories()
  },[recipesStore])

  const categoryOptions = (categories || []).map((cat) => ({
    key: cat.id.toString(),
    value: cat.title || cat.name,
  }));

  const selectedCategories = filters.categoryId
    ? categoryOptions.filter((opt) => opt.key === filters.categoryId)
    : [];

  const handleCategoryChange = (options: typeof categoryOptions) => {
    const lastSelected = options[options.length - 1];
    onChange('categoryId', lastSelected?.key || null);
  };

  const handleVegetarianChange = (checked: boolean) => {
    onChange('vegetarian', checked);
  };

  if (isLoading) {
    return (
      <div className={styles['filters-bar']}>
        <Loading size="s" color="accent" />
      </div>
    );
  }

  return (
    <div className={styles['filters-bar']}>
      <div className={styles['filters-bar__vegetarianRow']}>
        <CheckBox
          checked={filters.vegetarian || false}
          onChange={handleVegetarianChange}
          className={styles['filters-bar__checkbox']}
        />
        <span>Vegetarian</span>
      </div>

      <div className={styles['filters-bar__categoryRow']}>
        <MultiDropdown
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleCategoryChange}
          getTitle={(values) => {
            if (values.length === 0) return 'Categories';
            if (values.length === 1) return values[0].value;
            return `Выбрано: ${values.length}`;
          }}
          className={styles['filters-bar__categoryDropdown']}
        />
        {error && <div className={styles['filters-bar__error']}>Ошибка загрузки категорий</div>}
      </div>
    </div>
  );
});
