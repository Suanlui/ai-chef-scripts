document.addEventListener('DOMContentLoaded', function() {
    const ingredients = document.querySelectorAll('.ingredients li');
    const instructions = document.querySelectorAll('.instructions li');
    
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', function() {
            this.style.opacity = this.style.opacity === '0.5' ? '1' : '0.5';
            this.style.textDecoration = this.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        });
    });
    
    instructions.forEach((instruction, index) => {
        instruction.addEventListener('click', function() {
            this.classList.toggle('completed');
            this.style.background = this.classList.contains('completed') ? '#e8f5e8' : '#f8f9fa';
        });
    });
    
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    header.style.transition = 'transform 0.3s ease-in-out';
    
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    const servingSize = document.querySelector('.meta-item:nth-child(3) .value');
    if (servingSize) {
        servingSize.addEventListener('click', function() {
            const current = this.textContent;
            const newSize = current === '4-6' ? '2-3' : current === '2-3' ? '8-12' : '4-6';
            this.textContent = newSize;
            
            const multiplier = newSize === '2-3' ? 0.5 : newSize === '8-12' ? 2 : 1;
            adjustIngredients(multiplier);
        });
        
        servingSize.style.cursor = 'pointer';
        servingSize.style.color = '#d73502';
        servingSize.style.fontWeight = 'bold';
    }
    
    function adjustIngredients(multiplier) {
        const ingredientsList = document.querySelectorAll('.ingredients li');
        const originalIngredients = [
            '2 lobster tails (about 1 lb total)',
            '2 tablespoons olive oil',
            '1 onion, diced',
            '2 carrots, diced',
            '2 celery stalks, diced',
            '3 cloves garlic, minced',
            '2 tablespoons tomato paste',
            '1/4 cup cognac or brandy',
            '4 cups seafood stock',
            '1 cup heavy cream',
            '2 tablespoons butter',
            '1 bay leaf',
            '1 teaspoon dried thyme',
            'Salt and pepper to taste',
            'Fresh chives for garnish'
        ];
        
        ingredientsList.forEach((item, index) => {
            if (index < originalIngredients.length) {
                const ingredient = originalIngredients[index];
                const adjustedIngredient = adjustIngredientAmount(ingredient, multiplier);
                item.textContent = adjustedIngredient;
            }
        });
    }
    
    function adjustIngredientAmount(ingredient, multiplier) {
        if (multiplier === 1) return ingredient;
        
        const fractionMap = {
            '1/4': 0.25,
            '1/3': 0.33,
            '1/2': 0.5,
            '2/3': 0.67,
            '3/4': 0.75
        };
        
        const reverseFractionMap = {
            0.25: '1/4',
            0.33: '1/3',
            0.5: '1/2',
            0.67: '2/3',
            0.75: '3/4'
        };
        
        return ingredient.replace(/(\d+(?:\/\d+)?)/g, function(match) {
            let amount = fractionMap[match] || parseFloat(match);
            let newAmount = amount * multiplier;
            
            if (newAmount < 1 && reverseFractionMap[newAmount]) {
                return reverseFractionMap[newAmount];
            }
            
            return newAmount % 1 === 0 ? newAmount.toString() : newAmount.toFixed(1);
        });
    }
});