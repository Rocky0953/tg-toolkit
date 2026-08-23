import React, { useState, useEffect } from 'react';
import { ActiveTab, TelegramConfig, TelegramSession } from './types';
import { DEFAULT_CONFIG, INITIAL_SESSION, runDoctorChecks } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { Terminal } from './components/Terminal';
import { ConfigManager } from './components/ConfigManager';
import { ConnectionManager } from './components/ConnectionManager';
import { SystemDoctor } from './components/SystemDoctor';
import { UsernameTools } from './components/UsernameTools';
import { PrivacyAuditor } from './components/PrivacyAuditor';
import { GroupManager } from './components/GroupManager';
import { Analytics } from './components/Analytics';
import { InviteManager } from './components/InviteManager';
import { CsvTools } from './components/CsvTools';
import { SecurityCenter } from './components/SecurityCenter';
import { UpdateChecker } from './components/UpdateChecker';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Local storage persistence for Config
  const [config, setConfig] = useState<TelegramConfig>(() => {
    try {
      const saved = localStorage.getItem('tg_toolkit_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Local storage persistence for Session
  const [session, setSession] = useState<TelegramSession>(() => {
    try {
      const saved = localStorage.getItem('tg_toolkit_session');
      return saved ? JSON.parse(saved) : INITIAL_SESSION;
    } catch {
      return INITIAL_SESSION;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tg_toolkit_config', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to persist config', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('tg_toolkit_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to persist session', e);
    }
  }, [session]);

  const handleUpdateConfig = (newConfig: Partial<TelegramConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleResetConfig = () => {
    setConfig({
      api_id: '',
      api_hash: '',
      phone: '',
    });
  };

  const handleUpdateSession = (newSession: Partial<TelegramSession>) => {
    setSession((prev) => ({ ...prev, ...newSession }));
  };

  const doctorReport = runDoctorChecks(config, session);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Header
        session={session}
        config={config}
        onOpenTerminal={() => setActiveTab('terminal')}
        onRefreshDoctor={() => setActiveTab('doctor')}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          doctorStatus={doctorReport.status}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <Overview
              config={config}
              session={session}
              doctorReport={doctorReport}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'terminal' && (
            <Terminal
              config={config}
              session={session}
              onUpdateConfig={handleUpdateConfig}
              onUpdateSession={handleUpdateSession}
            />
          )}

          {activeTab === 'config' && (
            <ConfigManager
              config={config}
              session={session}
              onSaveConfig={(cfg) => setConfig(cfg)}
              onResetConfig={handleResetConfig}
            />
          )}

          {activeTab === 'connection' && (
            <ConnectionManager
              config={config}
              session={session}
              onUpdateSession={handleUpdateSession}
            />
          )}

          {activeTab === 'doctor' && (
            <SystemDoctor
              config={config}
              session={session}
              onRefreshDoctor={() => {}}
            />
          )}

          {activeTab === 'usernames' && <UsernameTools />}

          {activeTab === 'privacy' && <PrivacyAuditor />}

          {activeTab === 'groups' && <GroupManager />}

          {activeTab === 'analytics' && <Analytics config={config} session={session} />}

          {activeTab === 'invites' && <InviteManager />}

          {activeTab === 'csv' && <CsvTools />}

          {activeTab === 'security' && <SecurityCenter config={config} session={session} />}

          {activeTab === 'updates' && <UpdateChecker />}
        </main>
      </div>
    </div>
  );
};

export default App;
