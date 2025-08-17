
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Waves } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function StyleGuidePage() {
    const { toast } = useToast();

    return (
        <div className="container mx-auto py-10 space-y-16">
            <header className="text-center">
                <h1 className="text-5xl font-headline font-bold tracking-tight">Style Guide</h1>
                <p className="text-muted-foreground mt-2 text-lg">A visual inventory of UI components and design patterns.</p>
            </header>

            {/* Colors Section */}
            <section>
                <h2 className="text-3xl font-headline font-semibold mb-6">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-primary shadow-md"></div>
                        <span className="font-medium">Primary</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-secondary shadow-md"></div>
                        <span className="font-medium">Secondary</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-accent shadow-md"></div>
                        <span className="font-medium">Accent</span>
                    </div>
                     <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-background shadow-md border"></div>
                        <span className="font-medium">Background</span>
                    </div>
                     <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-card shadow-md border"></div>
                        <span className="font-medium">Card</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 rounded-lg bg-destructive shadow-md"></div>
                        <span className="font-medium">Destructive</span>
                    </div>
                </div>
            </section>

             <Separator />

            {/* Typography Section */}
            <section>
                <h2 className="text-3xl font-headline font-semibold mb-6">Typography</h2>
                <div className="space-y-4">
                    <h1 className="text-5xl font-headline font-bold">Headline 1: The Quick Brown Fox</h1>
                    <h2 className="text-4xl font-headline font-semibold">Headline 2: Jumps Over The Lazy Dog</h2>
                    <h3 className="text-3xl font-headline font-medium">Headline 3: A Vexing Question</h3>
                    <h4 className="text-2xl font-headline">Headline 4: Of Job Security</h4>
                    <p className="text-base font-body">Body Text: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p className="text-sm text-muted-foreground font-body">Muted Text: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
            </section>

             <Separator />

            {/* Buttons Section */}
            <section>
                <h2 className="text-3xl font-headline font-semibold mb-6">Buttons</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                     <Button size="lg">Large Button</Button>
                     <Button size="sm">Small Button</Button>
                </div>
            </section>

             <Separator />

            {/* Form Elements */}
            <section>
                <h2 className="text-3xl font-headline font-semibold mb-6">Form Elements</h2>
                <Card className="max-w-xl mx-auto">
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="style-guide-name">Name</Label>
                            <Input id="style-guide-name" placeholder="Enter your name" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="style-guide-description">Description</Label>
                            <Textarea id="style-guide-description" placeholder="Enter a description" />
                        </div>
                        <div className="space-y-2">
                             <Label>Category</Label>
                             <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dresses">Dresses</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                    <SelectItem value="combos">Combos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="style-guide-switch" />
                            <Label htmlFor="style-guide-switch">Toggle me</Label>
                        </div>
                    </CardContent>
                </Card>
            </section>

             <Separator />

             {/* Interactive Components */}
            <section>
                <h2 className="text-3xl font-headline font-semibold mb-6">Interactive Components</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Component Card</CardTitle>
                            <CardDescription>This is a sample card component.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Use cards to group related information.</p>
                        </CardContent>
                    </Card>

                    {/* Alert */}
                     <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            You can use alerts to show important messages.
                        </AlertDescription>
                    </Alert>

                     {/* Tabs */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue="account" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="password">Password</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Account</CardTitle>
                                        <CardDescription>Make changes to your account here.</CardDescription>
                                    </CardHeader>
                                </Card>
                            </TabsContent>
                             <TabsContent value="password">
                                 <Card>
                                    <CardHeader>
                                        <CardTitle>Password</CardTitle>
                                        <CardDescription>Change your password here.</CardDescription>
                                    </CardHeader>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Toast */}
                     <Button onClick={() => toast({
                         title: "Scheduled: Catch up",
                         description: "Friday, February 10, 2023 at 5:57 PM"
                         })}>
                        Show Toast
                    </Button>

                    {/* Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                            </DialogHeader>
                             <DialogFooter>
                                <Button type="submit">Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Badge */}
                    <div className="flex gap-4">
                       <Badge>Default Badge</Badge>
                       <Badge variant="secondary">Secondary Badge</Badge>
                       <Badge variant="destructive">Destructive Badge</Badge>
                       <Badge variant="outline">Outline Badge</Badge>
                    </div>
                </div>
            </section>
        </div>
    );
}
