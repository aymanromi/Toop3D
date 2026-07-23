let cart = [];

// دالة فتح وإغلاق سلة التسوق
function toggleCartModal() {
    document.body.classList.toggle('cart-open');
}

// دالة تحديث واجهة السلة والعداد والإجمالي
function updateCartUI() {
    const cartCounter = document.getElementById('cart-counter');
    const container = document.getElementById('cartItemsContainer');
    const totalPriceEl = document.getElementById('cartTotalPrice');
    
    if (!container) return;
    
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCounter) cartCounter.textContent = totalCount;
    
    // إذا كانت السلة فارغة
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <div style="font-size: 3em; margin-bottom: 10px;">🛒</div>
                <p style="font-size: 1.1em; font-weight: bold; margin: 0;">سلة التسوق فارغة</p>
                <p style="font-size: 0.85em; color: #94a3b8; margin-top: 5px;">قم بإضافة بعض المنتجات لبدء الطلب</p>
            </div>
        `;
        if (totalPriceEl) totalPriceEl.innerText = '0 د.ع';
        return;
    }
    
    // إذا كانت السلة تحتوي على منتجات
    let itemsHTML = '';
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        itemsHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9;">
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 0.95rem; color: #1e293b;">${item.name}</h4>
                    <span style="font-size: 0.85rem; color: #64748b;">${item.price.toLocaleString()} د.ع × ${item.quantity}</span>
                </div>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem;" title="حذف">🗑️</button>
            </div>
        `;
    });
    
    container.innerHTML = itemsHTML;
    if (totalPriceEl) totalPriceEl.innerText = `${totalPrice.toLocaleString()} د.ع`;
}

// دالة الحذف
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// دالة إرسال الطلب عبر واتساب
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("سلة التسوق فارغة!");
        return;
    }
    
    const phoneNumber = "9647700000000"; // استبدل هذا برقم هاتفك الحقيقي مع رمز الدولة
    let message = "مرحباً، أريد طلب المنتجات التالية:\n\n";
    
    let totalPrice = 0;
    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        message += `▪️ ${item.name} | الكمية: ${item.quantity} | السعر: ${itemTotal.toLocaleString()} د.ع\n`;
    });
    
    message += `\n💰 الإجمالي الكلي: ${totalPrice.toLocaleString()} د.ع`;
    
    let encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// التقاط ضغطة أزرار "إضافة إلى السلة" في المتجر تلقائياً
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.add-to-cart-btn') || (e.target.matches('.add-to-cart-btn') ? e.target : null);
    
    if (btn) {
        const card = btn.closest('.product-card') || btn.closest('div').parentElement;
        
        let productName = "خيوط PETG High Speed";
        let productPrice = 17000;
        
        if (card) {
            const titleEl = card.querySelector('h2, h3, h4, .product-title');
            const priceEl = card.querySelector('.price, span');
            
            if (titleEl) productName = titleEl.innerText.trim();
            if (priceEl) {
                let p = priceEl.innerText.replace(/[^\d]/g, '');
                if (p) productPrice = parseInt(p);
            }
        }
        
        // جلب خيار البكرة (مع بكرة / بدون بكرة) إذا وجد
        let spool = "مع بكرة";
        if (card) {
            const activeSpool = card.querySelector('button.active, input[type="radio"]:checked');
            if (activeSpool) {
                spool = activeSpool.innerText || activeSpool.value;
            }
        }
        
        let finalName = `${productName} (${spool})`;
        
        let existing = cart.find(i => i.name === finalName);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ name: finalName, price: productPrice, quantity: 1 });
        }
        
        updateCartUI();
        toggleCartModal(); // فتح السلة تلقائياً عند الإضافة لرؤية المنتج
    }
});
