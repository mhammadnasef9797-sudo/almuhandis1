const scriptURL = "https://script.google.com/macros/s/AKfycbwxfWHedQILESG1XDFTWCsl2avQYOW44tkh5f6GrQjurZ2jTPCae9RN6GjMPrxjjyXH/exec"

document.getElementById("form_contact").addEventListener("submit", function(e) {
    e.preventDefault(); // منع الإرسال العادي
    
    // 1- بيانات العميل
    const form = e.target;
    const formData = new FormData(form);

    // 2- قراءة المنتجات من قسم Checkout
    const items = document.querySelectorAll("#checkout_items .item"); 
    let products = [];

    items.forEach(item => {
        let name = item.querySelector(".name")?.innerText || "Unknown";
        let price = item.querySelector(".price")?.innerText.replace("$", "") || "0";
        let qty = item.querySelector(".qty")?.innerText || "1";
        products.push(`${name} (x${qty}) - $${price}`);
    });

    // 3- تحويل المنتجات لنص
    formData.append("Products", products.join(", "));

    // 4- إرسال البيانات إلى Google Sheets
    fetch(form.action, {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        alert("✅ Order Sent Successfully!");
        form.reset();
    })
    .catch(err => {
        console.error("Error:", err);
        alert("❌ Failed to send order");
    });
});