function genererMenuCategories(works) {
  //utiliser un set pour avoir des catégories unique
  const categoriesSet = new Set(works.map((work) => work.category.name));

  const menuCategoriesElement = document.querySelector(".menu-categories");
}
