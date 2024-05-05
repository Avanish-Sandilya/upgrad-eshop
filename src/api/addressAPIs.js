// Rest APIs for address

export const fetchAllAddresses = async (accessToken) => {
    try {
        const response = await fetch('http://localhost:8080/api/addresses', {
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

export const createAddress = async (requestJson, accessToken) => {
    try {
        const response = await fetch('http://localhost:8080/api/addresses', {
            method: 'POST',
            body: JSON.stringify(requestJson),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-auth-token': accessToken,
            },
        });
        const json = await response.json();
        if (response.ok) {
            return {
                message: `Product ${requestJson.name} added successfully.`,
                response,
            };
        } else {
            const message = json.message || "Server error occurred. Please try again.";
            throw new Error(message);
        }
    } catch (error) {
        throw new Error("Some error occurred. Please try again.");
    }
};
