-- Execute the database setup script
-- This will create all necessary tables for the delivery platform

-- First, let's check if tables exist and create them
DO $$
BEGIN
    -- Create users table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            phone TEXT,
            user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'business', 'delivery')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create businesses table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'businesses') THEN
        CREATE TABLE businesses (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            business_name TEXT NOT NULL,
            description TEXT,
            address TEXT NOT NULL,
            phone TEXT NOT NULL,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            is_active BOOLEAN DEFAULT true,
            commission_rate DECIMAL(5, 2) DEFAULT 10.00,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create delivery_drivers table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'delivery_drivers') THEN
        CREATE TABLE delivery_drivers (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_type TEXT NOT NULL,
            license_plate TEXT,
            is_available BOOLEAN DEFAULT false,
            current_latitude DECIMAL(10, 8),
            current_longitude DECIMAL(11, 8),
            rating DECIMAL(3, 2) DEFAULT 5.00,
            total_deliveries INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create categories table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
        CREATE TABLE categories (
            id TEXT PRIMARY KEY,
            business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            description TEXT,
            is_active BOOLEAN DEFAULT true,
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create menu_items table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'menu_items') THEN
        CREATE TABLE menu_items (
            id TEXT PRIMARY KEY,
            business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
            category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            image_url TEXT,
            is_available BOOLEAN DEFAULT true,
            preparation_time INTEGER DEFAULT 15,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create orders table (THIS IS THE MISSING TABLE)
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
        CREATE TABLE orders (
            id TEXT PRIMARY KEY,
            customer_id TEXT NOT NULL REFERENCES users(id),
            business_id TEXT NOT NULL REFERENCES businesses(id),
            delivery_driver_id TEXT REFERENCES delivery_drivers(id),
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
            subtotal DECIMAL(10, 2) NOT NULL,
            delivery_fee DECIMAL(10, 2) NOT NULL,
            total DECIMAL(10, 2) NOT NULL,
            delivery_address TEXT NOT NULL,
            delivery_latitude DECIMAL(10, 8),
            delivery_longitude DECIMAL(11, 8),
            notes TEXT,
            payment_method TEXT NOT NULL,
            estimated_delivery_time TIMESTAMP WITH TIME ZONE,
            accepted_at TIMESTAMP WITH TIME ZONE,
            ready_at TIMESTAMP WITH TIME ZONE,
            picked_up_at TIMESTAMP WITH TIME ZONE,
            delivered_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create order_items table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'order_items') THEN
        CREATE TABLE order_items (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            menu_item_id TEXT NOT NULL REFERENCES menu_items(id),
            quantity INTEGER NOT NULL,
            unit_price DECIMAL(10, 2) NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL,
            special_instructions TEXT
        );
    END IF;

    -- Create delivery_tracking table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'delivery_tracking') THEN
        CREATE TABLE delivery_tracking (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            latitude DECIMAL(10, 8) NOT NULL,
            longitude DECIMAL(11, 8) NOT NULL,
            timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Create business_hours table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'business_hours') THEN
        CREATE TABLE business_hours (
            id TEXT PRIMARY KEY,
            business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
            day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
            open_time TIME,
            close_time TIME,
            is_closed BOOLEAN DEFAULT false
        );
    END IF;

    -- Create delivery_zones table
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'delivery_zones') THEN
        CREATE TABLE delivery_zones (
            id TEXT PRIMARY KEY,
            business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            delivery_fee DECIMAL(10, 2) NOT NULL,
            min_order_amount DECIMAL(10, 2) DEFAULT 0,
            polygon_coordinates JSONB
        );
    END IF;

    RAISE NOTICE 'All tables created successfully!';
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_delivery_drivers_available ON delivery_drivers(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_business ON orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(delivery_driver_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_business ON menu_items(business_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);

-- Insert some sample data for testing
INSERT INTO users (id, email, name, user_type) VALUES 
('user1', 'test@business.com', 'Test Business', 'business'),
('user2', 'test@customer.com', 'Test Customer', 'customer'),
('user3', 'test@driver.com', 'Test Driver', 'delivery')
ON CONFLICT (email) DO NOTHING;

INSERT INTO businesses (id, user_id, business_name, description, address, phone) VALUES 
('business1', 'user1', 'Pizza Palace', 'Delicious pizzas and more', '123 Main St', '+1234567890')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, business_id, name) VALUES 
('cat1', 'business1', 'Pizzas'),
('cat2', 'business1', 'Bebidas')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_items (id, business_id, category_id, name, description, price) VALUES 
('item1', 'business1', 'cat1', 'Pizza Margherita', 'Tomate, mozzarella y albahaca', 12.99),
('item2', 'business1', 'cat1', 'Pizza Pepperoni', 'Pepperoni y mozzarella', 14.99),
('item3', 'business1', 'cat2', 'Coca Cola', 'Refresco 500ml', 2.50)
ON CONFLICT (id) DO NOTHING;
