export const getUserData = async (): Promise<{ userName: string } | null> => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
        const response = await fetch(`${apiUrl}/api/auth/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
        return null;
    }
};