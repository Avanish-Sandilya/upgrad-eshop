// Rest APIs for category

export const fetchAllCategories = async (accessToken) => {
    try {
        const response = await fetch('http://localhost:8080/api/products/categories', {
            method: 'GET',
            headers: {
                'x-auth-token': accessToken,
            },
        });
        if (response.ok) {
            const json = await response.json();
            const categories = json.map(category => category.toUpperCase());
            const uniqueCategories = Array.from(new Set(categories)).sort();
            const formattedCategories = ["ALL", ...uniqueCategories];
            return { data: formattedCategories, response };
        } else {
            throw new Error("Server error occurred.");
        }
    } catch (error) {
        throw new Error("Some error occurred.");
    }
};
