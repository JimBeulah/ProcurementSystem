import DashboardShell from '@/components/layout/DashboardShell';

export default function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
