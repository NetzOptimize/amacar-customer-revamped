const MAKES = ['Mazda', 'Toyota', 'Honda', 'BMW', 'Audi'];
const MODELS = {
    Mazda: ['CX-30', 'CX-5', '3', '6'],
    Toyota: ['Camry', 'Corolla', 'RAV4'],
    Honda: ['Civic', 'Accord', 'CR-V'],
    BMW: ['3 Series', 'X3', 'X5'],
    Audi: ['A4', 'Q5', 'Q7'],
};

export const getMockCars = (filters = {}) => {
    const { make, model, year, budgetMin, budgetMax, condition = 'new' } = filters;
    console.log(filters);
    const cars = Array.from({ length: 12 }).map((_, i) => {
        const mk = make || MAKES[i % MAKES.length];
        const md = model || MODELS[mk][i % MODELS[mk].length];
        const yr = year || 2022 + (i % 4);
        const base = 28000 + (i % 8) * 1500;
        return {
            id: `car-${i + 1}`,
            make: mk,
            model: md,
            year: yr,
            basePrice: base,
            condition,
            images: [
                `https://picsum.photos/seed/${mk}-${md}-${i}/800/600`,
            ],
            specs: {
                mileage: condition === 'new' ? 0 : Math.floor(Math.random() * 40000),
                fuelType: 'Gasoline',
                transmission: 'Automatic',
                drivetrain: 'AWD',
            },
            dealer: {
                id: `dealer-${i + 1}`,
                name: `${mk} Center ${i + 1}`,
                location: 'Los Angeles, CA',
                rating: 4 + Math.round(Math.random() * 10) / 10,
                reviewCount: 50 + Math.floor(Math.random() * 500),
            },
            features: ['Navigation', 'Sunroof', 'Leather'].slice(0, (i % 3) + 1),
            available: true,
        };
    });
    return cars.filter((c) => {
        const withinMin = budgetMin ? c.basePrice >= budgetMin : true;
        const withinMax = budgetMax ? c.basePrice <= budgetMax : true;
        return withinMin && withinMax;
    });
};

export const generateMockDealers = (car) => {
    const base = car?.basePrice || 32000;
    return Array.from({ length: 6 }).map((_, i) => {
        const original = base + Math.floor(Math.random() * 1500);
        const current = original - (i * 250 + Math.floor(Math.random() * 200));
        return {
            id: `dealer-${i + 1}`,
            dealerId: `dealer-${i + 1}`,
            dealerName: `${car.make} Partner ${i + 1}`,
            dealerLogo: `https://picsum.photos/seed/logo-${i}/96/96`,
            location: 'Los Angeles, CA',
            rating: 4 + Math.round(Math.random() * 10) / 10,
            currentOffer: current,
            originalPrice: original,
            savings: Math.max(0, original - current),
            perks: ['3 years free service', 'Extended warranty', 'Free delivery'].slice(0, (i % 3) + 1),
            notes: 'Financing available. Offer valid until session ends.',
            timestamp: Date.now(),
            rank: i + 1,
        };
    });
};


