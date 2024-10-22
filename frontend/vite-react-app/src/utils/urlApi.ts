// import { Url } from "../interfaces/UrlInterfaces";

// const API_BASE_URL = "http://localhost:3000/api/url";

// export const getAllUrls = async (userId: string): Promise<Url[]> => {
//     try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             console.error("Token not found. Redirecting to Login Page.");
//             return [];
//         }
//         const response = await fetch(`${API_BASE_URL}/${userId}`, {
//             method: "GET",
//             credentials: "include",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`,
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`Request Error: ${response.statusText}`);
//         }

//         const urls = await response.json();
//         return urls;
//     } catch (error) {
//         console.error("Error when making the request:", error);
//         return [];
//     }
// };

// export const deleteUrl = async (urlId: string): Promise<Url[]> => {
//     const response = await fetch(`${API_BASE_URL}/${urlId}`, {
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