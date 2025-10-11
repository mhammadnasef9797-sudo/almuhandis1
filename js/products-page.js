// انتظر حتى يتم تحميل محتوى الصفحة بالكامل قبل تنفيذ أي كود
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayProducts();
});

/**
 * الدالة الرئيسية التي تتصل بالـ API لجلب المنتجات ثم تعرضها على الصفحة.
 */
async function fetchAndDisplayProducts() {
    const apiUrl = 'https://localhost:7019/api/Products';
    const container = document.getElementById('all-products-container');

    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                container.innerHTML = '<p class="error-message">يجب عليك <a href="login.html">تسجيل الدخول</a> أولاً لعرض المنتجات.</p>';
            } else {
                container.innerHTML = `<p class="error-message">حدث خطأ أثناء تحميل المنتجات. رمز الخطأ: ${response.status}</p>`;
            }
            return;
        }

        // =========================================================================
        // (تعديل) التعامل مع بنية JSON الجديدة الناتجة عن ReferenceHandler.Preserve
        // =========================================================================
        const responseData = await response.json();
        
        // استخراج مصفوفة المنتجات الفعلية من خاصية "$values"
        const products = responseData.$values; 
        
        container.innerHTML = '';

        // التحقق مما إذا كانت المصفوفة فارغة أو غير موجودة
        if (!products || products.length === 0) {
            container.innerHTML = '<p>لا توجد منتجات متاحة للعرض حاليًا.</p>';
            return;
        }
        // =========================================================================

        products.forEach(product => {
            const productCardHTML = `
                <div class="product_card">
                    <div class="img_card">
                        <img src="${product.imageUrl || 'img/default-product.png'}" alt="${product.name}">
                    </div>
                    <div class="info_card">
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <div class="price">
                            <span>${product.price.toFixed(2)} ريال</span>
                        </div>
                    </div>
                    <div class="card_icons">
                        <span onclick="handleAddToCart(this, ${product.productId})" title="إضافة للسلة"><i class="fa-solid fa-cart-plus"></i></span>
                        <span onclick="handleAddToFavorites(${product.productId})" title="إضافة للمفضلة"><i class="fa-regular fa-heart"></i></span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productCardHTML);
        });

    } catch (error) {
        console.error('فشل في جلب المنتجات:', error);
        container.innerHTML = '<p class="error-message">لا يمكن الاتصال بالخادم. يرجى التأكد من أن الـ Backend يعمل والمحاولة مرة أخرى.</p>';
    }
}


/**
 * دالة لمعالجة حدث النقر على أيقونة "إضافة للسلة".
 * (لا تغييرات هنا، الكود يبقى كما هو)
 */
async function handleAddToCart(buttonElement, productId) {
    console.log(`تم النقر لإضافة المنتج رقم ${productId} إلى السلة.`);
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('الرجاء تسجيل الدخول أولاً لإضافة منتجات إلى السلة.');
        return;
    }
    const apiUrl = 'https://localhost:7019/api/ShoppingCart/items';
    const icon = buttonElement.querySelector('i');
    icon.className = 'fa-solid fa-spinner fa-spin';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });
        if (response.ok) {
            icon.className = 'fa-solid fa-check';
        } else {
            const errorText = await response.text();
            console.error('فشل في إضافة المنتج للسلة:', errorText);
            alert(`فشل: ${errorText}`);
            icon.className = 'fa-solid fa-times';
        }
    } catch (error) {
        console.error('خطأ في الشبكة عند محاولة الإضافة للسلة:', error);
        alert('حدث خطأ في الاتصال بالخادم.');
        icon.className = 'fa-solid fa-cart-plus';
    }

    setTimeout(() => {
        icon.className = 'fa-solid fa-cart-plus';
    }, 2000);
}


/**
 * دالة لمعالجة حدث النقر على أيقونة "إضافة للمفضلة".
 * (لا تغييرات هنا، الكود يبقى كما هو)
 */
function handleAddToFavorites(productId) {
    console.log(`تم النقر لإضافة المنتج رقم ${productId} إلى المفضلة.`);
    alert(`سيتم إضافة المنتج رقم ${productId} إلى المفضلة!`);
}