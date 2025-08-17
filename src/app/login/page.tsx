'use client';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();
    const router = useRouter();
    const { toast } = useToast();

    const isAdminCheck = async (user: any) => {
        const adminDocRef = doc(db, 'roles', 'admin');
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            const adminEmails = adminData.emails || [];
            return adminEmails.includes(user.email!);
        }
        return false;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userIsAdmin = await isAdminCheck(userCredential.user);
            
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });

            if (userIsAdmin) {
                 router.push('/admin');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
            toast({
                title: "Login Failed",
                description: err.message,
                variant: "destructive",
            });
        }
    };

  return (
    <div className="max-w-md mx-auto">
        <Card>
        <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Login to your account</CardTitle>
            <CardDescription>
                Enter your email and password to access your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" className="w-full">Login</Button>
            </form>

            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                    Sign up
                </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
