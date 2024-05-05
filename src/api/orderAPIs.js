export const createOrder = async (requestJson, accessToken) => {
    try {
        const response = await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            body: JSON.stringify(requestJson),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'x-auth-token': accessToken,
            },
        });

        if (response.ok) {
            return { response };
        } else {
            throw new Error("Some error occurred. Please try again.");
        }
    } catch (error) {
        throw new Error("Server error occurred. Please try again.");
    }
};
