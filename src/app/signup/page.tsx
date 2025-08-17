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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";


export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast({
                title: "Account Created",
                description: "You have successfully signed up!",
            });
            router.push('/');
        } catch (err: any) {
            setError(err.message);
            toast({
                title: "Signup Failed",
                description: err.message,
                variant: "destructive",
            });
        }
    };


    return (
        <div className="max-w-md mx-auto">
            <Card>
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                Enter your email below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    {error && <p className="text-destructive text-sm">{error}</p>}
                    <Button type="submit" className="w-full">Create Account</Button>
                </form>

                 <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            </CardContent>
            </Card>
        </div>
    )
}
