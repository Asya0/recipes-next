// 'use client';

// import styles from './FiltersBar.module.scss';
// import { MultiDropdown, CheckBox, Option, Loading } from '@/components';

// export const FiltersBar = () => {
//   const { recipesStore } = useRootStore();

//   const { categories, categoriesLoading, categoriesError } = recipesStore;
//   const selectedCategories = recipesStore.getSelectedCategories();

//   const handleCategoryChange = (options: Option[]) => {
//     const lastSelected = options.length > 0 ? [options[options.length - 1]] : [];
//     const categoryId = lastSelected[0]?.key || null;
//     recipesStore.setFilter('categoryId', categoryId);
//   };

//   const handleVegetarianChange = (checked: boolean) => {
//     recipesStore.setFilter('vegetarian', checked);
//   };

//   if (!recipesStore) {
//     return null;
//   }

//   if (categoriesLoading && !recipesStore.isLoading) {
//     return (
//       <div className={styles['filters-bar']}>
//         <Loading size="s" color="accent" />
//       </div>
//     );
//   }

//   return (
//     <div className={styles['filters-bar']}>
//       <div className={styles['filters-bar__vegetarianRow']}>
//         <CheckBox
//           checked={recipesStore.filters.vegetarian || false}
//           onChange={handleVegetarianChange}
//           disabled={recipesStore.isLoading}
//           className={styles['filters-bar__checkbox']}
//         />
//         Vegetarian
//       </div>

//       <div className={styles['filters-bar__categoryRow']}>
//         <MultiDropdown
//           options={categories}
//           value={selectedCategories}
//           onChange={handleCategoryChange}
//           getTitle={(values) => {
//             if (values.length === 0) return 'Categories';
//             if (values.length === 1) return values[0].value;
//             return `Выбрано: ${values.length}`;
//           }}
//           className={styles['filters-bar__categoryDropdown']}
//         />
//         {categoriesError && (
//           <div className={styles['filters-bar__error']}>Ошибка загрузки категорий</div>
//         )}
//       </div>
//     </div>
//   );
// };

'use client';

import styles from './FiltersBar.module.scss';
import { MultiDropdown, CheckBox, Loading } from '@/components';
import { useCategories } from '@/hooks/useRecipes';

interface FiltersBarProps {
  filters: {
    categoryId: string | null;
    vegetarian: boolean | null;
  };
  onChange: (key: string, value: any) => void;
}

export const FiltersBar = ({ filters, onChange }: FiltersBarProps) => {
  const { data: categories, isLoading, error } = useCategories();

  // Преобразуем категории в формат Option
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
};
