import jwt_decode from "jwt-decode";

export const doLogin = async (email, password) => {
    try {
        const response = await fetch('http://localhost:8080/api/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                username: email,
                password: password,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (response.ok) {
            const token = response.headers.get("x-auth-token");
            const decoded = jwt_decode(token);
            const json = await response.json();
            return {
                username: json.email,
                accessToken: token,
                accessTokenTimeout: decoded.exp * 1000, // convert to epoch
                roles: json.roles,
                userId: json.id,
                response: response,
            };
        } else {
            throw new Error("Server error occurred. Please try again.");
        }
    } catch (error) {
        throw new Error("Bad Credentials. Please try again.");
    }
};

export const doSignup = async (requestJson) => {
    try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(requestJson),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (response.ok) {
            const json = await response.json();
            return { message: json.message, response };
        } else {
            const json = await response.json();
            const message = json.message || "Server error occurred. Please try again.";
            throw new Error(message);
        }
    } catch (error) {
        throw new Error("Some error occurred. Please try again.");
    }
};
