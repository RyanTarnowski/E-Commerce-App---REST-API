
-- DROP TABLE user_cart;
-- DROP TABLE order_detail;
-- DROP TABLE products;
-- DROP TABLE categories;
-- DROP TABLE orders;
-- DROP TABLE users;


CREATE TABLE users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  salt VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_lower_unique 
   ON users (lower(username));

CREATE TABLE orders (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INT NOT NULL REFERENCES users (id),
  status VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100),
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE products (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_id INT NOT NULL REFERENCES categories (id),
  name VARCHAR(100),
  description VARCHAR(500),
  price money,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_details (
  order_id INT NOT NULL REFERENCES orders (id),
  product_id INT NOT NULL REFERENCES products (id),
  qty INT,
  price money,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE user_cart (
  user_id INT NOT NULL REFERENCES users (id),
  product_id INT NOT NULL REFERENCES products (id),
  qty INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id)
);



