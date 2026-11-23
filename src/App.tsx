import React, { useState, useEffect } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickAddTaskModal } from './components/QuickAddTaskModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Toast } from './components/Toast';

import { DashboardView } from './views/DashboardView';
import { CalendarView } from './views/CalendarView';
import { DailyPlannerView } from './views/DailyPlannerView';
import { MonthlyPlannerView } from './views/MonthlyPlannerView';
import { YearlyGoalsView } from './views/YearlyGoalsView';
import { StudyPlannerView } from './views/StudyPlannerView';
import { HabitTrackerView } from './views/HabitTrackerView';
import { FinancePlannerView } from './views/FinancePlannerView';
import { JournalView } from './views/JournalView';
import { ImportantDatesView } from './views/ImportantDatesView';
import { SettingsView } from './views/SettingsView';

const PlannerContent: React.FC = () => {
  const { activeView, setIsQuickAddOpen } = usePlanner();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Keyboard shortcut: Press 'N' outside of inputs to trigger quick add task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT' ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (!isInput && e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsQuickAddOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsQuickAddOpen]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'calendar':
        return <CalendarView />;
      case 'daily':
        return <DailyPlannerView />;
      case 'monthly':
        return <MonthlyPlannerView />;
      case 'goals':
        return <YearlyGoalsView />;
      case 'study':
        return <StudyPlannerView />;
      case 'habits':
        return <HabitTrackerView />;
      case 'finance':
        return <FinancePlannerView />;
      case 'journal':
        return <JournalView />;
      case 'important-dates':
        return <ImportantDatesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#060B1C] transition-colors duration-200">
      <Sidebar isOpenMobile={isOpenMobile} setIsOpenMobile={setIsOpenMobile} />

      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Header setIsOpenMobile={setIsOpenMobile} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Toast */}
      <QuickAddTaskModal />
      <GlobalSearchModal />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PlannerProvider>
      <PlannerContent />
    </PlannerProvider>
  );
};

export default App;
