export const getUserData = async (): Promise<{ userName: string } | null> => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;

    try {
        const response = await fetch("http://localhost:3000/api/auth/user", {
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