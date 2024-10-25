DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM users;
DELETE FROM products;
DELETE FROM units;
DELETE FROM categories;
DELETE FROM sections;
DELETE FROM stores;

INSERT INTO stores (store_name, latitude, longitude, city) VALUES
('Downtown Supermarket', '40.7128', '-74.0060', 'Gdansk'),
('Uptown Grocery', '40.7831', '73.9712', 'Gdansk'),
('Midtown Market', '40.7549', '73.9840', 'Gdansk'),
('East Side Shop', '40.7614', '73.9776', 'Gdansk'),
('West End Store', '40.7736', '73.9566', 'Gdansk');

-- Sections (20 examples)
INSERT INTO sections (section_name, store_id) VALUES
('Produce', 1), ('Dairy', 1), ('Bakery', 1), ('Meat & Seafood', 1), ('Frozen Foods', 1),
('Beverages', 2), ('Snacks', 2), ('Household', 2), ('Personal Care', 2), ('Pet Supplies', 2),
('Canned & Jarred', 3), ('Condiments & Sauces', 3), ('Grains & Pasta', 3), ('Baking Supplies', 3), ('International Foods', 3),
('Health & Wellness', 4), ('Baby Care', 4), ('Office Supplies', 4), ('Electronics', 4), ('Outdoor Living', 5);


-- Units (10 examples)
INSERT INTO units (unit_name, unit_symbol) VALUES
('Piece', 'pc'), ('Pound', 'lb'), ('Ounce', 'oz'), ('Gram', 'g'), ('Kilogram', 'kg'),
('Liter', 'L'), ('Milliliter', 'mL'), ('Gallon', 'gal'), ('Count', 'ct'), ('Pack', 'pk');

-- Categories (30 examples)
INSERT INTO categories (category_name, section_id) VALUES
('Fruits', 1), ('Vegetables', 1), ('Organic Produce', 1), ('Exotic Fruits', 1), ('Fresh Herbs', 1),
('Milk & Eggs', 2), ('Cheese', 2), ('Yogurt', 2), ('Butter & Margarine', 2), ('Cream & Creamer', 2),
('Bread', 3), ('Pastries', 3), ('Cakes', 3), ('Cookies', 3), ('Pies & Tarts', 3),
('Beef', 4), ('Poultry', 4), ('Seafood', 4), ('Pork', 4), ('Deli Meats', 4),
('Frozen Meals', 5), ('Frozen Desserts', 5), ('Frozen Vegetables', 5), ('Frozen Fruits', 5), ('Ice Cream', 5),
('Juice', 6), ('Soda', 6), ('Water', 6), ('Coffee & Tea', 6), ('Energy Drinks', 6);

-- Products (40 examples)
INSERT INTO products (name, description, price, category_id, availability, amount, unit_id) VALUES
('Apples', 'Fresh Gala Apples', 2.99, 1, 'In Stock', 10, 2),
('Bananas', 'Ripe Yellow Bananas', 0.79, 1, 'In Stock', 20, 2),
('Oranges', 'Juicy Navel Oranges', 3.49, 1, 'In Stock', 15, 2),
('Grapes', 'Red Seedless Grapes', 4.99, 1, 'In Stock', 5, 2),
('Strawberries', 'Fresh Strawberries', 5.99, 1, 'In Stock', 2, 1),
('Carrots', 'Whole Carrots', 1.99, 2, 'In Stock', 10, 3),
('Broccoli', 'Fresh Broccoli Crowns', 2.49, 2, 'In Stock', 8, 2),
('Spinach', 'Baby Spinach Leaves', 3.99, 2, 'In Stock', 6, 1),
('Tomatoes', 'Vine-Ripened Tomatoes', 2.99, 2, 'In Stock', 12, 2),
('Zucchini', 'Fresh Zucchini', 1.49, 2, 'In Stock', 15, 2),
('Whole Milk', 'Pasteurized Whole Milk', 3.99, 6, 'In Stock', 20, 6),
('Cheddar Cheese', 'Sharp Cheddar Cheese', 4.99, 7, 'In Stock', 10, 2),
('Greek Yogurt', 'Plain Greek Yogurt', 2.99, 8, 'In Stock', 15, 6),
('Butter', 'Unsalted Butter', 3.49, 9, 'In Stock', 12, 2),
('Sour Cream', 'Full-Fat Sour Cream', 2.29, 10, 'In Stock', 8, 6),
('Sourdough Bread', 'Artisan Sourdough Bread', 5.99, 11, 'In Stock', 6, 1),
('Croissants', 'Buttery Croissants', 3.99, 12, 'In Stock', 10, 4),
('Chocolate Cake', 'Moist Chocolate Cake', 19.99, 13, 'In Stock', 2, 1),
('Peanut Butter Cookies', 'Homemade Peanut Butter Cookies', 4.99, 14, 'In Stock', 20, 4),
('Apple Pie', 'Fresh-Baked Apple Pie', 12.99, 15, 'In Stock', 4, 1),
('Ground Beef', 'Lean Ground Beef', 6.99, 16, 'In Stock', 8, 2),
('Chicken Breasts', 'Boneless, Skinless Chicken Breasts', 4.99, 17, 'In Stock', 12, 2),
('Salmon Fillets', 'Fresh Atlantic Salmon Fillets', 9.99, 18, 'In Stock', 6, 2),
('Pork Chops', 'Bone-In Pork Chops', 7.49, 19, 'In Stock', 10, 2),
('Turkey Slices', 'Smoked Turkey Deli Slices', 5.99, 20, 'In Stock', 8, 2),
('Frozen Pizza', 'Pepperoni Frozen Pizza', 6.99, 21, 'In Stock', 15, 1),
('Ice Cream Sandwiches', 'Vanilla Ice Cream Sandwiches', 4.99, 22, 'In Stock', 20, 4),
('Mixed Vegetables', 'Frozen Mixed Vegetables', 3.49, 23, 'In Stock', 10, 2),
('Strawberry Smoothie', 'Frozen Strawberry Smoothie', 2.99, 24, 'In Stock', 12, 6),
('Vanilla Ice Cream', 'Premium Vanilla Ice Cream', 5.99, 25, 'In Stock', 8, 1),
('Orange Juice', 'Pulp-Free Orange Juice', 3.99, 26, 'In Stock', 16, 6),
('Cola', 'Classic Cola Soda', 1.99, 27, 'In Stock', 24, 6),
('Bottled Water', 'Purified Drinking Water', 2.49, 28, 'In Stock', 30, 6),
('Coffee Beans', 'Whole Bean Coffee', 8.99, 29, 'In Stock', 6, 2),
('Energy Drink', 'Citrus-Flavored Energy Drink', 2.79, 30, 'In Stock', 18, 6),
('Pineapple', 'Sweet Pineapple', 3.99, 1, 'In Stock', 8, 2),
('Mangoes', 'Ripe Mangoes', 2.99, 1, 'In Stock', 10, 2),
('Watermelon', 'Juicy Watermelon', 5.99, 1, 'In Stock', 1, 2),
('Blueberries', 'Fresh Blueberries', 4.99, 1, 'In Stock', 6, 1),
('Lettuce', 'Crisp Lettuce', 1.99, 1, 'In Stock', 12, 2),
('Mushrooms', 'Fresh Mushrooms', 2.49, 2, 'In Stock', 8, 2),
('Cauliflower', 'Fresh Cauliflower', 2.99, 2, 'In Stock', 6, 1),
('Onions', 'Yellow Onions', 1.99, 2, 'In Stock', 10, 2),
('Bell Peppers', 'Assorted Bell Peppers', 3.49, 2, 'In Stock', 5, 2),
('Potatoes', 'Russet Potatoes', 2.99, 2, 'In Stock', 15, 2),
('Almond Milk', 'Unsweetened Almond Milk', 3.99, 6, 'In Stock', 10, 6),
('Mozzarella Cheese', 'Fresh Mozzarella Cheese', 4.99, 7, 'In Stock', 8, 2),
('Vanilla Yogurt', 'Vanilla Flavored Yogurt', 2.99, 8, 'In Stock', 12, 6),
('Margarine', 'Salted Margarine', 2.49, 9, 'In Stock', 10, 2),
('Whipped Cream', 'Sweetened Whipped Cream', 1.99, 10, 'In Stock', 6, 6),
('Bagels', 'Fresh Bagels', 3.99, 11, 'In Stock', 4, 1),
('Muffins', 'Assorted Muffins', 2.99, 12, 'In Stock', 8, 4),
('Red Velvet Cake', 'Decadent Red Velvet Cake', 19.99, 13, 'In Stock', 2, 1),
('Chocolate Chip Cookies', 'Classic Chocolate Chip Cookies', 4.99, 14, 'In Stock', 15, 4),
('Pecan Pie', 'Homemade Pecan Pie', 12.99, 15, 'In Stock', 3, 1),
('Ground Turkey', 'Lean Ground Turkey', 5.99, 16, 'In Stock', 6, 2),
('Chicken Wings', 'Chicken Wings', 4.99, 17, 'In Stock', 10, 2),
('Shrimp', 'Fresh Shrimp', 9.99, 18, 'In Stock', 4, 2),
('Bacon', 'Smoked Bacon', 7.49, 19, 'In Stock', 8, 2),
('Ham', 'Sliced Ham', 5.99, 20, 'In Stock', 6, 2),
('Frozen Burritos', 'Assorted Frozen Burritos', 3.99, 21, 'In Stock', 12, 1),
('Sorbet', 'Assorted Sorbet Flavors', 4.99, 22, 'In Stock', 10, 4),
('Corn', 'Frozen Corn', 2.49, 23, 'In Stock', 8, 2),
('Mango Smoothie', 'Frozen Mango Smoothie', 2.99, 24, 'In Stock', 6, 6),
('Chocolate Ice Cream', 'Rich Chocolate Ice Cream', 5.99, 25, 'In Stock', 4, 1),
('Grape Juice', 'Concord Grape Juice', 3.99, 26, 'In Stock', 8, 6),
('Root Beer', 'Classic Root Beer Soda', 1.99, 27, 'In Stock', 12, 6),
('Sparkling Water', 'Flavored Sparkling Water', 2.49, 28, 'In Stock', 15, 6),
('Green Tea', 'Loose Leaf Green Tea', 8.99, 29, 'In Stock', 6, 2),
('Sports Drink', 'Electrolyte Sports Drink', 2.79, 30, 'In Stock', 10, 6),
('Peaches', 'Juicy Peaches', 3.99, 1, 'In Stock', 8, 2),
('Plums', 'Sweet Plums', 2.99, 1, 'In Stock', 10, 2),
('Kiwi', 'Fresh Kiwi', 1.99, 1, 'In Stock', 12, 2),
('Raspberries', 'Fresh Raspberries', 4.99, 1, 'In Stock', 6, 1),
('Cabbage', 'Green Cabbage', 1.99, 2, 'In Stock', 10, 2),
('Asparagus', 'Fresh Asparagus', 2.99, 2, 'In Stock', 6, 1),
('Garlic', 'Fresh Garlic', 1.99, 2, 'In Stock', 12, 2),
('Cucumbers', 'English Cucumbers', 2.49, 2, 'In Stock', 8, 2),
('Sweet Potatoes', 'Sweet Potatoes', 2.99, 2, 'In Stock', 10, 2),
('Coconut Milk', 'Unsweetened Coconut Milk', 3.99, 6, 'In Stock', 10, 6),
('Swiss Cheese', 'Swiss Cheese Slices', 4.99, 7, 'In Stock', 8, 2),
('Strawberry Yogurt', 'Strawberry Flavored Yogurt', 2.99, 8, 'In Stock', 12, 6),
('Olive Oil', 'Extra Virgin Olive Oil', 5.99, 9, 'In Stock', 6, 6),
('Mayonnaise', 'Classic Mayonnaise', 2.49, 10, 'In Stock', 8, 6),
('Organic Apples', 'Fresh Organic Gala Apples', 3.99, 3, 'In Stock', 10, 2),
('Organic Bananas', 'Ripe Organic Bananas', 1.29, 3, 'In Stock', 20, 2),
('Organic Oranges', 'Juicy Organic Navel Oranges', 4.99, 3, 'In Stock', 15, 2),
('Organic Grapes', 'Red Seedless Organic Grapes', 6.99, 3, 'In Stock', 5, 2),
('Organic Strawberries', 'Fresh Organic Strawberries', 7.99, 3, 'In Stock', 2, 1),
('Organic Carrots', 'Organic Whole Carrots', 2.99, 3, 'In Stock', 10, 3),
('Organic Broccoli', 'Fresh Organic Broccoli Crowns', 3.49, 3, 'In Stock', 8, 2),
('Organic Spinach', 'Organic Baby Spinach Leaves', 4.99, 3, 'In Stock', 6, 1),
('Organic Tomatoes', 'Organic Vine-Ripened Tomatoes', 3.99, 3, 'In Stock', 12, 2),
('Organic Zucchini', 'Fresh Organic Zucchini', 2.49, 3, 'In Stock', 15, 2),
('Dragon Fruit', 'Exotic Dragon Fruit', 6.99, 4, 'In Stock', 5, 2),
('Mangosteen', 'Tropical Mangosteen', 7.99, 4, 'In Stock', 4, 2),
('Durian', 'King of Fruits', 9.99, 4, 'In Stock', 2, 2),
('Rambutan', 'Sweet Rambutan', 4.99, 4, 'In Stock', 6, 1),
('Lychee', 'Juicy Lychee', 3.99, 4, 'In Stock', 8, 2),
('Passion Fruit', 'Tart Passion Fruit', 5.99, 4, 'In Stock', 3, 1),
('Jackfruit', 'Tropical Jackfruit', 8.99, 4, 'In Stock', 2, 2),
('Papaya', 'Sweet Papaya', 3.99, 4, 'In Stock', 6, 2),
('Guava', 'Tropical Guava', 4.99, 4, 'In Stock', 5, 2),
('Basil', 'Fresh Basil Leaves', 1.99, 5, 'In Stock', 5, 1),
('Cilantro', 'Fresh Cilantro Leaves', 0.99, 5, 'In Stock', 5, 1),
('Parsley', 'Fresh Parsley Leaves', 0.99, 5, 'In Stock', 5, 1),
('Rosemary', 'Fresh Rosemary Sprigs', 1.49, 5, 'In Stock', 5, 1),
('Thyme', 'Fresh Thyme Sprigs', 1.49, 5, 'In Stock', 5, 1),
('Dill', 'Fresh Dill Leaves', 0.99, 5, 'In Stock', 5, 1),
('Mint', 'Fresh Mint Leaves', 1.49, 5, 'In Stock', 5, 1),
('Oregano', 'Fresh Oregano Leaves', 0.99, 5, 'In Stock', 5, 1),
('Sage', 'Fresh Sage Leaves', 1.49, 5, 'In Stock', 5, 1),
('Chives', 'Fresh Chives', 0.99, 5, 'In Stock', 5, 1);



-- Users (5 examples)
INSERT INTO users (email, password, first_name, last_name) VALUES
('john.doe@example.com', 'password123', 'John', 'Doe'),
('jane.smith@example.com', 'qwerty456', 'Jane', 'Smith'),
('michael.johnson@example.com', 'abc123', 'Michael', 'Johnson'),
('emily.davis@example.com', 'pass321', 'Emily', 'Davis'),
('robert.wilson@example.com', 'secure123', 'Robert', 'Wilson');

-- Carts (5 examples)
INSERT INTO carts (user_id) VALUES
(1), (2), (3), (4), (5);

-- Cart Items (50 examples)
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 3), (1, 2, 1), (1, 6, 2), (1, 11, 1), (1, 16, 1),
(2, 3, 2), (2, 7, 1), (2, 12, 1), (2, 17, 2), (2, 22, 1),
(3, 4, 1), (3, 8, 1), (3, 13, 2), (3, 18, 1), (3, 23, 1),
(4, 5, 1), (4, 9, 2), (4, 14, 3), (4, 19, 1), (4, 24, 2),
(5, 10, 1), (5, 15, 1), (5, 20, 2), (5, 25, 1), (5, 26, 2),
(1, 27, 4), (1, 28, 1), (1, 29, 2), (1, 1, 3), (2, 21, 1),
(2, 1, 2), (2, 1, 1), (2, 1, 1), (3, 1, 2), (3, 1, 1),
(3, 36, 3), (4, 1, 1), (4, 1, 2), (4, 1, 1), (5, 1, 2),
(5, 1, 2), (5, 6, 1), (1, 11, 1), (1, 16, 2), (2, 21, 1),
(2, 26, 1), (3, 1, 1), (3, 36, 2), (4, 5, 2), (4, 10, 1);