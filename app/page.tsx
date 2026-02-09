'use client';

import React from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowRight, Loader2, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authenticate } from '@/actions/auth-actions';
import Link from 'next/link';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen w-full flex bg-background font-sans overflow-hidden relative transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.02]" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {/* Left Side - Hero/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative z-10 text-foreground">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted font-[family-name:var(--font-outfit)]">
              ProcureFlow
            </span>
          </div>
        </div>

        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 leading-tight font-[family-name:var(--font-outfit)]">
            Streamline Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Supply Chain
            </span>
          </h1>
          <p className="text-lg text-muted max-w-md mb-8">
            Secure enterprise access for procurement, inventory management, and DUPA validation.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted">
              <div className="w-8 h-8 rounded-full bg-muted/10 flex items-center justify-center border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Enterprise-grade Security</span>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <div className="w-8 h-8 rounded-full bg-muted/10 flex items-center justify-center border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <div className="w-8 h-8 rounded-full bg-muted/10 flex items-center justify-center border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Role-based Access Control</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted">
          © {new Date().getFullYear()} ProcureFlow System. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-card backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative bloom */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-8 text-center relative z-10">
              <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-outfit)]">Welcome Back</h2>
              <p className="text-muted text-sm">Please enter your credentials to continue</p>
            </div>

            <form action={formAction} className="space-y-5 relative z-10">
              {errorMessage && (
                <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted ml-1">Email Address</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    className="w-full bg-background/50 border border-border rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all hover:border-border/100"
                    placeholder="Enter your email"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-medium text-muted">Password</label>
                  <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                  <input
                    name="password"
                    type="password"
                    className="w-full bg-background/50 border border-border rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all hover:border-border/100"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/25 rounded-xl font-medium text-base transition-all active:scale-[0.98] mt-2 cursor-pointer border-0 flex items-center justify-center"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center relative z-10">
              <p className="text-sm text-muted">
                Don't have an account?{' '}
                <Link href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Contact Administrator
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
