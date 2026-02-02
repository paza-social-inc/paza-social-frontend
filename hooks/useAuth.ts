// hooks/useAuth.ts
export function useAuth() {
    // Replace with your actual auth implementation
    const user = {
        id: 2, // Get from your auth context/state
        email: "techbrand@example.com",
        accountType: "Brand"
    };

    return { user };
}
