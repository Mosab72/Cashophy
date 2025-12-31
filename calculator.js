/**
 * ===============================================
 * المعادلات المالية - Calculator Functions
 * جميع الحسابات المتعلقة بالقروض والفوائد
 * ===============================================
 */

/**
 * حساب القسط الشهري للفائدة الثابتة (Fixed Rate)
 * المعادلة: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 * 
 * @param {number} principal - مبلغ القرض الأساسي
 * @param {number} annualRate - نسبة الفائدة السنوية (%)
 * @param {number} months - مدة القرض بالأشهر
 * @returns {number} - القسط الشهري
 */
function calculateFixedMonthlyPayment(principal, annualRate, months) {
  if (annualRate === 0) {
    return principal / months;
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
  
  return payment;
}

/**
 * حساب القسط الشهري للفائدة المتناقصة (Reducing Rate)
 * القسط الأول = (مبلغ القرض / عدد الأشهر) + (مبلغ القرض * نسبة الفائدة الشهرية)
 * 
 * @param {number} principal - مبلغ القرض الأساسي
 * @param {number} annualRate - نسبة الفائدة السنوية (%)
 * @param {number} months - مدة القرض بالأشهر
 * @returns {object} - {firstPayment, lastPayment, averagePayment}
 */
function calculateReducingMonthlyPayment(principal, annualRate, months) {
  const monthlyPrincipal = principal / months;
  const monthlyRate = annualRate / 100 / 12;
  
  // أول قسط (أعلى قسط)
  const firstPayment = monthlyPrincipal + (principal * monthlyRate);
  
  // آخر قسط (أقل قسط)
  const lastPayment = monthlyPrincipal + (monthlyPrincipal * monthlyRate);
  
  // متوسط القسط
  const averagePayment = (firstPayment + lastPayment) / 2;
  
  return {
    firstPayment,
    lastPayment,
    averagePayment
  };
}

/**
 * حساب إجمالي الفائدة للفائدة الثابتة
 * 
 * @param {number} monthlyPayment - القسط الشهري
 * @param {number} months - عدد الأشهر
 * @param {number} principal - مبلغ القرض الأساسي
 * @returns {number} - إجمالي الفائدة
 */
function calculateTotalInterestFixed(monthlyPayment, months, principal) {
  const totalPaid = monthlyPayment * months;
  return totalPaid - principal;
}

/**
 * حساب إجمالي الفائدة للفائدة المتناقصة
 * 
 * @param {number} principal - مبلغ القرض الأساسي
 * @param {number} annualRate - نسبة الفائدة السنوية (%)
 * @param {number} months - مدة القرض بالأشهر
 * @returns {number} - إجمالي الفائدة
 */
function calculateTotalInterestReducing(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPrincipal = principal / months;
  
  let totalInterest = 0;
  let remainingBalance = principal;
  
  for (let i = 0; i < months; i++) {
    const interestForMonth = remainingBalance * monthlyRate;
    totalInterest += interestForMonth;
    remainingBalance -= monthlyPrincipal;
  }
  
  return totalInterest;
}

/**
 * حساب القرض الكامل (شامل جميع التفاصيل)
 * 
 * @param {number} principal - مبلغ القرض
 * @param {number} annualRate - نسبة الفائدة السنوية (%)
 * @param {number} years - مدة القرض بالسنوات
 * @param {string} interestType - نوع الفائدة ('fixed' or 'reducing')
 * @returns {object} - كامل تفاصيل القرض
 */
function calculateLoan(principal, annualRate, years, interestType = 'fixed') {
  const months = Math.round(years * 12);
  
  let monthlyPayment, totalInterest, totalAmount;
  let paymentDetails = {};
  
  if (interestType === 'reducing') {
    const reducingPayment = calculateReducingMonthlyPayment(principal, annualRate, months);
    monthlyPayment = reducingPayment.averagePayment;
    totalInterest = calculateTotalInterestReducing(principal, annualRate, months);
    paymentDetails = reducingPayment;
  } else {
    monthlyPayment = calculateFixedMonthlyPayment(principal, annualRate, months);
    totalInterest = calculateTotalInterestFixed(monthlyPayment, months, principal);
  }
  
  totalAmount = principal + totalInterest;
  
  const interestPercentage = (totalInterest / principal) * 100;
  const monthlyPaymentPercentage = (monthlyPayment / principal) * 100;
  
  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    interestPercentage: interestPercentage,
    monthlyPaymentPercentage: monthlyPaymentPercentage,
    months: months,
    interestType: interestType,
    ...paymentDetails
  };
}

/**
 * حساب نسبة الاستقطاع من الراتب
 * 
 * @param {number} salary - الراتب الشهري
 * @param {number} monthlyPayment - القسط الشهري
 * @param {number} otherCommitments - الالتزامات الأخرى
 * @returns {object} - تفاصيل الاستقطاع
 */
function calculateDebtRatio(salary, monthlyPayment, otherCommitments = 0) {
  const totalCommitments = monthlyPayment + otherCommitments;
  const debtRatio = (totalCommitments / salary) * 100;
  const netSalary = salary - totalCommitments;
  const netSalaryPercentage = (netSalary / salary) * 100;
  
  let status, message;
  
  if (debtRatio <= 25) {
    status = 'safe';
    message = 'وضعك المالي ممتاز وآمن جداً 👍';
  } else if (debtRatio <= 33) {
    status = 'acceptable';
    message = 'وضعك المالي مقبول، لكن انتبه من زيادة الالتزامات ⚠️';
  } else if (debtRatio <= 40) {
    status = 'warning';
    message = 'نسبة الاستقطاع عالية! حاول تقليل الالتزامات 🔴';
  } else {
    status = 'danger';
    message = 'نسبة الاستقطاع خطيرة جداً! راح تؤثر على حياتك اليومية 🚨';
  }
  
  return {
    totalCommitments: Math.round(totalCommitments),
    debtRatio: debtRatio,
    netSalary: Math.round(netSalary),
    netSalaryPercentage: netSalaryPercentage,
    status: status,
    message: message
  };
}

/**
 * حساب أقصى مبلغ قرض يمكن الحصول عليه بأمان
 * 
 * @param {number} salary - الراتب الشهري
 * @param {number} annualRate - نسبة الفائدة السنوية (%)
 * @param {number} years - مدة القرض المطلوبة بالسنوات
 * @param {number} otherCommitments - الالتزامات الحالية
 * @param {number} maxDebtRatio - الحد الأقصى للاستقطاع (% من الراتب)
 * @returns {object} - تفاصيل القدرة على الاقتراض
 */
function calculateBorrowingCapacity(salary, annualRate, years, otherCommitments = 0, maxDebtRatio = 33) {
  const months = years * 12;
  const maxMonthlyPayment = (salary * (maxDebtRatio / 100)) - otherCommitments;
  
  if (maxMonthlyPayment <= 0) {
    return {
      maxLoanAmount: 0,
      monthlyPayment: 0,
      debtRatio: 0,
      status: 'cannot_borrow',
      message: 'للأسف، التزاماتك الحالية تمنعك من الاقتراض بشكل آمن'
    };
  }
  
  // حساب المبلغ بناءً على القسط الشهري المتاح
  const monthlyRate = annualRate / 100 / 12;
  let maxLoanAmount;
  
  if (monthlyRate === 0) {
    maxLoanAmount = maxMonthlyPayment * months;
  } else {
    maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / 
                    (monthlyRate * Math.pow(1 + monthlyRate, months));
  }
  
  const actualDebtRatio = (maxMonthlyPayment / salary) * 100;
  
  let status, message;
  if (actualDebtRatio <= 25) {
    status = 'excellent';
    message = 'قدرتك على الاقتراض ممتازة 👍';
  } else if (actualDebtRatio <= 33) {
    status = 'good';
    message = 'قدرتك على الاقتراض جيدة ✓';
  } else {
    status = 'limited';
    message = 'قدرتك على الاقتراض محدودة ⚠️';
  }
  
  return {
    maxLoanAmount: Math.round(maxLoanAmount),
    monthlyPayment: Math.round(maxMonthlyPayment),
    debtRatio: actualDebtRatio,
    status: status,
    message: message
  };
}

/**
 * حساب جدول السداد الشهري
 * 
 * @param {number} principal - مبلغ القرض
 * @param {number} annualRate - نسبة الفائدة السنوية (%)
 * @param {number} months - عدد الأشهر
 * @param {string} interestType - نوع الفائدة
 * @returns {array} - مصفوفة تحتوي على تفاصيل كل قسط
 */
function generatePaymentSchedule(principal, annualRate, months, interestType = 'fixed') {
  const schedule = [];
  const monthlyRate = annualRate / 100 / 12;
  
  if (interestType === 'reducing') {
    const monthlyPrincipal = principal / months;
    let remainingBalance = principal;
    
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const totalPayment = monthlyPrincipal + interestPayment;
      remainingBalance -= monthlyPrincipal;
      
      schedule.push({
        month: i,
        principalPayment: Math.round(monthlyPrincipal),
        interestPayment: Math.round(interestPayment),
        totalPayment: Math.round(totalPayment),
        remainingBalance: Math.max(0, Math.round(remainingBalance))
      });
    }
  } else {
    const monthlyPayment = calculateFixedMonthlyPayment(principal, annualRate, months);
    let remainingBalance = principal;
    
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      schedule.push({
        month: i,
        principalPayment: Math.round(principalPayment),
        interestPayment: Math.round(interestPayment),
        totalPayment: Math.round(monthlyPayment),
        remainingBalance: Math.max(0, Math.round(remainingBalance))
      });
    }
  }
  
  return schedule;
}

/**
 * حساب الوفورات من السداد المبكر
 * 
 * @param {number} principal - مبلغ القرض الأصلي
 * @param {number} annualRate - نسبة الفائدة السنوية (%)
 * @param {number} months - مدة القرض الكلية بالأشهر
 * @param {number} paidMonths - عدد الأشهر المدفوعة
 * @param {number} earlyPaymentAmount - مبلغ السداد المبكر
 * @returns {object} - تفاصيل الوفورات
 */
function calculateEarlyPaymentSavings(principal, annualRate, months, paidMonths, earlyPaymentAmount) {
  const monthlyPayment = calculateFixedMonthlyPayment(principal, annualRate, months);
  const monthlyRate = annualRate / 100 / 12;
  
  // حساب الرصيد المتبقي
  let remainingBalance = principal;
  for (let i = 0; i < paidMonths; i++) {
    const interest = remainingBalance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    remainingBalance -= principalPaid;
  }
  
  // الفائدة المتبقية بدون سداد مبكر
  const remainingMonths = months - paidMonths;
  const totalRemainingPayments = monthlyPayment * remainingMonths;
  const interestWithoutEarlyPayment = totalRemainingPayments - remainingBalance;
  
  // الرصيد الجديد بعد السداد المبكر
  const newBalance = remainingBalance - earlyPaymentAmount;
  
  if (newBalance <= 0) {
    return {
      interestSaved: Math.round(interestWithoutEarlyPayment),
      timeSaved: remainingMonths,
      newMonthlyPayment: 0,
      newBalance: 0,
      totalSavings: Math.round(interestWithoutEarlyPayment)
    };
  }
  
  // حساب المدة الجديدة بنفس القسط
  const newMonths = Math.ceil(Math.log(monthlyPayment / (monthlyPayment - newBalance * monthlyRate)) / 
                              Math.log(1 + monthlyRate));
  const timeSaved = remainingMonths - newMonths;
  
  // الفائدة الجديدة
  const newTotalPayments = monthlyPayment * newMonths;
  const interestWithEarlyPayment = newTotalPayments - newBalance;
  const interestSaved = interestWithoutEarlyPayment - interestWithEarlyPayment;
  
  return {
    interestSaved: Math.round(interestSaved),
    timeSaved: timeSaved,
    newMonthlyPayment: Math.round(monthlyPayment),
    newBalance: Math.round(newBalance),
    totalSavings: Math.round(interestSaved)
  };
}

// تصدير الدوال
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateFixedMonthlyPayment,
    calculateReducingMonthlyPayment,
    calculateLoan,
    calculateDebtRatio,
    calculateBorrowingCapacity,
    generatePaymentSchedule,
    calculateEarlyPaymentSavings
  };
}
