"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useColorTheme, colorThemes } from "@/components/color-theme-provider";

export default function Home() {
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" flex h-14 items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Nova UI</span>
            <Badge variant="secondary">shadcn/ui</Badge>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className=" mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Nova Style Design System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Sharp edges, high contrast, and minimal aesthetics. Built with
            shadcn/ui and featuring multiple color schemes for your Next.js
            application.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Color Schemes</h2>
          <div className="flex flex-wrap gap-3">
            {colorThemes.map((theme) => (
              <Button
                key={theme.value}
                variant={colorTheme === theme.value ? "default" : "outline"}
                onClick={() => setColorTheme(theme.value)}
                className="gap-2"
              >
                <span
                  className="h-4 w-4 border"
                  style={{ backgroundColor: theme.color }}
                />
                {theme.name}
              </Button>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Components</h2>

          <Tabs defaultValue="buttons" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
            </TabsList>

            <TabsContent value="buttons" className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Alpha</CardTitle>
                    <CardDescription>
                      A cutting-edge application with Nova style design.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">shadcn</p>
                        <p className="text-xs text-muted-foreground">Creator</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">View Project</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>Your weekly performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views</span>
                      <span className="font-semibold">12,543</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Clicks</span>
                      <span className="font-semibold">2,891</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversions</span>
                      <span className="font-semibold">421</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage your preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notif">Email</Label>
                      <Switch id="email-notif" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notif">Push</Label>
                      <Switch id="push-notif" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notif">SMS</Label>
                      <Switch id="sms-notif" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="forms" className="space-y-6">
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Enter your details to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1">Create</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="my-8" />

        <section className="text-center py-8">
          <p className="text-muted-foreground">
            Built with Next.js, Tailwind CSS, and shadcn/ui
          </p>
        </section>
      </main>
    </div>
  );
}
