import { app } from "@/lib/firebase";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import React from "react";
import { Spinner } from "../ui/8bit/spinner";

const auth = getAuth(app);
const AuthContext = React.createContext<User | null>(null);

export function useAuth() {
    const ctx = React.useContext(AuthContext);
    return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (current_user) => {
            setUser(current_user);
            setLoading(false);
        })

        return () => unsubscribe();
    })

    if (loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <AuthContext.Provider value={user}>
                {children}
            </AuthContext.Provider>
        )
    }
};


export const SignedIn = ({ children }: { children: React.ReactNode }) => {
    const user = useAuth();
    if (user) {
        return (
            <>
                {children}
            </>
        )
    }
}
export const SignedOut = ({ children }: { children: React.ReactNode }) => {
    const user = useAuth();
    if (!user) {
        return (
            <>
                {children}
            </>
        )
    }
}

export const Loading = () => {
    return (
        <div className="flex flex-col min-h-screen w-full items-center justify-center">
            <Spinner variant="diamond" className="size-16 text-foreground" />
        </div>
    );
}