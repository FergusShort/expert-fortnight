DROP TABLE IF EXISTS public.item_info;
DROP TABLE IF EXISTS public.items;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.receipts;
DROP TABLE IF EXISTS public.recipes;
DROP TABLE IF EXISTS public.shopping_list;
DROP TABLE IF EXISTS public.used_items;

CREATE TABLE public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    expiry_date DATE,
    opened BOOLEAN DEFAULT FALSE,
    quantity INTEGER DEFAULT 1,
    unit VARCHAR,
    image_url VARCHAR,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE public.item_info (
    item_id UUID PRIMARY KEY REFERENCES public.items(id) ON DELETE CASCADE,
    best_before DATE,
    use_by DATE,
    best_stored VARCHAR,
    nutritional_info TEXT,
    ingredients TEXT[],
    additional TEXT
);

CREATE TABLE public.profiles (
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT
);

CREATE TABLE public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP WITH TIME ZONE,
    store VARCHAR,
    total NUMERIC,
    image_url VARCHAR,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    type VARCHAR,
    ingredients TEXT[],
    instructions TEXT[],
    prep_time INTEGER,
    cook_time INTEGER,
    image_url VARCHAR,
    is_favorite BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE public.shopping_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    added TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    image_url VARCHAR,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE public.used_items (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit VARCHAR NOT NULL,
    used_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::TEXT, now()) NOT NULL,
    image_url VARCHAR,
    added_to_shopping_list BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reciepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.used_items ENABLE ROW LEVEL SECURITY;

-- Policies for public.items
CREATE POLICY "Enable read access for own items" ON public.items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable insert access for authenticated users" ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update access for own items" ON public.items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete access for own items" ON public.items FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.item_info (assuming only accessible with items)
CREATE POLICY "Enable insert access for authenticated users (via items)" ON public.item_info AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.items WHERE id = item_id AND user_id = auth.uid()));
CREATE POLICY "Enable update access for own item_info (via items)" ON public.item_info AS PERMISSIVE FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.items WHERE id = item_info.item_id AND user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.items WHERE id = item_id AND user_id = auth.uid()));
CREATE POLICY "Enable read access for own item_info (via items)" ON public.item_info AS PERMISSIVE FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.items WHERE id = item_info.item_id AND user_id = auth.uid()));
CREATE POLICY "Enable delete access for own item_info (via items)" ON public.item_info AS PERMISSIVE FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.items WHERE id = item_info.item_id AND user_id = auth.uid()));
-- Policies for public.profile
CREATE POLICY "Enable read access for own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update access for own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete access for own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.receipts
CREATE POLICY "Enable read access for own receipts" ON public.receipts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable insert access for authenticated users" ON public.receipts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update access for own receipts" ON public.receipts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete access for own receipts" ON public.receipts FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.recipes
CREATE POLICY "Enable read access for own recipes" ON public.recipes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable insert access for authenticated users" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update access for own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete access for own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);
-- If recipes are public and readable by everyone, you might add:
-- CREATE POLICY "Allow public read access" ON public.recipes FOR SELECT TO anon USING (true);

-- Policies for public.shopping_list
CREATE POLICY "Enable read access for own shopping_list" ON public.shopping_list FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable insert access for authenticated users" ON public.shopping_list FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update access for own shopping_list" ON public.shopping_list FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete access for own shopping_list" ON public.shopping_list FOR DELETE USING (auth.uid() = user_id);

-- Policies for public.used_items
CREATE POLICY "Enable read access for own used_items" ON public.used_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Enable insert access for authenticated users" ON public.used_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update access for own used_items" ON public.used_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete access for own used_items" ON public.used_items FOR DELETE USING (auth.uid() = user_id);

-- Indices for potential performance improvements
CREATE INDEX idx_items_user_id ON public.items (user_id);
CREATE INDEX idx_reciepts_user_id ON public.reciepts (user_id);
CREATE INDEX idx_recipes_user_id ON public.recipes (user_id);
CREATE INDEX idx_shopping_list_user_id ON public.shopping_list (user_id);
CREATE INDEX idx_used_items_user_id ON public.used_items (user_id);