// ====================================
// Cashophy - المعادلات المالية
// ====================================

const LoanCalculator = {
    // حساب القسط الشهري - فائدة ثابتة
    calculateFixedPayment(principal, annualRate, months) {
        const monthlyRate = annualRate / 100 / 12;
        if (monthlyRate === 0) return principal / months;
        
        const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
        return payment;
    },

    // حساب التفاصيل الكاملة للقرض
    calculateLoanDetails(principal, annualRate, years, interestType = 'fixed') {
        const months = years * 12;
        let monthlyPayment, totalInterest, totalPayment;

        if (interestType === 'fixed') {
            monthlyPayment = this.calculateFixedPayment(principal, annualRate, months);
            totalPayment = monthlyPayment * months;
            totalInterest = totalPayment - principal;
        } else {
            // فائدة متناقصة
            const schedule = this.generateReducingSchedule(principal, annualRate, months);
            totalPayment = schedule.reduce((sum, item) => sum + item.payment, 0);
            totalInterest = totalPayment - principal;
            monthlyPayment = schedule[0].payment;
        }

        return {
            monthlyPayment,
            totalInterest,
            totalPayment,
            interestRate: (totalInterest / principal) * 100,
            paymentToLoanRatio: (monthlyPayment / principal) * 100
        };
    },

    // جدول السداد - فائدة متناقصة
    generateReducingSchedule(principal, annualRate, months) {
        const schedule = [];
        let balance = principal;
        const principalPayment = principal / months;
        const monthlyRate = annualRate / 100 / 12;

        for (let i = 1; i <= months; i++) {
            const interestPayment = balance * monthlyRate;
            const payment = principalPayment + interestPayment;
            balance -= principalPayment;

            schedule.push({
                month: i,
                principal: principalPayment,
                interest: interestPayment,
                payment: payment,
                balance: Math.max(0, balance)
            });
        }

        return schedule;
    },

    // جدول السداد - فائدة ثابتة
    generateFixedSchedule(principal, annualRate, months) {
        const schedule = [];
        let balance = principal;
        const monthlyPayment = this.calculateFixedPayment(principal, annualRate, months);
        const monthlyRate = annualRate / 100 / 12;

        for (let i = 1; i <= months; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            schedule.push({
                month: i,
                principal: principalPayment,
                interest: interestPayment,
                payment: monthlyPayment,
                balance: Math.max(0, balance)
            });
        }

        return schedule;
    },

    // حساب نسبة الاستقطاع
    calculateDebtRatio(salary, monthlyPayment, otherDebts = 0) {
        const totalDebt = monthlyPayment + otherDebts;
        const ratio = (totalDebt / salary) * 100;
        
        let status, message;
        if (ratio < 25) {
            status = 'safe';
            message = 'وضعك المالي ممتاز! نسبة الاستقطاع آمنة جداً.';
        } else if (ratio < 33) {
            status = 'moderate';
            message = 'وضعك المالي جيد، لكن قريب من الحد الأعلى المسموح.';
        } else if (ratio < 50) {
            status = 'warning';
            message = 'تحذير! نسبة الاستقطاع عالية - قد تواجه ضغط مالي.';
        } else {
            status = 'danger';
            message = 'خطر! نسبة الاستقطاع مرتفعة جداً - غير مستحسن أبداً.';
        }

        return {
            ratio,
            status,
            message,
            netSalary: salary - totalDebt
        };
    },

    // حساب أقصى قرض ممكن
    calculateMaxLoan(salary, otherDebts, annualRate, years, maxRatio = 33) {
        const maxMonthlyPayment = (salary * maxRatio / 100) - otherDebts;
        const months = years * 12;
        const monthlyRate = annualRate / 100 / 12;

        if (maxMonthlyPayment <= 0) return 0;

        const maxLoan = (maxMonthlyPayment * (Math.pow(1 + monthlyRate, months) - 1)) / 
                       (monthlyRate * Math.pow(1 + monthlyRate, months));

        return Math.max(0, maxLoan);
    },

    // حساب السداد المبكر
    calculateEarlyPayment(principal, annualRate, years, earlyPaymentAmount, whenMonths) {
        const totalMonths = years * 12;
        const monthlyPayment = this.calculateFixedPayment(principal, annualRate, totalMonths);
        
        // الفائدة الكلية بدون سداد مبكر
        const originalInterest = (monthlyPayment * totalMonths) - principal;
        
        // حساب الرصيد المتبقي عند السداد المبكر
        const monthlyRate = annualRate / 100 / 12;
        let balance = principal;
        
        for (let i = 0; i < whenMonths; i++) {
            const interest = balance * monthlyRate;
            const principalPaid = monthlyPayment - interest;
            balance -= principalPaid;
        }
        
        // رصيد جديد بعد السداد المبكر
        const newBalance = balance - earlyPaymentAmount;
        if (newBalance <= 0) {
            return {
                savedInterest: originalInterest - (monthlyPayment * whenMonths - (principal - balance)),
                savedMonths: totalMonths - whenMonths,
                newBalance: 0,
                completed: true
            };
        }
        
        // حساب المدة الجديدة
        const newMonths = Math.ceil(Math.log(monthlyPayment / (monthlyPayment - newBalance * monthlyRate)) / Math.log(1 + monthlyRate));
        const newTotalPayment = monthlyPayment * newMonths;
        const newInterest = newTotalPayment - newBalance;
        
        return {
            savedInterest: originalInterest - newInterest - (balance - newBalance),
            savedMonths: totalMonths - whenMonths - newMonths,
            newBalance: newBalance,
            newMonths: newMonths,
            completed: false
        };
    },

    // مؤشر الخطر المالي (من 100)
    calculateRiskScore(debtRatio, interestRate, loanToSalaryRatio) {
        let score = 100;
        
        // تأثير نسبة الاستقطاع (50 نقطة)
        if (debtRatio < 25) score -= 0;
        else if (debtRatio < 33) score -= 15;
        else if (debtRatio < 50) score -= 35;
        else score -= 50;
        
        // تأثير نسبة الفائدة (30 نقطة)
        if (interestRate < 5) score -= 0;
        else if (interestRate < 10) score -= 10;
        else if (interestRate < 15) score -= 20;
        else score -= 30;
        
        // تأثير نسبة القرض للراتب (20 نقطة)
        if (loanToSalaryRatio < 12) score -= 0;
        else if (loanToSalaryRatio < 24) score -= 10;
        else score -= 20;
        
        return Math.max(0, score);
    }
};

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoanCalculator;
}
