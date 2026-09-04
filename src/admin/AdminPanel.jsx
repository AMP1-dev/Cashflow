import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminLogin } from './AdminLogin';
import { AdminHeader } from './AdminHeader';
import { ServicesManager } from './ServicesManager';
import { PostsManager } from './PostsManager';
import { TestimonialsManager } from './TestimonialsManager';
import { LeadsManager } from './LeadsManager';
import { ConfigManager } from './ConfigManager';
import { BackupManager } from './BackupManager';

export function AdminPanel() {
  const { isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('services');

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'services' && <ServicesManager />}
        {activeTab === 'posts' && <PostsManager />}
        {activeTab === 'testimonials' && <TestimonialsManager />}
        {activeTab === 'leads' && <LeadsManager />}
        {activeTab === 'config' && <ConfigManager />}
        {activeTab === 'backup' && <BackupManager />}
      </main>
    </div>
  );
}
