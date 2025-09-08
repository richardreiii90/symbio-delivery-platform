-- Crear todas las tablas necesarias para la aplicación de delivery
-- Eliminar tablas existentes si existen (para evitar conflictos)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL DEFAULT 'customer', -- 'customer', 'business', 'driver'
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de negocios
CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    category VARCHAR(100),
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    minimum_order DECIMAL(10,2) DEFAULT 0,
    is_open BOOLEAN DEFAULT true,
    opening_hours JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de items del menú
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de pedidos
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    delivery_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de items de pedidos
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de repartidores
CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50),
    license_plate VARCHAR(20),
    is_available BOOLEAN DEFAULT false,
    current_location JSONB,
    rating DECIMAL(3,2) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba
INSERT INTO users (email, name, password_hash, user_type, phone, address) VALUES
('cliente@test.com', 'Cliente Test', 'hash123', 'customer', '123456789', 'Calle 123, Ciudad'),
('burger@test.com', 'Burger Palace', 'hash123', 'business', '987654321', 'Av. Principal 456, Ciudad'),
('pizza@test.com', 'Pizza Express', 'hash123', 'business', '555666777', 'Calle Comercial 789, Ciudad'),
('driver@test.com', 'Juan Repartidor', 'hash123', 'driver', '111222333', 'Zona Centro, Ciudad');

INSERT INTO businesses (user_id, name, description, address, phone, category, delivery_fee, minimum_order) VALUES
(2, 'Burger Palace', 'Las mejores hamburguesas de la ciudad', 'Av. Principal 456, Ciudad', '987654321', 'Comida Rápida', 2.50, 10.00),
(3, 'Pizza Express', 'Pizzas artesanales y deliciosas', 'Calle Comercial 789, Ciudad', '555666777', 'Pizzería', 3.00, 15.00);

INSERT INTO menu_items (business_id, name, description, price, category, is_available) VALUES
(1, 'Hamburguesa Clásica', 'Carne, lechuga, tomate, cebolla y salsa especial', 8.50, 'Hamburguesas', true),
(1, 'Hamburguesa Doble', 'Doble carne con queso y bacon', 12.00, 'Hamburguesas', true),
(1, 'Papas Fritas', 'Papas crujientes con sal', 3.50, 'Acompañamientos', true),
(2, 'Pizza Margherita', 'Tomate, mozzarella y albahaca', 14.00, 'Pizzas', true),
(2, 'Pizza Pepperoni', 'Tomate, mozzarella y pepperoni', 16.50, 'Pizzas', true),
(2, 'Gaseosa', 'Bebida refrescante 500ml', 2.00, 'Bebidas', true);

INSERT INTO drivers (user_id, vehicle_type, license_plate, is_available) VALUES
(4, 'Motocicleta', 'ABC-123', true);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_business_id ON orders(business_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_menu_items_business_id ON menu_items(business_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

SELECT 'Base de datos configurada exitosamente' as resultado;
