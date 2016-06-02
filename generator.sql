COPY states(name) FROM 'C:\Users\Milad\Downloads\Project3_DataGen\DataGen\states.txt' DELIMITER ',' CSV;
COPY users(name, role, age, state_id) FROM 'C:\Users\Milad\Downloads\Project3_DataGen\DataGen\users.txt' DELIMITER ',' CSV;
COPY categories(name, description) FROM 'C:\Users\Milad\Downloads\Project3_DataGen\DataGen\categories.txt' DELIMITER ',' CSV;
COPY products(name, sku, category_id, price, is_delete) FROM 'C:\Users\Milad\Downloads\Project3_DataGen\DataGen\products.txt' DELIMITER ',' CSV;
COPY orders(user_id, product_id, quantity, price, is_cart) FROM 'C:\Users\Milad\Downloads\Project3_DataGen\DataGen\orders.txt' DELIMITER ',' CSV;
