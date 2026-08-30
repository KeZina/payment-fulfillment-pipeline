export type ItemCategorySlug =
  | "pizza"
  | "burger"
  | "sushi"
  | "pasta"
  | "salad"
  | "taco"
  | "mexican"
  | "curry"
  | "ramen"
  | "rice"
  | "steak"
  | "seafood"
  | "soup"
  | "breakfast"
  | "dessert"
  | "drink"
  | "sandwich"
  | "bread"
  | "banh-mi"
  | "banh-xeo";

export type CatalogEntry = {
  name: string;
  description: string;
  price: string;
  categorySlug: ItemCategorySlug;
};

export const CATEGORY_DEFINITIONS: ReadonlyArray<{
  slug: ItemCategorySlug;
  label: string;
  fileName: string;
}> = [
  { slug: "pizza", label: "Pizza", fileName: "pizza.png" },
  { slug: "burger", label: "Burger", fileName: "burger.png" },
  { slug: "sushi", label: "Sushi", fileName: "sushi.png" },
  { slug: "pasta", label: "Pasta", fileName: "pasta.png" },
  { slug: "salad", label: "Salad", fileName: "salad.png" },
  { slug: "taco", label: "Taco", fileName: "taco.png" },
  { slug: "mexican", label: "Mexican", fileName: "mexican.png" },
  { slug: "curry", label: "Curry", fileName: "curry.png" },
  { slug: "ramen", label: "Ramen", fileName: "ramen.png" },
  { slug: "rice", label: "Rice bowl", fileName: "rice.png" },
  { slug: "steak", label: "Steak", fileName: "steak.png" },
  { slug: "seafood", label: "Seafood", fileName: "seafood.png" },
  { slug: "soup", label: "Soup", fileName: "soup.png" },
  { slug: "breakfast", label: "Breakfast", fileName: "breakfast.png" },
  { slug: "dessert", label: "Dessert", fileName: "dessert.png" },
  { slug: "drink", label: "Drink", fileName: "drink.png" },
  { slug: "sandwich", label: "Sandwich", fileName: "sandwich.png" },
  { slug: "bread", label: "Bread", fileName: "bread.png" },
  { slug: "banh-mi", label: "Banh mi", fileName: "banh-mi.png" },
  { slug: "banh-xeo", label: "Banh xeo", fileName: "banh-xeo.png" },
];

export const CATALOG: CatalogEntry[] = [
  {
    name: "Classic Margherita Pizza",
    description: "Wood-fired pizza with tomato, mozzarella, and fresh basil.",
    price: "12.99",
    categorySlug: "pizza",
  },
  {
    name: "Spicy Pepperoni Pizza",
    description:
      "Crispy pizza topped with pepperoni, mozzarella, and chili oil.",
    price: "15.49",
    categorySlug: "pizza",
  },
  {
    name: "Truffle Mushroom Pizza",
    description:
      "Creamy mushroom pizza finished with truffle oil and parmesan.",
    price: "17.99",
    categorySlug: "pizza",
  },
  {
    name: "Crispy Chicken Burger",
    description: "Golden fried chicken, lettuce, tomato, and house sauce.",
    price: "13.99",
    categorySlug: "burger",
  },
  {
    name: "Classic Cheeseburger",
    description: "Beef patty with cheddar, pickles, onions, and burger sauce.",
    price: "14.49",
    categorySlug: "burger",
  },
  {
    name: "Bacon BBQ Burger",
    description: "Beef burger with smoked bacon, cheddar, and barbecue sauce.",
    price: "16.99",
    categorySlug: "burger",
  },
  {
    name: "Salmon Sushi Platter",
    description: "Assorted salmon nigiri and maki rolls served with soy sauce.",
    price: "22.99",
    categorySlug: "sushi",
  },
  {
    name: "Spicy Tuna Roll",
    description:
      "Tuna, cucumber, sesame, and spicy mayonnaise wrapped in nori.",
    price: "13.99",
    categorySlug: "sushi",
  },
  {
    name: "Dragon Roll",
    description: "Shrimp tempura roll topped with avocado and sweet eel sauce.",
    price: "18.49",
    categorySlug: "sushi",
  },
  {
    name: "Creamy Chicken Alfredo",
    description:
      "Fettuccine pasta with grilled chicken and parmesan cream sauce.",
    price: "16.99",
    categorySlug: "pasta",
  },
  {
    name: "Spaghetti Bolognese",
    description: "Spaghetti served with slow-cooked beef and tomato ragù.",
    price: "15.99",
    categorySlug: "pasta",
  },
  {
    name: "Penne Arrabbiata",
    description: "Penne pasta with spicy tomato sauce, garlic, and parsley.",
    price: "13.49",
    categorySlug: "pasta",
  },
  {
    name: "Pesto Tagliatelle",
    description:
      "Fresh tagliatelle tossed with basil pesto and toasted pine nuts.",
    price: "14.99",
    categorySlug: "pasta",
  },
  {
    name: "Caesar Salad",
    description:
      "Romaine lettuce, parmesan, croutons, and creamy Caesar dressing.",
    price: "10.99",
    categorySlug: "salad",
  },
  {
    name: "Grilled Chicken Salad",
    description:
      "Mixed greens with grilled chicken, avocado, and lemon dressing.",
    price: "13.99",
    categorySlug: "salad",
  },
  {
    name: "Mediterranean Greek Salad",
    description: "Tomatoes, cucumber, olives, feta, and oregano vinaigrette.",
    price: "11.49",
    categorySlug: "salad",
  },
  {
    name: "Beef Tacos",
    description:
      "Soft tortillas filled with seasoned beef, salsa, and avocado.",
    price: "12.99",
    categorySlug: "taco",
  },
  {
    name: "Baja Fish Tacos",
    description: "Crispy fish tacos with cabbage slaw and chipotle crema.",
    price: "14.99",
    categorySlug: "taco",
  },
  {
    name: "Chicken Quesadilla",
    description:
      "Grilled tortilla filled with chicken, melted cheese, and peppers.",
    price: "11.99",
    categorySlug: "mexican",
  },
  {
    name: "Beef Burrito",
    description:
      "Large tortilla filled with beef, rice, beans, salsa, and cheese.",
    price: "13.49",
    categorySlug: "mexican",
  },
  {
    name: "Chicken Tikka Masala",
    description: "Roasted chicken in a rich tomato, cream, and spice sauce.",
    price: "17.99",
    categorySlug: "curry",
  },
  {
    name: "Vegetable Curry",
    description:
      "Seasonal vegetables simmered in a fragrant coconut curry sauce.",
    price: "14.99",
    categorySlug: "curry",
  },
  {
    name: "Chicken Biryani",
    description:
      "Basmati rice layered with spiced chicken, saffron, and herbs.",
    price: "16.99",
    categorySlug: "curry",
  },
  {
    name: "Thai Green Curry",
    description: "Chicken, vegetables, and Thai basil in a creamy green curry.",
    price: "16.49",
    categorySlug: "curry",
  },
  {
    name: "Teriyaki Chicken Bowl",
    description: "Grilled chicken, steamed rice, broccoli, and teriyaki glaze.",
    price: "14.49",
    categorySlug: "rice",
  },
  {
    name: "Beef Ramen",
    description:
      "Japanese noodle soup with beef, egg, scallions, and mushrooms.",
    price: "15.99",
    categorySlug: "ramen",
  },
  {
    name: "Spicy Miso Ramen",
    description:
      "Miso broth with ramen noodles, chili oil, corn, and soft egg.",
    price: "16.49",
    categorySlug: "ramen",
  },
  {
    name: "Vegetable Pad Thai",
    description:
      "Rice noodles with vegetables, peanuts, lime, and tamarind sauce.",
    price: "13.99",
    categorySlug: "rice",
  },
  {
    name: "Shrimp Fried Rice",
    description: "Wok-fried rice with shrimp, egg, vegetables, and scallions.",
    price: "15.49",
    categorySlug: "rice",
  },
  {
    name: "Grilled Ribeye Steak",
    description:
      "Juicy ribeye steak served with herb butter and roasted vegetables.",
    price: "28.99",
    categorySlug: "steak",
  },
  {
    name: "Garlic Butter Prawns",
    description:
      "Pan-seared prawns with garlic butter, lemon, and fresh herbs.",
    price: "19.99",
    categorySlug: "seafood",
  },
  {
    name: "Fish and Chips",
    description: "Crispy battered fish served with fries and tartar sauce.",
    price: "15.99",
    categorySlug: "seafood",
  },
  {
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon, dill, and seasonal vegetables.",
    price: "21.99",
    categorySlug: "seafood",
  },
  {
    name: "Tomato Basil Soup",
    description: "Smooth roasted tomato soup finished with basil and cream.",
    price: "8.99",
    categorySlug: "soup",
  },
  {
    name: "Creamy Mushroom Soup",
    description: "Comforting soup made with wild mushrooms, cream, and thyme.",
    price: "9.49",
    categorySlug: "soup",
  },
  {
    name: "Avocado Toast",
    description:
      "Sourdough toast topped with avocado, chili flakes, and poached egg.",
    price: "10.99",
    categorySlug: "breakfast",
  },
  {
    name: "Buttermilk Pancakes",
    description:
      "Fluffy pancakes served with berries, butter, and maple syrup.",
    price: "9.99",
    categorySlug: "breakfast",
  },
  {
    name: "Belgian Waffle",
    description:
      "Crisp waffle topped with fresh fruit, cream, and maple syrup.",
    price: "10.49",
    categorySlug: "breakfast",
  },
  {
    name: "Chocolate Brownie",
    description: "Warm fudgy brownie served with vanilla ice cream.",
    price: "7.99",
    categorySlug: "dessert",
  },
  {
    name: "New York Cheesecake",
    description: "Classic dense cheesecake with a buttery biscuit base.",
    price: "8.49",
    categorySlug: "dessert",
  },
  {
    name: "Strawberry Shortcake",
    description: "Vanilla sponge layered with strawberries and whipped cream.",
    price: "8.99",
    categorySlug: "dessert",
  },
  {
    name: "Chocolate Lava Cake",
    description:
      "Warm chocolate cake with a molten center and vanilla ice cream.",
    price: "9.49",
    categorySlug: "dessert",
  },
  {
    name: "Salted Caramel Ice Cream",
    description: "Creamy caramel ice cream with sea salt and caramel pieces.",
    price: "6.99",
    categorySlug: "dessert",
  },
  {
    name: "Mango Smoothie",
    description: "Refreshing smoothie made with ripe mango, yogurt, and lime.",
    price: "6.49",
    categorySlug: "drink",
  },
  {
    name: "Berry Smoothie",
    description: "Mixed berries blended with banana, yogurt, and honey.",
    price: "6.49",
    categorySlug: "drink",
  },
  {
    name: "Cappuccino",
    description: "Espresso with steamed milk and a thick layer of foam.",
    price: "4.49",
    categorySlug: "drink",
  },
  {
    name: "Iced Caramel Latte",
    description: "Chilled espresso with milk, ice, and caramel syrup.",
    price: "5.49",
    categorySlug: "drink",
  },
  {
    name: "Garlic Herb Focaccia",
    description: "Soft Italian bread baked with olive oil, garlic, and herbs.",
    price: "6.99",
    categorySlug: "bread",
  },
  {
    name: "Caprese Sandwich",
    description: "Ciabatta filled with mozzarella, tomato, basil, and pesto.",
    price: "11.49",
    categorySlug: "sandwich",
  },
  {
    name: "Roast Beef Sandwich",
    description:
      "Sliced roast beef with cheddar, caramelized onions, and mustard.",
    price: "13.49",
    categorySlug: "sandwich",
  },
  {
    name: "Classic Banh Mi",
    description:
      "Crisp Vietnamese baguette with grilled pork, pate, pickled vegetables, and cilantro.",
    price: "11.99",
    categorySlug: "banh-mi",
  },
  {
    name: "Sizzling Banh Xeo",
    description:
      "Golden turmeric crepe with shrimp, pork, bean sprouts, and fresh herbs.",
    price: "13.99",
    categorySlug: "banh-xeo",
  },
];

export const VARIANT_PREFIXES = [
  "Signature",
  "House",
  "Chef's",
  "Market",
  "Daily",
  "Seasonal",
  "Premium",
  "Classic",
] as const;

export const VARIANT_SUFFIXES = [
  "",
  " Bowl",
  " Plate",
  " Combo",
  " Special",
  " Deluxe",
  " Lite",
  " Family",
] as const;

export const TARGET_ITEM_COUNT = 200;

export const OUT_OF_STOCK_ITEM_NAMES = new Set([
  "Truffle Mushroom Pizza",
  "Salmon Sushi Platter",
  "Pesto Tagliatelle",
  "Chicken Biryani",
  "Grilled Ribeye Steak",
  "New York Cheesecake",
  "Iced Caramel Latte",
]);

export function buildCatalogEntry(index: number): CatalogEntry {
  const base = CATALOG[index % CATALOG.length];
  const cycle = Math.floor(index / CATALOG.length);

  if (cycle === 0) {
    return base;
  }

  const prefix = VARIANT_PREFIXES[(cycle - 1) % VARIANT_PREFIXES.length];
  const suffix = VARIANT_SUFFIXES[(cycle - 1) % VARIANT_SUFFIXES.length];

  return {
    name: `${prefix} ${base.name}${suffix}`,
    description: base.description,
    price: (Number(base.price) + cycle * 0.5).toFixed(2),
    categorySlug: base.categorySlug,
  };
}

export function buildDiscount(index: number): string | undefined {
  if (index % 4 !== 0) {
    return undefined;
  }

  const discountTiers = ["0.10", "0.15", "0.20", "0.25"];
  return discountTiers[(index / 4) % discountTiers.length];
}
