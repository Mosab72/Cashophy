// ====================================
// Cashophy - الوظائف العامة والمساعدة
// ====================================

// تنسيق الأرقام
function formatNumber(num) {
    return new Intl.NumberFormat('ar-SA').format(Math.round(num));
}

// تنسيق العملة
function formatCurrency(num) {
    return formatNumber(num) + ' ريال';
}

// تنسيق النسبة المئوية
function formatPercentage(num) {
    return num.toFixed(2) + '%';
}

// الحصول على class حسب النسبة
function getRatioClass(ratio) {
    if (ratio < 25) return 'success';
    if (ratio < 33) return 'warning';
    return 'danger';
}

// الحصول على رسالة حسب النسبة
function getRatioMessage(ratio) {
    if (ratio < 25) return '✓ نسبة آمنة جداً';
    if (ratio < 33) return '⚠ نسبة مقبولة';
    return '✗ نسبة خطيرة';
}

// حفظ في localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('خطأ في الحفظ:', e);
    }
}

// قراءة من localStorage
function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('خطأ في القراءة:', e);
        return null;
    }
}

// التحقق من صحة الإدخال
function validateInput(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

// عرض رسالة تنبيه
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

// إخفاء/إظهار عنصر
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// التمرير السلس لعنصر
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// طباعة الصفحة
function printPage() {
    window.print();
}

// تصدير جدول إلى CSV
function exportTableToCSV(tableId, filename = 'table.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols).map(col => col.textContent);
        csv.push(rowData.join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// حساب سريع - الصفحة الرئيسية
function quickCalculate() {
    const principal = parseFloat(document.getElementById('quick-amount')?.value) || 0;
    const years = parseFloat(document.getElementById('quick-years')?.value) || 0;
    const rate = parseFloat(document.getElementById('quick-rate')?.value) || 0;
    
    if (!validateInput(principal, 1000) || !validateInput(years, 0.5, 30) || !validateInput(rate, 0.1, 20)) {
        showAlert('الرجاء إدخال قيم صحيحة', 'danger');
        return;
    }
    
    const result = LoanCalculator.calculateLoanDetails(principal, rate, years, 'fixed');
    
    const resultDiv = document.getElementById('quick-result');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-item">
                <div class="result-label">القسط الشهري</div>
                <div class="result-value">${formatCurrency(result.monthlyPayment)}</div>
            </div>
            <div class="result-item">
                <div class="result-label">إجمالي الفائدة</div>
                <div class="result-value">${formatCurrency(result.totalInterest)}</div>
                <span class="result-percentage">${formatPercentage(result.interestRate)}</span>
            </div>
            <div class="result-item">
                <div class="result-label">إجمالي المدفوع</div>
                <div class="result-value">${formatCurrency(result.totalPayment)}</div>
            </div>
        `;
        resultDiv.style.display = 'block';
    }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمعات الأحداث للحاسبة السريعة
    const quickBtn = document.getElementById('quick-calc-btn');
    if (quickBtn) {
        quickBtn.addEventListener('click', quickCalculate);
    }
    
    // تفعيل القائمة في الجوال
    const navToggle = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // تحميل البيانات المحفوظة
    const savedData = loadFromStorage('cashophy-last-calc');
    if (savedData) {
        console.log('تم تحميل البيانات المحفوظة');
    }
});

// حفظ البيانات قبل مغادرة الصفحة
window.addEventListener('beforeunload', function() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = input.value;
        }
    });
    saveToStorage('cashophy-last-calc', formData);
});
