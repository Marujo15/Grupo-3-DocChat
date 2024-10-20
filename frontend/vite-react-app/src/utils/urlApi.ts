// const API_BASE_URL = "http://localhost:3000/api";

// export const deleteUrl = async (urlId: string): Promise<Url[]> => {
//     const response = await fetch(`${API_BASE_URL}/url/${urlId}`, {
//         method: "DELETE",
//         credentials: "include",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });

//     if (!response.ok) {
//         throw new Error(`Erro na requisição: ${response.statusText}`);
//     }
//     await response.json();
//     return [];
// };