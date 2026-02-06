'use client';

import React from 'react';
import { Users, Database, Settings as SettingsIcon } from 'lucide-react';
import UserManagementClient from './UserManagementClient';
import BackupSettings from './BackupSettings';
import SystemSettings from './SystemSettings';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';

interface SettingsLayoutProps {
    users: any[];
}

export default function SettingsLayout({ users }: SettingsLayoutProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Accordion defaultValue="users" className="space-y-4">
                <AccordionItem value="users">
                    <AccordionTrigger value="users" icon={Users}>
                        User Management
                    </AccordionTrigger>
                    <AccordionContent value="users">
                        <UserManagementClient users={users} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="backup">
                    <AccordionTrigger value="backup" icon={Database}>
                        Backup & Recovery
                    </AccordionTrigger>
                    <AccordionContent value="backup">
                        <BackupSettings />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="system">
                    <AccordionTrigger value="system" icon={SettingsIcon}>
                        System Configuration
                    </AccordionTrigger>
                    <AccordionContent value="system">
                        <SystemSettings />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
