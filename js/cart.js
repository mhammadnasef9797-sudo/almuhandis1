// انتظر تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayCartItems();

    // إضافة مستمع حدث لزر الدفع
    document.getElementById('checkout-button').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
});

/**
 * الدالة الرئيسية لجلب وعرض عناصر السلة.
 */
async function fetchAndDisplayCartItems() {
    const apiUrl = 'https://localhost:7019/api/ShoppingCart';
    const wrapper = document.getElementById('cart-items-wrapper');
    const totalPriceElement = document.getElementById('cart-total-price');
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        wrapper.innerHTML = '<p>يجب عليك <a href="login.html">تسجيل الدخول</a> لعرض سلتك.</p>';
        // إضافة إخفاء قسم الإجمالي إذا لم يكن المستخدم مسجلاً
        const summaryElement = document.querySelector('.cart-summary');
        if(summaryElement) summaryElement.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`فشل جلب السلة: ${response.status}`);
        }

        // =========================================================================
        // (تعديل) التعامل مع بنية JSON الجديدة
        // =========================================================================
        const responseData = await response.json();
        // استخراج مصفوفة عناصر السلة الفعلية من خاصية "$values"
        const cartItems = responseData.$values;
        // =========================================================================
        
        wrapper.innerHTML = ''; 

        if (!cartItems || cartItems.length === 0) {
            wrapper.innerHTML = '<p>سلة التسوق فارغة حاليًا.</p>';
            totalPriceElement.textContent = '0.00 ريال';
            return;
        }

        let totalPrice = 0;
        cartItems.forEach(item => {
            const product = item.product; // الوصول للمنتج
            if (!product) return; // تخطي العنصر إذا لم يكن المنتج موجودًا لسبب ما

            const itemTotalPrice = item.quantity * product.price;
            totalPrice += itemTotalPrice;

            const cartItemHTML = `
                <div class="cart-item-card" id="item-${item.cartItemId}">
                    <img src="${product.imageUrl || 'img/default-product.png'}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <p>السعر: ${product.price.toFixed(2)} ريال</p>
                        <div class="cart-item-quantity">
                            <label for="quantity-${item.cartItemId}">الكمية:</label>
                            <input type="number" id="quantity-${item.cartItemId}" value="${item.quantity}" min="1" onchange="handleUpdateQuantity(${item.cartItemId}, this.value)">
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <p class="cart-item-subtotal">الإجمالي: ${itemTotalPrice.toFixed(2)} ريال</p>
                        <button class="remove-btn" onclick="handleRemoveItem(${item.cartItemId})">
                            <i class="fa-solid fa-trash"></i> إزالة
                        </button>
                    </div>
                </div>
            `;
            wrapper.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        totalPriceElement.textContent = `${totalPrice.toFixed(2)} ريال`;

    } catch (error) {
        console.error('خطأ في عرض السلة:', error);
        wrapper.innerHTML = '<p>حدث خطأ أثناء تحميل سلة التسوق.</p>';
    }
}

/**
 * دالة لتحديث كمية عنصر في السلة.
 * (لا تغييرات هنا، الكود يبقى كما هو)
 */
async function handleUpdateQuantity(cartItemId, newQuantity) {
    const apiUrl = `https://localhost:7019/api/ShoppingCart/items/${cartItemId}`;
    const token = localStorage.getItem('jwtToken');
    
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: parseInt(newQuantity) })
        });

        if (response.ok) {
            fetchAndDisplayCartItems();
        } else {
            alert('فشل تحديث الكمية.');
            // أعد تحميل السلة لإعادة القيمة القديمة
            fetchAndDisplayCartItems(); 
        }
    } catch (error) {
        console.error('خطأ في تحديث الكمية:', error);
    }
}

/**
 * دالة لإزالة عنصر من السلة.
 * (لا تغييرات هنا، الكود يبقى كما هو)
 */
async function handleRemoveItem(cartItemId) {
    if (!confirm('هل أنت متأكد من أنك تريد إزالة هذا العنصر من السلة؟')) {
        return;
    }

    const apiUrl = `https://localhost:7019/api/ShoppingCart/items/${cartItemId}`;
    const token = localStorage.getItem('jwtToken');

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            fetchAndDisplayCartItems();
        } else {
            alert('فشل إزالة العنصر.');
        }
    } catch (error) {
        console.error('خطأ في إزالة العنصر:', error);
    }
}