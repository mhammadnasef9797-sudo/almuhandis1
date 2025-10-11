// انتظر حتى يتم تحميل محتوى الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    // ابحث عن نموذج تسجيل الدخول في الصفحة
    const loginForm = document.getElementById('login-form');
    // ابحث عن العنصر الذي سنعرض فيه رسائل الخطأ
    const errorMessage = document.getElementById('login-error');

    // أضف "مستمع حدث" لينتظر قيام المستخدم بإرسال النموذج
    loginForm.addEventListener('submit', async (event) => {
        // امنع السلوك الافتراضي للنموذج (وهو إعادة تحميل الصفحة)
        event.preventDefault();

        // امسح أي رسالة خطأ سابقة
        errorMessage.textContent = '';

        // === الخطوة 1: قراءة البيانات من حقول الإدخال ===
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // عنوان نقطة نهاية تسجيل الدخول في الـ API
        const apiUrl = 'https://localhost:7019/api/Users/login';

        try {
            // === الخطوة 2: إرسال البيانات إلى الـ API ===
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    // نخبر الخادم أننا نرسل بيانات بصيغة JSON
                    'Content-Type': 'application/json'
                },
                // قم بتحويل بيانات JavaScript إلى سلسلة نصية بصيغة JSON
                body: JSON.stringify({ email: email, password: password })
            });

            // === الخطوة 3: معالجة الاستجابة ===

            // إذا كان الطلب ناجحًا (مثل استجابة 200 OK)
            if (response.ok) {
                const data = await response.json();
                
                // ** هذه هي الخطوة الأهم **
                // قم بتخزين التوكن الذي عاد من الـ API في التخزين المحلي للمتصفح
                localStorage.setItem('jwtToken', data.token);
                
                // بعد التخزين الناجح، قم بتوجيه المستخدم إلى صفحة المنتجات
                window.location.href = 'products.html';

            } else {
                // إذا فشل الطلب (مثل 401 Unauthorized)
                const errorData = await response.text(); // اقرأ رسالة الخطأ كنص
                errorMessage.textContent = errorData || 'فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.';
            }

        } catch (error) {
            // في حالة حدوث خطأ في الشبكة
            console.error('Error during login:', error);
            errorMessage.textContent = 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.';
        }
    });
});