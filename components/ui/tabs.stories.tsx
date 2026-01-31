import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Tabs
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you&apos;re
              done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you&apos;ll be logged
              out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check initial tab
    const accountTab = canvas.getByRole("tab", { name: /account/i });
    await expect(accountTab).toHaveAttribute("data-state", "active");

    // Switch to password tab
    const passwordTab = canvas.getByRole("tab", { name: /password/i });
    await userEvent.click(passwordTab);
    await expect(passwordTab).toHaveAttribute("data-state", "active");
  },
};

// Simple Tabs
export const Simple: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="p-4">
        Content for Tab 1
      </TabsContent>
      <TabsContent value="tab2" className="p-4">
        Content for Tab 2
      </TabsContent>
      <TabsContent value="tab3" className="p-4">
        Content for Tab 3
      </TabsContent>
    </Tabs>
  ),
};

// With Disabled Tab
export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-4">
        This tab is active.
      </TabsContent>
      <TabsContent value="disabled" className="p-4">
        You can&apos;t see this.
      </TabsContent>
      <TabsContent value="another" className="p-4">
        Another active tab.
      </TabsContent>
    </Tabs>
  ),
};

// Full Width Tabs
export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full max-w-[600px]">
      <TabsList className="w-full">
        <TabsTrigger value="overview" className="flex-1">
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex-1">
          Analytics
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex-1">
          Reports
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex-1">
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4 border rounded-b-lg">
        <h3 className="font-semibold mb-2">Overview</h3>
        <p className="text-muted-foreground">
          Your dashboard overview with key metrics and insights.
        </p>
      </TabsContent>
      <TabsContent value="analytics" className="p-4 border rounded-b-lg">
        <h3 className="font-semibold mb-2">Analytics</h3>
        <p className="text-muted-foreground">
          Detailed analytics and performance data.
        </p>
      </TabsContent>
      <TabsContent value="reports" className="p-4 border rounded-b-lg">
        <h3 className="font-semibold mb-2">Reports</h3>
        <p className="text-muted-foreground">Generate and view your reports.</p>
      </TabsContent>
      <TabsContent value="notifications" className="p-4 border rounded-b-lg">
        <h3 className="font-semibold mb-2">Notifications</h3>
        <p className="text-muted-foreground">
          Manage your notification preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// Multiple Tab Groups
export const Compact: Story = {
  render: () => (
    <Tabs defaultValue="all" className="w-[300px]">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-2 text-sm text-muted-foreground">
        All messages (12)
      </TabsContent>
      <TabsContent
        value="unread"
        className="mt-2 text-sm text-muted-foreground"
      >
        Unread messages (3)
      </TabsContent>
      <TabsContent
        value="archived"
        className="mt-2 text-sm text-muted-foreground"
      >
        Archived messages (5)
      </TabsContent>
    </Tabs>
  ),
};
