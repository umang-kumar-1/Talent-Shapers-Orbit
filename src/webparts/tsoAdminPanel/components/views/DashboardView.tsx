import * as React from 'react';
import Card from '../common/Card';
import { useMockData } from '../../hooks/useMockData';

import styles from './DashboardView.module.scss';
import { ExpensesMethods } from '../ExpensesMethods';

const cardColors = {
  students: { bg: '#DBEAFE', icon: '#2563EB' },   // blue
  trainers: { bg: '#DCFCE7', icon: '#16A34A' },   // green
  courses: { bg: '#FEF9C3', icon: '#CA8A04' },   // yellow
  revenue: { bg: '#E0E7FF', icon: '#4F46E5' }    // indigo
};

const DashboardView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({ data }) => {
  const { students, trainers, courses, feePayments} = data;
  const { expenseData } = ExpensesMethods();

  const totalRevenue = feePayments.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const activeStudentsCount = students.filter(s => s.status === 'Active').length;

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      {/* Top summary cards */}
      <div className={styles.summaryGrid}>
        <Card title="Active Students" value={activeStudentsCount} icon={<UsersIcon />} colors={cardColors.students} />
        <Card title="Total Trainers" value={trainers.length} icon={<BriefcaseIcon />} colors={cardColors.trainers} />
        <Card title="Total Courses" value={courses.length} icon={<BookOpenIcon />} colors={cardColors.courses} />
        <Card title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<CurrencyDollarIcon />} colors={cardColors.revenue} />
      </div>

      {/* Two-column layout */}
      <div className={styles.twoColumn}>
        {/* Left: Financial Overview */}
        <div className={styles.cardBox}>
          <h2 className={styles.sectionTitle}>Monthly Financial Overview</h2>
          <div className={styles.chartPlaceholder}>
            (Chart goes here)
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className={styles.cardBox}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <ul className={styles.activityList}>
            {feePayments.slice(-3).reverse().map(fee => {
              const student = students.find(s => s.id === fee.studentId);
              return (
                <li key={fee.id} className={styles.activityItem}>
                  <span className={styles.activityLabel}>
                    Fee from <span className={styles.activityHighlight}>{student?.name}</span>
                  </span>
                  <span className={fee.status === 'Paid' ? styles.paid : styles.pending}>
                    ₹{fee.amount}
                  </span>
                </li>
              );
            })}
            {expenseData.slice(-2).reverse().map(expense => (
              <li key={expense.id} className={styles.activityItem}>
                <span className={styles.activityLabel}>
                  Expense: <span className={styles.expenseHighlight}>{expense.Description}</span>
                </span>
                <span className={styles.expenseAmount}>-₹{expense.Amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// SVG Icons
const UsersIcon: React.FC = () => (
  <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BriefcaseIcon: React.FC = () => (
  <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BookOpenIcon: React.FC = () => (
  <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CurrencyDollarIcon: React.FC = () => (
  <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v-2m0 2v.01m0 4v-2m0 2v.01M6 12h.01M18 12h.01M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
  </svg>
);

export default DashboardView;
