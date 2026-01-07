import { auth } from "@/auth";
import { UserNav } from "@/components/user-nav";
import { getRoleBadgeColor, getRoleDisplayName } from "@/lib/rbac";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            EduFlow
          </Link>
          <UserNav user={session.user} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {session.user.name || "User"}!
          </h1>
          <p className="text-gray-400">
            You&apos;re signed in as{" "}
            <span className="text-purple-400">{session.user.email}</span>
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Role Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4">Your Role</h2>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full border ${getRoleBadgeColor(
                session.user.role
              )}`}
            >
              <span className="text-lg font-medium">
                {getRoleDisplayName(session.user.role)}
              </span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Your access level determines what features and areas you can
              access.
            </p>
          </div>

          {/* User ID Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4">User ID</h2>
            <code className="text-sm text-purple-400 bg-black/30 px-3 py-2 rounded-lg block overflow-x-auto">
              {session.user.id}
            </code>
            <p className="mt-4 text-gray-400 text-sm">
              Your unique identifier in the system.
            </p>
          </div>

          {/* Session Info Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4">
              Session Status
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 font-medium">Active Session</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Your session is secured with JWT authentication.
            </p>
          </div>
        </div>

        {/* Role-Based Content Example */}
        {session.user.role === "SUPER_ADMIN" && (
          <div className="mt-8 bg-red-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20">
            <h2 className="text-lg font-semibold text-red-400 mb-2">
              🔐 Super Admin Panel
            </h2>
            <p className="text-gray-300">
              You have full access to all system features including user
              management, role assignments, and system configuration.
            </p>
          </div>
        )}

        {(session.user.role === "SUPER_ADMIN" ||
          session.user.role === "ADMIN") && (
          <div className="mt-8 bg-purple-500/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-lg font-semibold text-purple-400 mb-2">
              ⚙️ Admin Controls
            </h2>
            <p className="text-gray-300">
              You have access to administrative features such as content
              management and user monitoring.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
