// hooks/useAuth.ts
export function useAuth() {
    // Replace with your actual auth implementation
    const user = {
        id: 1, // Get from your auth context/state
        email: "techbrand@example.com",
        accountType: "Brand"
    };

    return { user };
}
