/**
 * ===============================================
 * الملف الرئيسي - Main JavaScript
 * للصفحة الرئيسية وال Quick Calculator
 * ===============================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Quick Calculator في الصفحة الرئيسية
    const quickCalculateBtn = document.getElementById('quickCalculateBtn');
    
    if (quickCalculateBtn) {
        quickCalculateBtn.addEventListener('click', calculateQuickLoan);
        
        // حساب تلقائي عند تغيير القيم
        const inputs = ['quickLoanAmount', 'quickLoanYears', 'quickInterestRate', 'quickSalary'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', debounce(calculateQuickLoan, 500));
            }
        });
    }
});

// دالة لتأخير التنفيذ (debounce)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// حساب القرض السريع
function calculateQuickLoan() {
    // الحصول على القيم
    const loanAmount = parseFloat(document.getElementById('quickLoanAmount').value);
    const loanYears = parseFloat(document.getElementById('quickLoanYears').value);
    const interestRate = parseFloat(document.getElementById('quickInterestRate').value);
    const salary = parseFloat(document.getElementById('quickSalary').value);
    
    // التحقق من الإدخالات
    if (!loanAmount || !loanYears || !interestRate || !salary) {
        return; // لا تفعل شيء إذا كانت القيم فارغة
    }
    
    if (loanAmount < 1000) {
        showError('quickResults', 'مبلغ القرض يجب أن يكون أكبر من 1000 ريال');
        return;
    }
    
    if (salary < 1000) {
        showError('quickResults', 'الراتب يجب أن يكون أكبر من 1000 ريال');
        return;
    }
    
    // حساب القرض (فائدة ثابتة)
    const loanDetails = calculateLoan(loanAmount, interestRate, loanYears, 'fixed');
    
    // حساب نسبة الاستقطاع
    const debtRatio = calculateDebtRatio(salary, loanDetails.monthlyPayment, 0);
    
    // تحديد نوع النسبة
    const percentageClass = getPercentageClass(debtRatio.debtRatio);
    const alertType = getAlertType(debtRatio.debtRatio);
    
    // عرض النتائج
    const resultsDiv = document.getElementById('quickResults');
    resultsDiv.className = 'result-container fade-in';
    resultsDiv.innerHTML = `
        <h3 style="color: var(--primary-dark); margin-bottom: 1.5rem; text-align: center;">
            <i class="fas fa-check-circle" style="color: var(--accent-gold);"></i>
            نتيجة الحساب السريع
        </h3>
        
        <div class="grid grid-2" style="gap: 1.5rem;">
            ${createResultHTML(
                '💳 القسط الشهري',
                formatCurrency(loanDetails.monthlyPayment),
                null,
                'هذا المبلغ اللي راح تدفعه كل شهر'
            )}
            
            ${createResultHTML(
                '📊 نسبة القسط من الراتب',
                formatPercentage(debtRatio.debtRatio, 1),
                null,
                debtRatio.message,
                percentageClass
            )}
            
            ${createResultHTML(
                '💰 إجمالي الفائدة',
                formatCurrency(loanDetails.totalInterest),
                formatPercentage(loanDetails.interestPercentage, 1),
                'المبلغ الإضافي اللي راح تدفعه فوق أصل القرض'
            )}
            
            ${createResultHTML(
                '💵 صافي راتبك بعد القسط',
                formatCurrency(debtRatio.netSalary),
                formatPercentage(debtRatio.netSalaryPercentage, 1),
                'المبلغ اللي راح يتبقى لك كل شهر'
            )}
        </div>
        
        <div class="alert ${alertType}" style="margin-top: 1.5rem;">
            <span class="alert-icon">
                ${debtRatio.debtRatio <= 25 ? '✅' : debtRatio.debtRatio <= 33 ? '⚠️' : '🚨'}
            </span>
            <div>
                <strong>تقييم الوضع المالي:</strong><br>
                ${debtRatio.message}
                ${debtRatio.debtRatio > 33 ? '<br><strong>نصيحة:</strong> حاول تقلل مبلغ القرض أو تزيد المدة عشان تخفف القسط الشهري.' : ''}
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
            <a href="calculator.html" class="btn btn-primary btn-lg">
                <i class="fas fa-calculator"></i>
                احسب بالتفصيل في الحاسبة الشاملة
            </a>
        </div>
    `;
    
    // حفظ في localStorage
    saveToLocalStorage('quickLoan', {
        loanAmount,
        loanYears,
        interestRate,
        salary,
        timestamp: Date.now()
    });
}

// تحميل القيم المحفوظة عند فتح الصفحة
window.addEventListener('load', function() {
    const savedData = loadFromLocalStorage('quickLoan');
    
    if (savedData && (Date.now() - savedData.timestamp < 24 * 60 * 60 * 1000)) { // خلال 24 ساعة
        const inputs = {
            'quickLoanAmount': savedData.loanAmount,
            'quickLoanYears': savedData.loanYears,
            'quickInterestRate': savedData.interestRate,
            'quickSalary': savedData.salary
        };
        
        Object.keys(inputs).forEach(id => {
            const element = document.getElementById(id);
            if (element && inputs[id]) {
                element.value = inputs[id];
            }
        });
    }
});
