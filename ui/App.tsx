import React, { useEffect, useState, useMemo } from 'react';
import { ShieldAlert, Construction, RefreshCcw, Layout, Database, Clock, Sparkles } from 'lucide-react';
import Sidebar, { PageId } from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import MetricCard from './components/dashboard/MetricCard';
import NetworkTrafficChart from './components/dashboard/NetworkTrafficChart';
import ProtocolDistribution from './components/dashboard/ProtocolDistribution';
import RecentAlertsTable from './components/dashboard/RecentAlertsTable';
import TopThreatsPanel from './components/dashboard/TopThreatsPanel';

import DashboardPage from './pages/DashboardPage';
import DetectionsPage from './pages/DetectionsPage';
import AlertPage from './pages/AlertPage';
import AssetsPage from './pages/AssetsPage';
import ThreatHuntingPage from './pages/ThreatHuntingPage';
import NetworkViewPage from './pages/NetworkViewPage';
import DetectionRulesPage from './pages/DetectionRulesPage';
import PlatformHealthPage from './pages/PlatformHealthPage';
import SettingsPage from './pages/SettingsPage';
import LogsPage from './pages/LogsPage';
import ReportsPage from './pages/ReportsPage';
import AssetDetailPage from './pages/AssetDetailPage';
import InvestigationsPage from './pages/InvestigationsPage';
import OperationsPage from './pages/OperationsPage';
import UseCasesCatalogPage from './pages/UseCasesCatalogPage';
import UseCaseDetailPage from './pages/UseCaseDetailPage';

import { fetchDashboardOverview, fetchNetworkTraffic, fetchProtocolDistribution } from './api/dashboard';
import { fetchRecentAlerts } from './api/detections';
import { fetchTopThreats } from './api/threats';

import { DashboardOverview, TrafficPoint, ProtocolData, Alert, ThreatCategory } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [selectedAssetIp, setSelectedAssetIp] = useState<string | null>(null);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState<string | null>(null);
  
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  const handlePageChange = (id: PageId) => {
    setActivePage(id);
    setSelectedAssetIp(null);
  };

  const handleDashboardNavigation = (id: PageId, filters?: any) => {
    setActivePage(id);
    // In a real app, we would apply filters to the target page's state here
    console.log(`Navigating to ${id} with filters:`, filters);
  };

  const renderContent = () => {
    if ((activePage === 'assets' || activePage === 'assets-inventory') && selectedAssetIp) {
      return <AssetDetailPage ip={selectedAssetIp} onBack={() => setSelectedAssetIp(null)} />;
    }
  
    if (activePage.startsWith('settings')) {
      if (activePage === 'settings-health') return <PlatformHealthPage />;
      return <SettingsPage key={activePage} currentView={activePage} />;
    }
  
    if (activePage.startsWith('operations')) {
      return <OperationsPage key={activePage} currentView={activePage} />;
    }
  
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleDashboardNavigation} />;
      
      // Detections
      case 'detections': 
        return <DetectionsPage key="detections-feed" defaultView="feed" />;
      case 'detections-feed': 
        return <DetectionsPage key="detections-feed" defaultView="feed" />;
      case 'detections-analytics': 
        return <DetectionsPage key="detections-analytics" defaultView="stats" />;

        case 'alert-feed':
    return <AlertPage />;
      
      // Investigations
      case 'investigations': 
        return <InvestigationsPage key="investigations-list" defaultView="list" />;
      case 'investigations-list': 
        return <InvestigationsPage key="investigations-list" defaultView="list" />;
      case 'investigations-analytics': 
        return <InvestigationsPage key="investigations-analytics" defaultView="analytics" />;
      
      // Threat Hunting
      case 'threat-hunting': 
        return <ThreatHuntingPage key="threat-hunting-builder" defaultView="builder" />;
      case 'threat-hunting-builder': 
        return <ThreatHuntingPage key="threat-hunting-builder" defaultView="builder" />;
      case 'threat-hunting-history': 
        return <ThreatHuntingPage key="threat-hunting-history" defaultView="history" />;
      
      // Assets
      case 'assets': 
        return <AssetsPage key="assets-inventory" defaultView="inventory" onSelectAsset={setSelectedAssetIp} />;
      case 'assets-inventory': 
        return <AssetsPage key="assets-inventory" onSelectAsset={setSelectedAssetIp} defaultView="inventory" />;
      case 'assets-analytics': 
        return <AssetsPage key="assets-analytics" onSelectAsset={setSelectedAssetIp} defaultView="stats" />;
      
      // Use Cases
      case 'use-cases':
        return <UseCasesCatalogPage 
          key="use-cases-catalog" 
          onSelectUseCase={(id) => {
            setSelectedUseCaseId(id);
            setActivePage('use-cases-detail');
          }} 
        />;
      case 'use-cases-catalog':
        return <UseCasesCatalogPage 
          key="use-cases-catalog" 
          onSelectUseCase={(id) => {
            setSelectedUseCaseId(id);
            setActivePage('use-cases-detail');
          }} 
        />;
      case 'use-cases-detail':
        return <UseCaseDetailPage 
          key="use-cases-detail" 
          useCaseId={selectedUseCaseId} 
          onBack={() => {
            setActivePage('use-cases-catalog');
            setSelectedUseCaseId(null);
          }} 
        />;
      
      // Logs
      case 'logs': 
        return <LogsPage key="logs-search" defaultView="search" />;
      case 'logs-search': 
        return <LogsPage key="logs-search" defaultView="search" />;
      case 'logs-analytics': 
        return <LogsPage key="logs-analytics" defaultView="stats" />;
      
      // Rules
      case 'rules': 
        return <DetectionRulesPage key="rules-library" defaultView="library" />;
      case 'rules-library': 
        return <DetectionRulesPage key="rules-library" defaultView="library" />;
      case 'rules-builder': 
        return <DetectionRulesPage key="rules-builder" defaultView="builder" />;
      case 'rules-analytics': 
        return <DetectionRulesPage key="rules-analytics" defaultView="analytics" />;
      
      // Single pages
      case 'operations': 
        return <OperationsPage key="operations-data-sources" currentView="operations-data-sources" />;
      case 'settings': 
        return <SettingsPage key="settings-profile" currentView="settings-profile" />;
      case 'reports': 
        return <ReportsPage />;
      case 'network-view': 
        return <NetworkViewPage />;
      
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    if (activePage === 'dashboard') return 'Global Command Center';
    return activePage.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] selection:bg-[#00D4AA]/30">
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />
      <TopNav pageTitle={getPageTitle()} />
      <main className="ml-64 p-8 pb-32">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;