COPY users(name, role, age, state) FROM 'C:\Users\Milad\Downloads\CSE135DataGen\DataGen 2\users.txt' DELIMITER ',' CSV;
COPY categories(name, description) FROM 'C:\Users\Milad\Downloads\CSE135DataGen\DataGen 2\categories.txt' DELIMITER ',' CSV;
COPY products(name, sku, category_id, price, is_delete) FROM 'C:\Users\Milad\Downloads\CSE135DataGen\DataGen 2\products.txt' DELIMITER ',' CSV;
COPY orders(user_id, product_id, quantity, price, is_cart) FROM 'C:\Users\Milad\Downloads\CSE135DataGen\DataGen 2\orders.txt' DELIMITER ',' CSV;
