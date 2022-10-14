const formatCurrency = (n) => 
new Intl.NumberFormat('ru-Ru', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
    }).format(n);  


{
    // Навигация
    const navigationLinks = document.querySelectorAll('.navigation__link');
    const calcElem = document.querySelectorAll('.calc');

    for (let i = 0; i < navigationLinks.length; i++) {
        navigationLinks[i].addEventListener('click', (e) => {
            e.preventDefault();
            for (let j = 0; j < calcElem.length; j++) {
            if (navigationLinks[i].dataset.tax === calcElem[j].dataset.tax) {
                calcElem[j].classList.add('calc_active');
                navigationLinks[i].classList.add('navigation__link_active');
            } else {
                calcElem[j].classList.remove('calc_active');
                navigationLinks[j].classList.remove('navigation__link_active');
            }
            }
        });
    } 
}


{
     // АУСН
    const ausn = document.querySelector('.ausn');
    const formAusn = ausn.querySelector('.calc__form');
    const resultTaxTotal = ausn.querySelector('.result__tax_total');
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

    calcLabelExpenses.style.display = 'none';
    formAusn.addEventListener('input', () => {
        if (formAusn.type.value === 'income') {
            calcLabelExpenses.style.display = 'none';
        resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08); 
        formAusn.expenses.value = '';
        }
        if (formAusn.type.value === 'expenses') {
            calcLabelExpenses.style.display = '';
        resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2); 
        }
        
    });
}


{
    // Самозанятый и ИП НПД

    const selfEmployment = document.querySelector('.self-employment');
    const selfEmploymentForm = selfEmployment.querySelector('.calc__form');
    const resultSelfEmploymentTax = selfEmployment.querySelector('.result__tax');
    const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
    const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
    const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
    const resultTaxResCompensation = selfEmployment.querySelector('.result__tax_res-compensation');
    const resultTaxResult = selfEmployment.querySelector('.result__tax_result');


    const checkCompensation = () => {
    const setDisplay = selfEmploymentForm.addCompensation.checked ? '' : 'none';
    calcCompensation.style.display = setDisplay;

    resultBlockCompensation.forEach((elem) => {
        elem.style.display = setDisplay;
    })
    };
    checkCompensation();

    selfEmploymentForm.addEventListener('input', () => {

        const resIndividual = selfEmploymentForm.individual.value * 0.04; 
        const resEntity = selfEmploymentForm.entity.value * 0.06;

        checkCompensation();

        const tax = resIndividual + resEntity;
        selfEmploymentForm.compensation.value = 
        selfEmploymentForm.compensation.value > 10_000
        ? 10_000 
        : selfEmploymentForm.compensation.value;
        
        const benefit = selfEmploymentForm.compensation.value;
        const resBenefit = selfEmploymentForm.individual.value * 0.01 +
                selfEmploymentForm.entity.value * 0.02;
        const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
        const finalTax = tax - (benefit - finalBenefit);

        resultSelfEmploymentTax.textContent = formatCurrency(tax); 
        resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit); 
        resultTaxResCompensation.textContent = formatCurrency(finalBenefit); 
        resultTaxResult.textContent = formatCurrency(finalTax);    
    });

}

{
    // ОСН / ОСНО

    const osno = document.querySelector('.osno');
    const formOsno = osno.querySelector('.calc__form');


    const ndflExpenses = osno.querySelector('.result__block_hdfl-expenses');
    const ndflIncome = osno.querySelector('.result__block_ndfl-income');
    const profit = osno.querySelector('.result__block_profit');
    const resultTaxNds = osno.querySelector('.result__tax-nds');
    const resultTaxProperty = osno.querySelector('.result__tax-property');

    const resultTaxNdflExpenses = osno.querySelector('.result__tax-ndfl-expenses');
    const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
    const resultTaxProfit = osno.querySelector('.result__tax_profit');

    const checkFormBusiness = () => {
        if (formOsno.formBusiness.value === 'IP') {
            ndflExpenses.style.display = '';
            ndflIncome.style.display = '';
            profit.style.display = 'none';
        }
        if (formOsno.formBusiness.value === 'OOO') {
            ndflExpenses.style.display = 'none';
            ndflIncome.style.display = 'none';
            profit.style.display = '';
        }
    };


    formOsno.addEventListener('input', () => {
        checkFormBusiness();
        const income = formOsno.income.value;
        const expenses = formOsno.expenses.value;
        const property = formOsno.property.value;

        const nds = income * 0.2;
        const taxProperty = property * 0.02;
        const profit = income - expenses;
        const ndflExpensesTotal = profit * 0.13;
        const ndflIncomeTotal = (income - nds) * 0.13;
        const taxProfit = profit * 0.2;

        resultTaxNds.textContent = nds;
        resultTaxProperty.textContent = taxProperty;
        resultTaxNdflExpenses.textContent = ndflExpensesTotal;
        resultTaxNdflIncome.textContent = ndflIncomeTotal;
        resultTaxProfit.textContent = taxProfit;
        
    });

}

{
// УСН

    const LIMIT = 300_000;
    const usn = document.querySelector('.usn');
    const usnForm = usn.querySelector('.calc__form');

    const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
    const calcLabelProperty = usn.querySelector('.calc__label-property');
    const resultBlockProperty = usn.querySelector('.result__block_property');

    const resultTaxTotal = usn.querySelector('.result__tax_total');
    const resultTaxProperty = usn.querySelector('.result__tax_property');

    const checkShopProperty = (typeTax) => {
        switch (typeTax) {
            case 'income': {
                calcLabelExpenses.style.display = 'none';
                calcLabelProperty.style.display = 'none';
                resultBlockProperty.style.display = 'none';

                usnForm.expenses.value = '';
                usnForm.property.value = '';
                break;
            };
            case 'ip-expenses': {
                calcLabelExpenses.style.display = '';
                calcLabelProperty.style.display = 'none';
                resultBlockProperty.style.display = 'none';

                usnForm.property.value = '';
                break;
            };
            case 'ooo-expenses': {
                calcLabelExpenses.style.display = '';
                calcLabelProperty.style.display = '';
                resultBlockProperty.style.display = '';
                break;
            };

        }
    }

    const persent = {
        'income': 0.06,
        'ip-expenses': 0.15,
        'ooo-expenses': 0.15,
    }

    checkShopProperty(usnForm.typeTax.value);

    usnForm.addEventListener('input', () => {
        checkShopProperty(usnForm.typeTax.value);

    
        const income = usnForm.income.value;
        const expenses = usnForm.expenses.value;
        const contribution = usnForm.contribution.value;
        const property = usnForm.property.value;

        let profit = income - contribution;

        if (usnForm.typeTax.value !== 'income') {
            profit -= expenses;
        }

        const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
        const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
        const tax = summ * persent[usnForm.typeTax.value];
        const taxProperty = property * 0.02;

        resultTaxTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
        resultTaxProperty.textContent = formatCurrency(taxProperty);

    });
}


{
    // Налоговый вычет
    
}
