// Cost tracking
const costs = { therapy: 0, emergency: 0 };

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Climate Tax Calculator loaded');
    
    // Range slider updates
    document.getElementById('therapyIncrease').addEventListener('input', function() {
        document.getElementById('therapyIncreaseValue').textContent = this.value;
    });
    
    document.getElementById('funeralIncrease').addEventListener('input', function() {
        document.getElementById('funeralIncreaseValue').textContent = this.value;
    });
    
    // Emergency checklist
    document.querySelectorAll('.supply-item').forEach(checkbox => {
        checkbox.addEventListener('change', calculateEmergency);
    });
    
    document.getElementById('restockFrequency').addEventListener('change', calculateEmergency);
    
    // Initialize emergency calc
    calculateEmergency();
});

// Scroll helper
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Format currency
function fmt(num) {
    return Math.round(num).toLocaleString('en-US');
}

// Update total counter with animation
function updateTotal(category, amount) {
    costs[category] = amount;
    const total = Object.values(costs).reduce((a, b) => a + b, 0);
    
    const el = document.getElementById('totalAmount');
    const current = parseFloat(el.textContent.replace(/,/g, '')) || 0;
    
    animateNumber(el, current, total, 800);
}

// Animate number changes
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = start + (range * easeProgress);
        
        element.textContent = fmt(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = fmt(end);
        }
    }
    
    requestAnimationFrame(update);
}

// Therapy Calculator
function calculateTherapy() {
    const sessions = parseFloat(document.getElementById('therapySessions').value) || 0;
    const cost = parseFloat(document.getElementById('therapyCost').value) || 0;
    const increase = parseFloat(document.getElementById('therapyIncrease').value) || 0;
    const years = parseInt(document.getElementById('therapyYears').value) || 1;
    
    const currentAnnual = sessions * cost * 12;
    const projectedAnnual = sessions * (1 + increase/100) * cost * 12;
    const totalAdditional = (projectedAnnual - currentAnnual) * years;
    
    document.getElementById('therapyCurrent').textContent = fmt(currentAnnual);
    document.getElementById('therapyProjected').textContent = fmt(projectedAnnual);
    document.getElementById('therapyTotal').textContent = fmt(totalAdditional);
    document.getElementById('therapyTimeframe').textContent = years;
    
    document.getElementById('therapyResult').style.display = 'block';
    
    updateTotal('therapy', projectedAnnual);
}

// Emergency Calculator
function calculateEmergency() {
    let total = 0;
    
    document.querySelectorAll('.supply-item:checked').forEach(checkbox => {
        total += parseFloat(checkbox.dataset.cost) || 0;
    });
    
    const frequency = parseInt(document.getElementById('restockFrequency').value) || 1;
    const annual = total / frequency;
    const tenYear = (total / frequency) * 10;
    
    document.getElementById('emergencyAnnual').textContent = fmt(annual);
    document.getElementById('emergencyTenYear').textContent = fmt(tenYear);
    
    updateTotal('emergency', annual);
}

// Funeral Calculator
function calculateFuneral() {
    const base = parseFloat(document.getElementById('funeralType').value) || 0;
    const plot = parseFloat(document.getElementById('cemeteryPlot').value) || 0;
    const increase = parseFloat(document.getElementById('funeralIncrease').value) || 0;
    const scenario = document.getElementById('funeralScenario').value;
    
    const baseTotal = base + plot;
    let climateIncrease = baseTotal * (increase / 100);
    
    if (scenario === 'disaster') {
        climateIncrease += baseTotal * 0.25;
    }
    
    const finalTotal = baseTotal + climateIncrease;
    
    document.getElementById('funeralBase').textContent = fmt(baseTotal);
    document.getElementById('funeralTotal').textContent = fmt(finalTotal);
    document.getElementById('funeralAdditional').textContent = fmt(climateIncrease);
    
    document.getElementById('funeralResult').style.display = 'block';
}

console.log('Climate Tax Calculator ready');
