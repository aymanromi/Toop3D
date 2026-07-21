// قائمة المنتجات مع المسارات المباشرة والمطابقة لمجلد images
const products = [
    { 
        id: 1, 
        name: " PETG - أسود", 
        price: 25000, 
        image: "images/petg%20black.jpg"
    },
    { 
        id: 2, 
        name: " PETG - أزرق", 
        price: 25000, 
        image: "images/petg%20blue.jpg"
    },
    { 
        id: 3, 
        name: " PETG - شفاف", 
        price: 28000, 
        image: "images/petg%20clear.jpg"
    },
    { 
        id: 4, 
        name: " PETG - سماوي (Cyan)", 
        price: 25000, 
        image: "images/petg%20cyan.jpg"
    },
    { 
        id: 5, 
        name: " PETG - ذهبي (Golden)", 
        price: 27000, 
        image: "images/petg%20golden.jpg"
    },
    { 
        id: 6, 
        name: " PETG - أخضر", 
        price: 25000, 
        image: "images/petg%20green.jpg"
    },
    { 
        id: 7, 
        name: " PETG - بيج (Latte)", 
        price: 25000, 
        image: "images/petg%20latte.png"
    },
    { 
        id: 8, 
        name: " PETG - برتقالي", 
        price: 25000, 
        image: "images/petg%20orange.jpg"
    },
    { 
        id: 9, 
        name: " PETG - وردي (Pink)", 
        price: 25000, 
        image: "images/petg%20pink.jpg"
    },
    { 
        id: 10, 
        name: " PETG - بنفسجي (Taro Purple)", 
        price: 25000, 
        image: "images/petg%20taro%20purple.jpg"
    },
    { 
        id: 11, 
        name: " PETG - أصفر", 
        price: 25000, 
        image: "images/petg%20yellow.jpg"
    }
];

let cart = [];

// دالة عرض المنتجات داخل الشبكة
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='Brown.jfif';">
            <h3>${product.name}</h3>
            <p class="price">${Number(product.price).toLocaleString()} د.ع</p>
            <button onclick="addToCart(${product.id})">إضافة للسلة 🛒</button>
        `;
        container.appendChild(card);
    });
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

// تشغيل الدالة تلقائياً
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayProducts);
} else {
    displayProducts();
}
