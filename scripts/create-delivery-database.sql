-- Create all necessary tables for the delivery platform
-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'business', 'driver')),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    image_url TEXT,
    is_open BOOLEAN DEFAULT true,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_time_min INTEGER DEFAULT 30,
    delivery_time_max INTEGER DEFAULT 60,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drivers table
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50),
    license_plate VARCHAR(20),
    is_available BOOLEAN DEFAULT false,
    current_lat DECIMAL(10,8),
    current_lng DECIMAL(10,8),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    delivery_address TEXT NOT NULL,
    customer_phone VARCHAR(20),
    payment_method VARCHAR(50) NOT NULL,
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for testing
-- Sample business user
INSERT INTO users (email, password_hash, name, phone, user_type, address) VALUES
('burger@test.com', '$2a$10$example', 'Burger Palace', '+1234567890', 'business', '123 Main St, City'),
('pizza@test.com', '$2a$10$example', 'Pizza Corner', '+1234567891', 'business', '456 Oak Ave, City'),
('customer@test.com', '$2a$10$example', 'John Customer', '+1234567892', 'customer', '789 Pine St, City'),
('driver@test.com', '$2a$10$example', 'Mike Driver', '+1234567893', 'driver', '321 Elm St, City');

-- Sample businesses
INSERT INTO businesses (user_id, business_name, description, address, phone, image_url, delivery_fee, min_order_amount) VALUES
(1, 'Burger Palace', 'Las mejores hamburguesas de la ciudad', '123 Main St, City', '+1234567890', '/placeholder.svg?height=200&width=300', 2.50, 10.00),
(2, 'Pizza Corner', 'Pizza artesanal con ingredientes frescos', '456 Oak Ave, City', '+1234567891', '/placeholder.svg?height=200&width=300', 3.00, 15.00);

-- Sample menu items
INSERT INTO menu_items (business_id, name, description, price, category, image_url) VALUES
(1, 'Hamburguesa Clásica', 'Carne, lechuga, tomate, cebolla y salsa especial', 8.99, 'Hamburguesas', '/placeholder.svg?height=150&width=200'),
(1, 'Papas Fritas', 'Papas crujientes con sal marina', 3.99, 'Acompañamientos', '/placeholder.svg?height=150&width=200'),
(1, 'Coca Cola', 'Bebida refrescante 500ml', 2.50, 'Bebidas', '/placeholder.svg?height=150&width=200'),
(2, 'Pizza Margherita', 'Salsa de tomate, mozzarella y albahaca fresca', 12.99, 'Pizzas', '/placeholder.svg?height=150&width=200'),
(2, 'Pizza Pepperoni', 'Salsa de tomate, mozzarella y pepperoni', 14.99, 'Pizzas', '/placeholder.svg?height=150&width=200');

-- Sample driver
INSERT INTO drivers (user_id, vehicle_type, license_plate, is_available) VALUES
(4, 'Motocicleta', 'ABC-123', true);

-- Create indexes for better performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_business_id ON orders(business_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_menu_items_business_id ON menu_items(business_id);
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
