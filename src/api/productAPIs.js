export const fetchAllProducts = async (accessToken) => {
    try {
        const response = await fetch('http://localhost:8080/api/products', {
            method: 'GET',
            headers: {
                'x-auth-token': accessToken,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return { data, response };
        } else {
            throw new Error("Server error occurred.");
        }
    } catch (error) {
        throw new Error("Some error occurred.");
    }
};

export const createProduct = async (requestJson, accessToken) => {
    try {
        const response = await fetch('http://localhost:8080/api/products', {
            method: 'POST',
            body: JSON.stringify(requestJson),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-auth-token': accessToken,
            },
        });

        if (response.ok) {
            return { message: `Product ${requestJson.name} added successfully.`, response };
        } else {
            const json = await response.json();
            const message = json.message || "Server error occurred. Please try again.";
            throw new Error(message);
        }
    } catch (error) {
        throw new Error("Some error occurred. Please try again.");
    }
};

export const deleteProduct = async (id, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': accessToken,
            },
        });

        if (response.ok) {
            return { response };
        } else {
            throw new Error("Server error occurred.");
        }
    } catch (error) {
        throw new Error("Some error occurred.");
    }
};

export const modifyProduct = async (requestJson, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${requestJson.id}`, {
            method: 'PUT',
            body: JSON.stringify(requestJson),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-auth-token': accessToken,
            },
        });

        if (response.ok) {
            return { message: `Product ${requestJson.name} modified successfully.`, response };
        } else {
            const json = await response.json();
            const message = json.message || "Server error occurred. Please try again.";
            throw new Error(message);
        }
    } catch (error) {
        throw new Error("Some error occurred. Please try again.");
    }
};

export const viewProduct = async (id, accessToken) => {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'GET',
            headers: {
                'x-auth-token': accessToken,
            },
        });

        if (response.ok) {
            const value = await response.json();
            return { value, response };
        } else {
            throw new Error("Server error occurred.");
        }
    } catch (error) {
        throw new Error("Some error occurred.");
    }
};
