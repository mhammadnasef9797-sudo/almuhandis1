// انتظر حتى يتم تحميل محتوى الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageElement = document.getElementById('register-message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // امنع إعادة تحميل الصفحة

        // امسح أي رسائل سابقة
        messageElement.textContent = '';
        messageElement.className = 'message'; // إعادة تعيين الفئة

        // === الخطوة 1: قراءة البيانات من النموذج ===
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // عنوان نقطة نهاية التسجيل في الـ API
        const apiUrl = 'https://localhost:7019/api/Users/register';

        try {
            // === الخطوة 2: إرسال البيانات إلى الـ API ===
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            });

            // === الخطوة 3: معالجة الاستجابة ===

            if (response.ok) {
                // إذا نجح التسجيل
                messageElement.textContent = 'تم تسجيل حسابك بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول.';
                messageElement.classList.add('success-message');

                // انتظر قليلاً ثم قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000); // 3000 ميلي ثانية = 3 ثوانٍ

            } else {
                // إذا فشل التسجيل (مثل البريد الإلكتروني مستخدم بالفعل)
                const errorData = await response.text();
                messageElement.textContent = errorData || 'فشل تسجيل الحساب. يرجى المحاولة مرة أخرى.';
                messageElement.classList.add('error-message');
            }

        } catch (error) {
            // في حالة حدوث خطأ في الشبكة
            console.error('Error during registration:', error);
            messageElement.textContent = 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.';
            messageElement.classList.add('error-message');
        }
    });
});