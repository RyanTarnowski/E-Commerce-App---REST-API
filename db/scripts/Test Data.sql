INSERT INTO categories (name, description) VALUES ('Category1', 'Desc1');
INSERT INTO categories (name, description) VALUES ('Category2', 'Desc1');

INSERT INTO products (name, category_id, description, price) VALUES ('Product1', 1, 'Desc1', 9.99);
INSERT INTO products (name, category_id, description, price) VALUES ('Product2', 1, 'Desc2', 19.99);
INSERT INTO products (name, category_id, description, price) VALUES ('Product3', 2, 'Desc3', 92.99);
INSERT INTO products (name, category_id, description, price) VALUES ('Product4', 2, 'Desc4', 94.99);



SELECT * FROM categories;

SELECT * FROM products;

SELECT * FROM users;

SELECT * FROM user_cart;

SELECT * FROM orders;

SELECT * FROM order_details;




SELECT orders.id, orders.user_id, orders.status, orders.created_at, products.name, products.description, order_details.qty, 
	SUM(order_details.price * order_details.qty) AS total
FROM orders
INNER JOIN order_details ON order_details.order_id = orders.id
INNER JOIN products ON order_details.product_id = products.id
WHERE user_id = 1
GROUP BY orders.id, orders.user_id, orders.status, orders.created_at, products.name, products.description, order_details.qty;



SELECT orders.id, orders.user_id, orders.status, orders.created_at, COUNT(*) AS items_in_order, SUM(order_details.price * order_details.qty) AS total
FROM orders
INNER JOIN order_details ON order_details.order_id = orders.id
INNER JOIN products ON order_details.product_id = products.id
WHERE user_id = 1
GROUP BY orders.id, orders.user_id, orders.status, orders.created_at;




