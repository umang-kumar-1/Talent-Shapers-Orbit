import * as React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/views/DashboardView';
import StudentsView from '../components/views/StudentsView';
import StudentProfileView from '../components/views/StudentProfileView';
import TrainersView from '../components/views/TrainersView';
import CoursesView from '../components/views/CoursesView';
import FeesView from '../components/views/FeesView';
import ExpensesView from '../components/views/ExpensesView';
import AssignmentsView from '../components/views/AssignmentsView';
import { useMockData } from '../hooks/useMockData';
import { useEffect, useState } from 'react';

export type ViewType =
  | 'dashboard'
  | 'students'
  | 'trainers'
  | 'courses'
  | 'fees'
  | 'expenses'
  | 'assignments';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const mockData = useMockData();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleViewProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleBackToList = () => {
    setSelectedStudentId(null);
  };

  const renderView = () => {
    if (selectedStudentId) {
      return (
        <StudentProfileView
          studentId={selectedStudentId}
          data={mockData}
          onBack={handleBackToList}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView data={mockData} />;
      case 'students':
        return <StudentsView data={mockData} onViewProfile={handleViewProfile} />;
      case 'trainers':
        return <TrainersView data={mockData} />;
      case 'courses':
        return <CoursesView data={mockData} />;
      case 'fees':
        return <FeesView data={mockData} />;
      case 'expenses':
        return <ExpensesView data={mockData} />;
      case 'assignments':
        return <AssignmentsView data={mockData} />;
      default:
        return <DashboardView data={mockData} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc', // dark:bg-slate-950 / bg-slate-50
        color: theme === 'dark' ? '#e2e8f0' : '#1e293b', // dark:text-slate-200 / text-slate-800
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main
        style={{
          flex: 1,
          padding: '1.5rem', // p-6
          paddingInline: '2rem', // md:p-8 (approx.)
          overflowY: 'auto',
        }}
      >
        {renderView()}
      </main>
    </div>
  );
};

export default App;
