const CategoryPill = ({ category ,onCategoryClick, activeCategory}) => {
    const isActive = activeCategory === category;
  return (
    // category based style
    <div className={` text-[15px] font-medium whitespace-nowrap rounded-lg px-3 py-1 ${isActive ? 'bg-black text-white hover:bg-neutral-950 dark:bg-white dark:text-black' : 'bg-neutral-200 text-black hover:bg-neutral-300 dark:text-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600'} cursor-pointer`}  onClick={() => onCategoryClick(category)} >{category}</div>
  )
}

export default CategoryPill