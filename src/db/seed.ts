"use server";
import { db } from "./index";
import { item } from "./schemas/item-schema";
import type { Item } from "@/types/item";

const image = (lock: number) =>
  `https://loremflickr.com/640/480/food?lock=${lock}`;

const items: Omit<Item, "id">[] = [
  {
    name: "Classic Margherita Pizza",
    description: "Wood-fired pizza with tomato, mozzarella, and fresh basil.",
    price: "12.99",
  },
  {
    name: "Spicy Pepperoni Pizza",
    description:
      "Crispy pizza topped with pepperoni, mozzarella, and chili oil.",
    price: "15.49",
  },
  {
    name: "Truffle Mushroom Pizza",
    description:
      "Creamy mushroom pizza finished with truffle oil and parmesan.",
    price: "17.99",
  },
  {
    name: "Crispy Chicken Burger",
    description: "Golden fried chicken, lettuce, tomato, and house sauce.",
    price: "13.99",
  },
  {
    name: "Classic Cheeseburger",
    description: "Beef patty with cheddar, pickles, onions, and burger sauce.",
    price: "14.49",
  },
  {
    name: "Bacon BBQ Burger",
    description: "Beef burger with smoked bacon, cheddar, and barbecue sauce.",
    price: "16.99",
  },
  {
    name: "Salmon Sushi Platter",
    description: "Assorted salmon nigiri and maki rolls served with soy sauce.",
    price: "22.99",
  },
  {
    name: "Spicy Tuna Roll",
    description:
      "Tuna, cucumber, sesame, and spicy mayonnaise wrapped in nori.",
    price: "13.99",
  },
  {
    name: "Dragon Roll",
    description: "Shrimp tempura roll topped with avocado and sweet eel sauce.",
    price: "18.49",
  },
  {
    name: "Creamy Chicken Alfredo",
    description:
      "Fettuccine pasta with grilled chicken and parmesan cream sauce.",
    price: "16.99",
  },
  {
    name: "Spaghetti Bolognese",
    description: "Spaghetti served with slow-cooked beef and tomato ragù.",
    price: "15.99",
  },
  {
    name: "Penne Arrabbiata",
    description: "Penne pasta with spicy tomato sauce, garlic, and parsley.",
    price: "13.49",
  },
  {
    name: "Pesto Tagliatelle",
    description:
      "Fresh tagliatelle tossed with basil pesto and toasted pine nuts.",
    price: "14.99",
  },
  {
    name: "Caesar Salad",
    description:
      "Romaine lettuce, parmesan, croutons, and creamy Caesar dressing.",
    price: "10.99",
  },
  {
    name: "Grilled Chicken Salad",
    description:
      "Mixed greens with grilled chicken, avocado, and lemon dressing.",
    price: "13.99",
  },
  {
    name: "Mediterranean Greek Salad",
    description: "Tomatoes, cucumber, olives, feta, and oregano vinaigrette.",
    price: "11.49",
  },
  {
    name: "Beef Tacos",
    description:
      "Soft tortillas filled with seasoned beef, salsa, and avocado.",
    price: "12.99",
  },
  {
    name: "Baja Fish Tacos",
    description: "Crispy fish tacos with cabbage slaw and chipotle crema.",
    price: "14.99",
  },
  {
    name: "Chicken Quesadilla",
    description:
      "Grilled tortilla filled with chicken, melted cheese, and peppers.",
    price: "11.99",
  },
  {
    name: "Beef Burrito",
    description:
      "Large tortilla filled with beef, rice, beans, salsa, and cheese.",
    price: "13.49",
  },
  {
    name: "Chicken Tikka Masala",
    description: "Roasted chicken in a rich tomato, cream, and spice sauce.",
    price: "17.99",
  },
  {
    name: "Vegetable Curry",
    description:
      "Seasonal vegetables simmered in a fragrant coconut curry sauce.",
    price: "14.99",
  },
  {
    name: "Chicken Biryani",
    description:
      "Basmati rice layered with spiced chicken, saffron, and herbs.",
    price: "16.99",
  },
  {
    name: "Thai Green Curry",
    description: "Chicken, vegetables, and Thai basil in a creamy green curry.",
    price: "16.49",
  },
  {
    name: "Teriyaki Chicken Bowl",
    description: "Grilled chicken, steamed rice, broccoli, and teriyaki glaze.",
    price: "14.49",
  },
  {
    name: "Beef Ramen",
    description:
      "Japanese noodle soup with beef, egg, scallions, and mushrooms.",
    price: "15.99",
  },
  {
    name: "Spicy Miso Ramen",
    description:
      "Miso broth with ramen noodles, chili oil, corn, and soft egg.",
    price: "16.49",
  },
  {
    name: "Vegetable Pad Thai",
    description:
      "Rice noodles with vegetables, peanuts, lime, and tamarind sauce.",
    price: "13.99",
  },
  {
    name: "Shrimp Fried Rice",
    description: "Wok-fried rice with shrimp, egg, vegetables, and scallions.",
    price: "15.49",
  },
  {
    name: "Grilled Ribeye Steak",
    description:
      "Juicy ribeye steak served with herb butter and roasted vegetables.",
    price: "28.99",
  },
  {
    name: "Garlic Butter Prawns",
    description:
      "Pan-seared prawns with garlic butter, lemon, and fresh herbs.",
    price: "19.99",
  },
  {
    name: "Fish and Chips",
    description: "Crispy battered fish served with fries and tartar sauce.",
    price: "15.99",
  },
  {
    name: "Grilled Salmon",
    description: "Atlantic salmon with lemon, dill, and seasonal vegetables.",
    price: "21.99",
  },
  {
    name: "Tomato Basil Soup",
    description: "Smooth roasted tomato soup finished with basil and cream.",
    price: "8.99",
  },
  {
    name: "Creamy Mushroom Soup",
    description: "Comforting soup made with wild mushrooms, cream, and thyme.",
    price: "9.49",
  },
  {
    name: "Avocado Toast",
    description:
      "Sourdough toast topped with avocado, chili flakes, and poached egg.",
    price: "10.99",
  },
  {
    name: "Buttermilk Pancakes",
    description:
      "Fluffy pancakes served with berries, butter, and maple syrup.",
    price: "9.99",
  },
  {
    name: "Belgian Waffle",
    description:
      "Crisp waffle topped with fresh fruit, cream, and maple syrup.",
    price: "10.49",
  },
  {
    name: "Chocolate Brownie",
    description: "Warm fudgy brownie served with vanilla ice cream.",
    price: "7.99",
  },
  {
    name: "New York Cheesecake",
    description: "Classic dense cheesecake with a buttery biscuit base.",
    price: "8.49",
  },
  {
    name: "Strawberry Shortcake",
    description: "Vanilla sponge layered with strawberries and whipped cream.",
    price: "8.99",
  },
  {
    name: "Chocolate Lava Cake",
    description:
      "Warm chocolate cake with a molten center and vanilla ice cream.",
    price: "9.49",
  },
  {
    name: "Salted Caramel Ice Cream",
    description: "Creamy caramel ice cream with sea salt and caramel pieces.",
    price: "6.99",
  },
  {
    name: "Mango Smoothie",
    description: "Refreshing smoothie made with ripe mango, yogurt, and lime.",
    price: "6.49",
  },
  {
    name: "Berry Smoothie",
    description: "Mixed berries blended with banana, yogurt, and honey.",
    price: "6.49",
  },
  {
    name: "Cappuccino",
    description: "Espresso with steamed milk and a thick layer of foam.",
    price: "4.49",
  },
  {
    name: "Iced Caramel Latte",
    description: "Chilled espresso with milk, ice, and caramel syrup.",
    price: "5.49",
  },
  {
    name: "Garlic Herb Focaccia",
    description: "Soft Italian bread baked with olive oil, garlic, and herbs.",
    price: "6.99",
  },
  {
    name: "Caprese Sandwich",
    description: "Ciabatta filled with mozzarella, tomato, basil, and pesto.",
    price: "11.49",
  },
  {
    name: "Roast Beef Sandwich",
    description:
      "Sliced roast beef with cheddar, caramelized onions, and mustard.",
    price: "13.49",
  },
].map(({ name, description, price }, index) => ({
  name,
  description,
  price,
  imageUrl: image(index + 1),
}));

async function seed() {
  await db.insert(item).values(items).onConflictDoNothing();
  console.log(`Seeded ${items.length} items.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Failed to seed items:", error);
  process.exitCode = 1;
});
