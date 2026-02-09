import DashboardShell from '@/components/layout/DashboardShell';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    if (!session?.user) {
        redirect('/');
    }

    return (
        <DashboardShell user={session.user}>
            {children}
        </DashboardShell>
    );
}
