import { Url } from "../interfaces/UrlInterfaces";

const apiUrl = import.meta.env.VITE_API_URL;

export const getAllUrls = async (): Promise<Url[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found. Redirecting to Login Page.");
            return [];
        }
        const response = await fetch(`${apiUrl}/api/url`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Request Error: ${response.statusText}`);
        }

        const urlsResponse = await response.json();
        return urlsResponse.data;
    } catch (error) {
        console.error("Error when making the request:", error);
        return [];
    }
};

export const deleteUrl = async (baseUrl: string): Promise<Url[]> => {
    const response = await fetch(`${apiUrl}/api/url`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: baseUrl }),
    });

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    await response.json();
    return [];
};

export const saveUrl = async (url: string): Promise<string> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token not found. Redirecting to Login Page.");
            return "";
        }
        const response = await fetch(`${apiUrl}/api/url/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            throw new Error(`Request Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Error when making the request:", error);
        return "";
    }
}