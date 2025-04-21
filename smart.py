import streamlit as st
import pandas as pd
import datetime
import random
from PIL import Image
from streamlit_option_menu import option_menu
import pytesseract  # For OCR receipt scanning
import io

# Set page config
st.set_page_config(
    page_title="SmartExpire - Sustainable Management",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS (Updated to include new styles for added features)
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Montserrat:wght@400;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        color: #333;
    }
    
    .main {
        background-color: #f5f7fa;
    }
    
    .header-title {
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        color: #2e7d32;
        font-size: 3.8rem !important;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    
    .mission-statement {
        font-family: 'Poppins', sans-serif;
        color: #4caf50;
        font-size: 1.4rem !important;
        text-align: center;
        margin-bottom: 2rem;
        font-weight: 300;
    }
    
    .header-subtitle {
        font-family: 'Montserrat', sans-serif;
        color: #2e7d32;
        font-size: 2rem !important;
        margin-top: 0 !important;
    }
    
    .sidebar .sidebar-content {
        background: linear-gradient(to bottom, #e8f5e9, #c8e6c9);
    }
    
    .expiring-soon {
        background-color: #ffebee !important;
        border-left: 6px solid #e53935 !important;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        font-size: 1.1rem;
    }
    
    .expiring-moderate {
        background-color: #fff3e0 !important;
        border-left: 6px solid #fb8c00 !important;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        font-size: 1.1rem;
    }
    
    .expiring-fine {
        background-color: #e8f5e9 !important;
        border-left: 6px solid #4caf50 !important;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        font-size: 1.1rem;
    }
    
    .recipe-card {
        border: 1px solid #c8e6c9;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 25px;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        transition: transform 0.3s ease;
    }
    
    .recipe-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    
    .stButton button {
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 10px;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
        margin-right: 10px;
    }
    
    .stButton button:hover {
        background-color: #388e3c;
        transform: scale(1.05);
    }
    
    .card {
        border-radius: 12px;
        padding: 25px;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        margin-bottom: 25px;
    }
    
    .stat-card {
        background-color: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        text-align: center;
    }
    
    .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2e7d32;
        margin-bottom: 0;
    }
    
    .stat-label {
        font-size: 1rem;
        color: #616161;
        margin-top: 0;
    }
    
    .panic-tag {
        background-color: #ffebee;
        color: #c62828;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .simple-tag {
        background-color: #fff8e1;
        color: #ff8f00;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .gourmet-tag {
        background-color: #e3f2fd;
        color: #1565c0;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 0.9rem;
        font-weight: 600;
    }
    
    .leaf-icon {
        color: #4caf50;
        font-size: 1.4rem;
        margin-right: 8px;
    }
    
    .logo-container {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        padding: 15px;
        background-color: #2e7d32;
        border-radius: 12px;
    }
    
    .logo-text {
        color: white;
        font-family: 'Montserrat', sans-serif;
        font-weight: 700;
        font-size: 1.8rem;
        margin-left: 12px;
    }
    
    .ocr-upload {
        border: 2px dashed #4caf50;
        border-radius: 12px;
        padding: 25px;
        text-align: center;
        margin-bottom: 25px;
    }
    
    .panic-mode {
        animation: pulse 2s infinite;
        background-color: #ffebee;
        border-radius: 12px;
        padding: 15px;
        text-align: center;
        margin-bottom: 25px;
        font-size: 1.2rem;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
    }
    
    .disposal-info {
        background-color: #e3f2fd;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        font-size: 1.1rem;
    }
    
    .medication-alert {
        background-color: #fff8e1;
        border-left: 6px solid #ffc107;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        font-size: 1.1rem;
    }
    
    .search-bar {
        margin-bottom: 25px;
        padding: 15px;
        border-radius: 10px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    }
    
    .stTextInput input {
        font-size: 1.1rem;
        padding: 10px;
        border-radius: 8px;
    }
    
    .info-button {
        background-color: #2196F3 !important;
    }
    
    .used-button {
        background-color: #ff9800 !important;
    }
    
    .add-shopping-button {
        background-color: #9c27b0 !important;
    }
    
    .favorite-button {
        background-color: #e91e63 !important;
    }
    
    .used-items-sidebar {
        background-color: #e8f5e9;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 25px;
    }
    
    .favorite-recipes {
        background-color: #e8f5e9;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 25px;
    }
    
    .smartcard {
        background: linear-gradient(to right, #4caf50, #2e7d32);
        color: white;
        border-radius: 12px;
        padding: 25px;
        text-align: center;
        margin-bottom: 25px;
    }
    
    .receipt-card {
        border: 1px solid #c8e6c9;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        background-color: white;
    }
    </style>
    """, unsafe_allow_html=True)

# Initialize session state
if 'grocery_data' not in st.session_state:
    st.session_state.grocery_data = pd.DataFrame(columns=[
        "Item", "Category", "Quantity", "Purchase Date", "Expiry Date", 
        "Opened", "Calories", "Storage", "Notes", "Type", "Best Before", "Use By", "Best Stored"
    ])

if 'used_items' not in st.session_state:
    st.session_state.used_items = pd.DataFrame(columns=[
        "Item", "Category", "Quantity", "Used On", "Used In", "Notes", "Type"
    ])

if 'shopping_list' not in st.session_state:
    st.session_state.shopping_list = []

if 'show_info' not in st.session_state:
    st.session_state.show_info = {}

if 'barcode_cards' not in st.session_state:
    st.session_state.barcode_cards = [
        {"name": "Organic Grocers Loyalty", "number": "123456789", "image": "https://via.placeholder.com/300x150.png?text=Organic+Grocers"},
        {"name": "Pharmacy Rewards", "number": "987654321", "image": "https://via.placeholder.com/300x150.png?text=Pharmacy+Rewards"}
    ]

if 'mode' not in st.session_state:
    st.session_state.mode = "grocery"

if 'medication_schedule' not in st.session_state:
    st.session_state.medication_schedule = []

if 'favorite_recipes' not in st.session_state:
    st.session_state.favorite_recipes = []

if 'past_receipts' not in st.session_state:
    st.session_state.past_receipts = []

# Sample data
def load_sample_data(mode):
    today = datetime.date.today()
    if mode == "grocery":
        return pd.DataFrame([
            {"Item": "Eggs", "Category": "Dairy", "Quantity": 12, "Purchase Date": today - datetime.timedelta(days=5), 
             "Expiry Date": today + datetime.timedelta(days=10), "Opened": False, "Calories": 155, 
             "Storage": "Refrigerate at 4°C", "Notes": "Best used within 3 weeks", "Type": "grocery",
             "Best Before": today + datetime.timedelta(days=10), "Use By": today + datetime.timedelta(days=12),
             "Best Stored": "In original carton in refrigerator"},
            {"Item": "Organic Milk", "Category": "Dairy", "Quantity": 1, "Purchase Date": today - datetime.timedelta(days=2), 
             "Expiry Date": today + datetime.timedelta(days=3), "Opened": False, "Calories": 103, 
             "Storage": "Refrigerate at 4°C", "Notes": "Consume within 7 days of opening", "Type": "grocery",
             "Best Before": today + datetime.timedelta(days=3), "Use By": today + datetime.timedelta(days=5),
             "Best Stored": "In refrigerator door"},
            {"Item": "Free-Range Chicken Breast", "Category": "Meat", "Quantity": 2, "Purchase Date": today - datetime.timedelta(days=1), 
             "Expiry Date": today + datetime.timedelta(days=2), "Opened": False, "Calories": 165, 
             "Storage": "Refrigerate at 2°C", "Notes": "Use or freeze by expiry", "Type": "grocery",
             "Best Before": today + datetime.timedelta(days=2), "Use By": today + datetime.timedelta(days=3),
             "Best Stored": "In coldest part of refrigerator"}
        ])
    elif mode == "pharmacy":
        return pd.DataFrame([
            {"Item": "Ibuprofen", "Category": "Pain Relief", "Quantity": 30, "Purchase Date": today - datetime.timedelta(days=30), 
             "Expiry Date": today + datetime.timedelta(days=180), "Opened": True, "Calories": 0, 
             "Storage": "Store at room temperature", "Notes": "Take 1-2 tablets every 4-6 hours", "Type": "pharmacy",
             "Best Before": today + datetime.timedelta(days=180), "Use By": today + datetime.timedelta(days=200),
             "Best Stored": "In a cool, dry place away from sunlight"}
        ])
    elif mode == "cosmetics":
        return pd.DataFrame([
            {"Item": "Moisturizer", "Category": "Skincare", "Quantity": 1, "Purchase Date": today - datetime.timedelta(days=60), 
             "Expiry Date": today + datetime.timedelta(days=300), "Opened": True, "Calories": 0, 
             "Storage": "Store in cool, dry place", "Notes": "Use within 6 months of opening", "Type": "cosmetics",
             "Best Before": today + datetime.timedelta(days=300), "Use By": today + datetime.timedelta(days=330),
             "Best Stored": "Away from direct sunlight"}
        ])
    elif mode == "cleaning":
        return pd.DataFrame([
            {"Item": "Dish Soap", "Category": "Kitchen", "Quantity": 1, "Purchase Date": today - datetime.timedelta(days=10), 
             "Expiry Date": today + datetime.timedelta(days=720), "Opened": True, "Calories": 0, 
             "Storage": "Store at room temperature", "Notes": "Safe for all dishes", "Type": "cleaning",
             "Best Before": today + datetime.timedelta(days=720), "Use By": today + datetime.timedelta(days=750),
             "Best Stored": "Under sink"}
        ])
    elif mode == "pet_care":
        return pd.DataFrame([
            {"Item": "Dog Food", "Category": "Pet Food", "Quantity": 1, "Purchase Date": today - datetime.timedelta(days=5), 
             "Expiry Date": today + datetime.timedelta(days=180), "Opened": True, "Calories": 350, 
             "Storage": "Store in cool, dry place", "Notes": "Feed 2 cups daily", "Type": "pet_care",
             "Best Before": today + datetime.timedelta(days=180), "Use By": today + datetime.timedelta(days=200),
             "Best Stored": "In airtight container"}
        ])

def load_used_items():
    today = datetime.date.today()
    return pd.DataFrame([
        {"Item": "Organic Carrots", "Category": "Vegetable", "Quantity": 5, "Used On": today - datetime.timedelta(days=2), 
         "Used In": "Carrot Soup", "Notes": "Used all", "Type": "grocery"}
    ])

# Recipe database
def get_recipes(items, mode="grocery"):
    if mode != "grocery":
        return []
    
    all_recipes = {
        "Eggs": [
            {"name": "Scrambled Eggs", "type": "Panic", "description": "Quick and easy with pantry staples",
             "ingredients": "Eggs, butter, salt, pepper", "time": "5 mins",
             "instructions": "1. Beat eggs. 2. Melt butter in pan. 3. Cook eggs, stirring constantly. 4. Season to taste.",
             "image": "https://images.unsplash.com/photo-1559847844-5315695dadae"},
            {"name": "Boiled Eggs", "type": "Simple", "description": "Perfect for snacks or salads",
             "ingredients": "Eggs, water", "time": "15 mins",
             "instructions": "1. Boil water. 2. Add eggs. 3. Cook for desired doneness (6 mins soft, 12 mins hard).",
             "image": "https://images.unsplash.com/photo-1518562180175-34a163b1c9c9"},
            {"name": "Vegetable Frittata", "type": "Gourmet", "description": "Hearty meal with fresh veggies",
             "ingredients": "Eggs, mixed vegetables, cheese, fresh herbs", "time": "30 mins",
             "instructions": "1. Sauté vegetables. 2. Beat eggs with seasoning. 3. Combine in oven-safe pan. 4. Bake at 180°C for 20 mins.",
             "image": "https://images.unsplash.com/photo-1547592180-85f173990554"}
        ],
        "Organic Milk": [
            {"name": "Milk Smoothie", "type": "Panic", "description": "Quick drink with pantry items",
             "ingredients": "Milk, sugar, vanilla", "time": "5 mins",
             "instructions": "1. Blend all ingredients until smooth. 2. Serve chilled.",
             "image": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71"},
            {"name": "Pancakes", "type": "Simple", "description": "Fluffy breakfast treat",
             "ingredients": "Milk, flour, eggs, baking powder", "time": "20 mins",
             "instructions": "1. Mix dry ingredients. 2. Add wet ingredients. 3. Cook on griddle.",
             "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150"},
            {"name": "Creamy Mushroom Pasta", "type": "Gourmet", "description": "Rich dinner option",
             "ingredients": "Milk, pasta, mushrooms, cream, parmesan", "time": "30 mins",
             "instructions": "1. Sauté mushrooms. 2. Make cream sauce with milk. 3. Toss with pasta and cheese.",
             "image": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb"}
        ],
        "default": [
    {"name": "Quick Stir-fry", "type": "Panic", "description": "Fast dish with basic ingredients",
     "ingredients": "Item, oil, salt, pepper", "time": "15 mins",
     "instructions": "1. Slice ingredients. 2. Heat oil. 3. Stir-fry quickly. 4. Season.",
     "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"},
    {"name": "Roasted Dish", "type": "Simple", "description": "Easy prep for most items",
     "ingredients": "Item, oil, salt, pepper", "time": "30 mins",
     "instructions": "1. Toss with oil and seasonings. 2. Roast at 200°C until done.",
     "image": "https://images.unsplash.com/photo-1546069901-4567c3e4e9a1"},
    {"name": "Gourmet Casserole", "type": "Gourmet", "description": "Combine with premium ingredients",
     "ingredients": "Item, rice/pasta, sauce, cheese, herbs", "time": "45 mins",
     "instructions": "1. Layer ingredients. 2. Bake at 180°C for 30-40 mins.",
     "image": "https://images.unsplash.com/photo-1551183053-bf91a1d81141"}
]       
    }
    
    item_recipes = []
    for item in items:
        recipes = all_recipes.get(item, all_recipes["default"])
        # Ensure one of each type (Panic, Simple, Gourmet) if available
        for recipe_type in ["Panic", "Simple", "Gourmet"]:
            for recipe in recipes:
                if recipe["type"] == recipe_type:
                    item_recipes.append(recipe)
                    break
    return item_recipes[:3]  # Return one of each type if possible

# Disposal info
def get_disposal_info(item, category, mode):
    if mode == "pharmacy":
        return {
            "instructions": "Return to pharmacy for safe disposal. Do not flush or throw in trash.",
            "reason": "Prevents environmental contamination and misuse."
        }
    elif mode == "cosmetics":
        return {
            "instructions": "Check for recycling symbols. Dispose in appropriate recycling bin or return to store programs.",
            "reason": "Reduces plastic waste."
        }
    elif mode == "cleaning":
        return {
            "instructions": "Empty contents safely and recycle container if possible.",
            "reason": "Prevents chemical contamination."
        }
    elif mode == "pet_care":
        return {
            "instructions": "Compost organic waste or dispose in food waste bin. Recycle packaging.",
            "reason": "Reduces landfill waste."
        }
    
    disposal_info = {
        "Dairy": {"instructions": "Compost or dispose in food waste bin.", "reason": "Reduces landfill methane."},
        "Meat": {"instructions": "Wrap securely and dispose in food waste bin.", "reason": "Prevents odor and pests."},
        "Vegetable": {"instructions": "Compost or dispose in food waste bin.", "reason": "Breaks down easily."},
        "Fruit": {"instructions": "Compost or dispose in food waste bin.", "reason": "Breaks down easily."},
        "Bakery": {"instructions": "Compost or dispose in food waste bin.", "reason": "Breaks down easily."},
        "default": {"instructions": "Dispose in food waste bin or trash.", "reason": "Reduces environmental impact."}
    }
    
    return disposal_info.get(category, disposal_info["default"])

# Sidebar Navigation
with st.sidebar:
    st.markdown("""
    <div class="logo-container">
        <span style="font-size: 2.2rem;">🌱</span>
        <span class="logo-text">SmartExpire</span>
    </div>
    """, unsafe_allow_html=True)
    
    # Mode selection dropdown
    mode = st.selectbox("Select Mode", ["Grocery", "Pharmacy", "Cosmetics", "Cleaning Supplies", "Pet Care"],
                        index=["grocery", "pharmacy", "cosmetics", "cleaning", "pet_care"].index(st.session_state.mode))
    mode_map = {
        "Grocery": "grocery",
        "Pharmacy": "pharmacy",
        "Cosmetics": "cosmetics",
        "Cleaning Supplies": "cleaning",
        "Pet Care": "pet_care"
    }
    if mode_map[mode] != st.session_state.mode:
        st.session_state.mode = mode_map[mode]
        st.experimental_rerun()
    
    st.markdown(f"""
    <p style="color: #2e7d32; font-weight: 600; font-size: 1rem;">
    Manage your {st.session_state.mode.replace('_', ' ')} items sustainably.
    </p>
    """, unsafe_allow_html=True)
    
    selected = option_menu(
        menu_title=None,
        options=["Home", "My List", "Recommendations", "My Hub"],
        icons=["house", "list-check", "lightbulb", "person-badge"],
        menu_icon="cast",
        default_index=0,
        styles={
            "container": {"padding": "0!important", "background-color": "#e8f5e9"},
            "icon": {"color": "#2e7d32", "font-size": "20px"}, 
            "nav-link": {"font-size": "18px", "text-align": "left", "margin":"0px", "--hover-color": "#c8e6c9"},
            "nav-link-selected": {"background-color": "#4caf50"},
        }
    )

# Home Page
if selected == "Home":
    st.markdown('<h1 class="header-title">SmartExpire</h1>', unsafe_allow_html=True)
    st.markdown(f'<p class="mission-statement">Sustainable management for your {st.session_state.mode.replace("_", " ")} items</p>', unsafe_allow_html=True)
    
    if st.session_state.grocery_data.empty:
        st.session_state.grocery_data = load_sample_data(st.session_state.mode)
    
    if st.session_state.used_items.empty:
        st.session_state.used_items = load_used_items()
    
    # Stats
    df = st.session_state.grocery_data[st.session_state.grocery_data['Type'] == st.session_state.mode].copy()
    df['Days Until Expiry'] = (df['Expiry Date'] - datetime.date.today()).dt.days
    expiring_soon = len(df[df['Days Until Expiry'] <= (3 if st.session_state.mode == "grocery" else 7)])
    expiring_moderate = len(df[(df['Days Until Expiry'] > 3) & (df['Days Until Expiry'] <= 7)] if st.session_state.mode == "grocery" else 
                           df[(df['Days Until Expiry'] > 7) & (df['Days Until Expiry'] <= 30)])
    total_items = len(df)
    categories = df['Category'].nunique()
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
        <div class="stat-card">
            <p class="stat-value">{total_items}</p>
            <p class="stat-label">Total Items</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="stat-card">
            <p class="stat-value">{expiring_soon}</p>
            <p class="stat-label">Expiring Soon</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="stat-card">
            <p class="stat-value">{categories}</p>
            <p class="stat-label">Categories</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="stat-card">
            <p class="stat-value">${random.randint(20, 100)}</p>
            <p class="stat-label">Estimated Savings</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.write("---")
    
    col1, col2 = st.columns([2, 1])
    with col1:
        st.markdown(f"""
        ## Welcome to SmartExpire {st.session_state.mode.replace('_', ' ').capitalize()} Mode 🌱
        Your sustainable {st.session_state.mode.replace('_', ' ')} management system.
        ### Quick Actions
        """)
        action_cols = st.columns(3)
        with action_cols[0]:
            if st.button("➕ Add New Item"):
                st.session_state.selected = "My List"
        with action_cols[1]:
            if st.button("⚠️ View Expiring Soon"):
                st.session_state.selected = "My List"
        with action_cols[2]:
            if st.button("🍳 Get Recommendations" if st.session_state.mode == "grocery" else "💊 Schedule"):
                st.session_state.selected = "Recommendations"
    
    with col2:
        st.markdown("### Quick Scan")
        st.markdown('<div class="ocr-upload">📸 Upload receipt or barcode</div>', unsafe_allow_html=True)
        uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "png", "jpeg"])
        if uploaded_file:
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Image", use_column_width=True)
            st.success("Processing image... Item added!")

# My List Page
elif selected == "My List":
    st.markdown(f'<h2 class="header-subtitle">My {st.session_state.mode.replace("_", " ").capitalize()} List</h2>', unsafe_allow_html=True)
    
    col1, col2 = st.columns([3, 1])
    
    with col2:
        st.markdown("### Used Items")
        st.markdown('<div class="used-items-sidebar">', unsafe_allow_html=True)
        used_df = st.session_state.used_items[st.session_state.used_items['Type'] == st.session_state.mode]
        if used_df.empty:
            st.info("No items used yet.")
        else:
            for _, row in used_df.iterrows():
                st.markdown(f"""
                <div class="card">
                    <strong>{row['Item']}</strong><br>
                    Used On: {row['Used On'].strftime('%Y-%m-%d')}<br>
                    Used In: {row['Used In']}<br>
                    Notes: {row['Notes'] or 'None'}
                </div>
                """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col1:
        df = st.session_state.grocery_data[st.session_state.grocery_data['Type'] == st.session_state.mode].copy()
        df['Days Until Expiry'] = (df['Expiry Date'] - datetime.date.today()).dt.days
        df = df.sort_values(by='Days Until Expiry')  # Sort by expiry date
        
        with st.expander("➕ Add New Item", expanded=False):
            with st.form("add_item_form"):
                col1, col2 = st.columns(2)
                with col1:
                    item_name = st.text_input("Item Name")
                    category = st.selectbox("Category", {
                        "grocery": ["Dairy", "Meat", "Vegetable", "Fruit", "Bakery", "Other"],
                        "pharmacy": ["Pain Relief", "Antibiotic", "Supplements", "Allergy", "Other"],
                        "cosmetics": ["Skincare", "Haircare", "Makeup", "Other"],
                        "cleaning": ["Kitchen", "Bathroom", "Laundry", "Other"],
                        "pet_care": ["Pet Food", "Pet Supplies", "Other"]
                    }[st.session_state.mode])
                    quantity = st.number_input("Quantity", min_value=1, value=1)
                    purchase_date = st.date_input("Purchase Date", datetime.date.today())
                with col2:
                    expiry_date = st.date_input("Expiry Date", datetime.date.today() + datetime.timedelta(days=30))
                    opened = st.checkbox("Opened")
                    calories = st.number_input("Calories per serving (optional)", min_value=0, value=0) if st.session_state.mode == "grocery" else 0
                    storage = st.text_input("Storage Instructions")
                    notes = st.text_area("Notes")
                    best_before = st.date_input("Best Before", expiry_date)
                    use_by = st.date_input("Use By", expiry_date + datetime.timedelta(days=2))
                    best_stored = st.text_input("Best Stored")
                submitted = st.form_submit_button("Add Item")
                if submitted:
                    new_item = pd.DataFrame([{
                        "Item": item_name,
                        "Category": category,
                        "Quantity": quantity,
                        "Purchase Date": purchase_date,
                        "Expiry Date": expiry_date,
                        "Opened": opened,
                        "Calories": calories,
                        "Storage": storage,
                        "Notes": notes,
                        "Type": st.session_state.mode,
                        "Best Before": best_before,
                        "Use By": use_by,
                        "Best Stored": best_stored
                    }])
                    st.session_state.grocery_data = pd.concat([st.session_state.grocery_data, new_item], ignore_index=True)
                    st.success(f"{item_name} added!")
        
        st.markdown("### Your Items")
        if df.empty:
            st.info(f"No {st.session_state.mode.replace('_', ' ')} items added yet.")
        else:
            for idx, row in df.iterrows():
                days_left = row['Days Until Expiry']
                expiry_class = "expiring-soon" if days_left < 1 else \
                              "expiring-moderate" if days_left <= 2 else \
                              "expiring-fine"
                st.markdown(f"""
                <div class="{expiry_class}">
                    <strong>{row['Item']}</strong> ({row['Quantity']} {'' if row['Quantity'] == 1 else 'units'})<br>
                    Category: {row['Category']} | Expires in: {days_left} days ({row['Expiry Date'].strftime('%Y-%m-%d')})<br>
                    {'Opened' if row['Opened'] else 'Unopened'} | Storage: {row['Storage']}<br>
                    {'Calories: ' + str(row['Calories']) + ' per serving<br>' if row['Calories'] > 0 else ''}
                    Notes: {row['Notes'] or 'None'}<br>
                """, unsafe_allow_html=True)
                
                col_btn1, col_btn2, col_btn3, col_btn4 = st.columns([1, 1, 1, 1])
                with col_btn1:
                    if st.button("ℹ️ Info", key=f"info_{idx}"):
                        st.session_state.show_info[idx] = not st.session_state.show_info.get(idx, False)
                with col_btn2:
                    if st.button("🗑️ Used", key=f"used_{idx}"):
                        used_item = pd.DataFrame([{
                            "Item": row['Item'],
                            "Category": row['Category'],
                            "Quantity": row['Quantity'],
                            "Used On": datetime.date.today(),
                            "Used In": "Not specified",
                            "Notes": row['Notes'],
                            "Type": st.session_state.mode
                        }])
                        st.session_state.used_items = pd.concat([st.session_state.used_items, used_item], ignore_index=True)
                        st.session_state.grocery_data = st.session_state.grocery_data.drop(idx)
                        st.session_state.grocery_data = st.session_state.grocery_data.reset_index(drop=True)
                        st.experimental_rerun()
                with col_btn3:
                    if st.button("➕ Add to Shopping List", key=f"shop_{idx}"):
                        if row['Item'] not in st.session_state.shopping_list:
                            st.session_state.shopping_list.append(row['Item'])
                            st.success(f"{row['Item']} added to shopping list!")
                with col_btn4:
                    if st.button("🛒 Replace", key=f"replace_{idx}"):
                        if row['Item'] not in st.session_state.shopping_list:
                            st.session_state.shopping_list.append(row['Item'])
                            st.success(f"{row['Item']} added to shopping list for replacement!")
                
                if st.session_state.show_info.get(idx, False):
                    disposal = get_disposal_info(row['Item'], row['Category'], st.session_state.mode)
                    st.markdown(f"""
                    <div class="disposal-info">
                        <strong>Item Information</strong><br>
                        Best Before: {row['Best Before'].strftime('%Y-%m-%d')}<br>
                        Use By: {row['Use By'].strftime('%Y-%m-%d')}<br>
                        Best Stored: {row['Best Stored']}<br>
                        Disposal Instructions: {disposal['instructions']}<br>
                        Reason: {disposal['reason']}
                    </div>
                    """, unsafe_allow_html=True)

# Recommendations Page
elif selected == "Recommendations":
    if st.session_state.mode == "grocery":
        st.markdown('<h2 class="header-subtitle">Recipe Recommendations</h2>', unsafe_allow_html=True)
        
        # Search bar
        st.markdown('<div class="search-bar">🔍 Search for an item to get recipe ideas</div>', unsafe_allow_html=True)
        search_item = st.text_input("Search Item", placeholder="e.g., Eggs, Milk")
        if search_item:
            recipes = get_recipes([search_item], mode="grocery")
            st.markdown(f"### Recipes for {search_item}")
            if recipes:
                for recipe in recipes:
                    tag_class = {"Panic": "panic-tag", "Simple": "simple-tag", "Gourmet": "gourmet-tag"}.get(recipe['type'], "simple-tag")
                    st.markdown(f"""
                    <div class="recipe-card">
                        <h3>{recipe['name']}</h3>
                        <span class="{tag_class}">{recipe['type']}</span><br>
                        <img src="{recipe['image']}" style="width:100%; border-radius:10px; margin:15px 0;">
                        <p>{recipe['description']}</p>
                        <p><strong>Ingredients:</strong> {recipe['ingredients']}</p>
                        <p><strong>Time:</strong> {recipe['time']}</p>
                        <p><strong>Instructions:</strong> {recipe['instructions']}</p>
                    """, unsafe_allow_html=True)
                    if st.button("❤️ Save Favorite", key=f"fav_{recipe['name']}"):
                        if recipe not in st.session_state.favorite_recipes:
                            st.session_state.favorite_recipes.append(recipe)
                            st.success(f"{recipe['name']} saved to favorites!")
                    st.markdown("</div>", unsafe_allow_html=True)
            else:
                st.info(f"No recipes found for {search_item}. Try another item!")
        
        # Favorite recipes
        st.markdown("### Favorite Recipes")
        st.markdown('<div class="favorite-recipes">', unsafe_allow_html=True)
        if st.session_state.favorite_recipes:
            for recipe in st.session_state.favorite_recipes:
                tag_class = {"Panic": "panic-tag", "Simple": "simple-tag", "Gourmet": "gourmet-tag"}.get(recipe['type'], "simple-tag")
                st.markdown(f"""
                <div class="recipe-card">
                    <h3>{recipe['name']}</h3>
                    <span class="{tag_class}">{recipe['type']}</span><br>
                    <p>{recipe['description']}</p>
                    <button onclick="alert('Remove favorite coming soon!')">Remove Favorite</button>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("No favorite recipes saved yet.")
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Expiring items
        df = st.session_state.grocery_data[st.session_state.grocery_data['Type'] == "grocery"].copy()
        df['Days Until Expiry'] = (df['Expiry Date'] - datetime.date.today()).dt.days
        expiring_items = df[df['Days Until Expiry'] <= 3]['Item'].tolist()
        if expiring_items:
            st.markdown('<div class="panic-mode">⚠️ Items expiring soon! Use them now:</div>', unsafe_allow_html=True)
            recipes = get_recipes(expiring_items, mode="grocery")
            for recipe in recipes:
                tag_class = {"Panic": "panic-tag", "Simple": "simple-tag", "Gourmet": "gourmet-tag"}.get(recipe['type'], "simple-tag")
                st.markdown(f"""
                <div class="recipe-card">
                    <h3>{recipe['name']}</h3>
                    <span class="{tag_class}">{recipe['type']}</span><br>
                    <img src="{recipe['image']}" style="width:100%; border-radius:10px; margin:15px 0;">
                    <p>{recipe['description']}</p>
                    <p><strong>Ingredients:</strong> {recipe['ingredients']}</p>
                    <p><strong>Time:</strong> {recipe['time']}</p>
                    <p><strong>Instructions:</strong> {recipe['instructions']}</p>
                """, unsafe_allow_html=True)
                if st.button("❤️ Save Favorite", key=f"fav_expiring_{recipe['name']}"):
                    if recipe not in st.session_state.favorite_recipes:
                        st.session_state.favorite_recipes.append(recipe)
                        st.success(f"{recipe['name']} saved to favorites!")
                st.markdown("</div>", unsafe_allow_html=True)
        else:
            st.info("No items expiring soon.")
    
    else:
        st.markdown(f'<h2 class="header-subtitle">{st.session_state.mode.replace("_", " ").capitalize()} Schedule</h2>', unsafe_allow_html=True)
        with st.form(f"{st.session_state.mode}_schedule_form"):
            item_name = st.text_input("Item Name")
            instructions = st.text_input("Usage Instructions")
            times = st.multiselect("Times of Day", ["Morning", "Afternoon", "Evening", "Night"])
            days = st.multiselect("Days", ["Daily", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
            submitted = st.form_submit_button("Add to Schedule")
            if submitted:
                st.session_state.medication_schedule.append({
                    "Item": item_name,
                    "Instructions": instructions,
                    "Times": times,
                    "Days": days,
                    "Type": st.session_state.mode
                })
                st.success(f"{item_name} added to schedule!")
        
        if st.session_state.medication_schedule:
            st.markdown(f"### Your {st.session_state.mode.replace('_', ' ')} Schedule")
            for item in st.session_state.medication_schedule:
                if item['Type'] == st.session_state.mode:
                    st.markdown(f"""
                    <div class="card">
                        <strong>{item['Item']}</strong><br>
                        Instructions: {item['Instructions']}<br>
                        Times: {', '.join(item['Times'])}<br>
                        Days: {', '.join(item['Days'])}<br>
                        <button onclick="alert('Edit/Remove coming soon!')">Edit/Remove</button>
                    </div>
                    """, unsafe_allow_html=True)
        else:
            st.info(f"No {st.session_state.mode.replace('_', ' ')} items scheduled yet.")

# My Hub Page
elif selected == "My Hub":
    st.markdown(f'<h2 class="header-subtitle">My {st.session_state.mode.replace("_", " ").capitalize()} Hub</h2>', unsafe_allow_html=True)
    
    st.markdown("### SmartCard")
    st.markdown(f"""
    <div class="smartcard">
        <h3>SmartExpire SmartCard</h3>
        <p>Scan this card instead of using paper receipts!</p>
        <img src="https://via.placeholder.com/300x150.png?text=SmartCard" style="width:100%; border-radius:10px; margin:15px 0;">
        <p>Card Number: SMRT-{random.randint(1000, 9999)}</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### Receipt Scanner")
    st.markdown('<div class="ocr-upload">📸 Upload a receipt to extract items</div>', unsafe_allow_html=True)
    receipt_file = st.file_uploader("Choose a receipt image...", type=["jpg", "png", "jpeg"], key="receipt_upload")
    if receipt_file:
        image = Image.open(receipt_file)
        st.image(image, caption="Uploaded Receipt", use_column_width=True)
        # Simulate OCR processing
        text = pytesseract.image_to_string(image)
        st.session_state.past_receipts.append({
            "date": datetime.date.today(),
            "text": text,
            "image": receipt_file.getvalue()
        })
        st.success("Receipt processed! Items extracted and saved.")
    
    st.markdown("### Past Receipts")
    if st.session_state.past_receipts:
        for idx, receipt in enumerate(st.session_state.past_receipts):
            st.markdown(f"""
            <div class="receipt-card">
                <strong>Receipt {idx + 1}</strong><br>
                Date: {receipt['date'].strftime('%Y-%m-%d')}<br>
                Extracted Text: <pre>{receipt['text'][:100]}...</pre><br>
                <button onclick="alert('View/Delete coming soon!')">View/Delete</button>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No receipts uploaded yet.")
    
    st.markdown("### Shopping List")
    if st.session_state.shopping_list:
        for item in st.session_state.shopping_list:
            st.markdown(f"""
            <div class="card">
                <strong>{item}</strong><br>
                <button onclick="alert('Remove coming soon!')">Remove from List</button>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("Your shopping list is empty.")
    
    st.markdown("### My Barcode Cards")
    for card in st.session_state.barcode_cards:
        st.markdown(f"""
        <div class="card">
            <strong>{card['name']}</strong><br>
            Number: {card['number']}<br>
            <img src="{card['image']}" style="width:100%; border-radius:10px; margin:15px 0;">
            <button onclick="alert('Edit/Delete coming soon!')">Edit/Delete</button>
        </div>
        """, unsafe_allow_html=True)
    
    with st.expander("➕ Add New Barcode Card"):
        with st.form("add_barcode_form"):
            card_name = st.text_input("Card Name")
            card_number = st.text_input("Card Number")
            card_image = st.text_input("Image URL (optional)", value="https://via.placeholder.com/300x150.png?text=New+Card")
            submitted = st.form_submit_button("Add Card")
            if submitted:
                st.session_state.barcode_cards.append({
                    "name": card_name,
                    "number": card_number,
                    "image": card_image
                })
                st.success(f"{card_name} added!")