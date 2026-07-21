// قائمة المنتجات مع إضافة التصنيف (category) لكل منتج
const products = [
    { id: 1, category: "PETG", name: "PETG - أسود", price: 25000, image: "images/petg%20black.jpg" },
    { id: 2, category: "PETG", name: "PETG - أزرق", price: 25000, image: "images/petg%20blue.jpg" },
    { id: 3, category: "PETG", name: "PETG - شفاف", price: 28000, image: "images/petg%20clear.jpg" },
    { id: 4, category: "PETG", name: "PETG - سماوي (Cyan)", price: 25000, image: "images/petg%20cyan.jpg" },
    { id: 5, category: "PETG", name: "PETG - ذهبي (Golden)", price: 27000, image: "images/petg%20golden.jpg" },
    { id: 6, category: "PETG", name: "PETG - أخضر", price: 25000, image: "images/petg%20green.jpg" },
    { id: 7, category: "PETG", name: "PETG - بيج (Latte)", price: 25000, image: "images/petg%20latte.png" },
    { id: 8, category: "PETG", name: "PETG - برتقالي", price: 25000, image: "images/petg%20orange.jpg" },
    { id: 9, category: "PETG", name: "PETG - وردي (Pink)", price: 25000, image: "images/petg%20pink.jpg" },
    { id: 10, category: "PETG", name: "PETG - بنفسجي (Taro Purple)", price: 25000, image: "images/petg%20taro%20purple.jpg" },
    { id: 11, category: "PETG", name: "PETG - أصفر", price: 25000, image: "images/petg%20yellow.jpg" }
];

let cart = [];

// دالة عرض المنتجات داخل الشبكة بشكل محدد ومنظم
function displayProducts(categoryFilter = 'ALL') {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';

    // تصفية المنتجات حسب الاختيار
    const filteredProducts = (categoryFilter === 'ALL') 
        ? products 
        : products.filter(p => p.category === categoryFilter);

    if (filteredProducts.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 20px;">لا توجد منتجات متوفرة حالياً في هذا التصنيف.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${Number(product.price).toLocaleString()} د.ع</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">إضافة للسلة 🛒</button>
        `;
        container.appendChild(card);
    });
}

// دالة التصفية المربوطة بالقائمة المنسدلة
function filterCategory(category) {
    displayProducts(category);
}

// إضافة منتج للسلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

// تحديث واجهة السلة
function updateCartUI() {
    const cartCount = document.getElementById('nav-cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCount) cartCount.innerText = totalCount;
    if (cartTotalPrice) cartTotalPrice.innerText = `${totalPrice.toLocaleString()} د.ع`;

    if (cartItems) {
        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center; color:#64748b;">السلة فارغة حالياً</p>';
        } else {
            cart.forEach(item => {
                cartItems.innerHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #f1f5f9; padding-bottom:5px;">
                        <div>
                            <strong>${item.name}</strong>
                            <br><small>${item.price.toLocaleString()} × ${item.quantity}</small>
                        </div>
                        <button onclick="removeFromCart(${item.id})" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">حذف</button>
                    </div>
                `;
            });
        }
    }
}

// حذف عنصر من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// إظهار وإخفاء السلة
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
    }
}

// إرسال الطلب عبر الواتساب
function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    let message = "مرحباً Toop3D، أرغب بتأكيد الطلب التالي:\n\n";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `- ${item.name} (العدد: ${item.quantity}) = ${itemTotal.toLocaleString()} د.ع\n`;
    });

    message += `\nالمجموع الكلي: ${total.toLocaleString()} د.ع`;

    const phone = "9647000000000"; // 👈 استبدل هذا برقم الواتساب الخاص بك
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// تشغيل الدالة تلقائياً عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => displayProducts('ALL'));
} else {
    displayProducts('ALL');
}
