import * as React from 'react';
import { useMockData } from '../../hooks/useMockData';
import styles from './StudentProfileView.module.scss';

interface StudentProfileProps {
  studentId: string;
  data: ReturnType<typeof useMockData>;
  onBack: () => void;
}

const StudentProfileView: React.FC<StudentProfileProps> = ({ studentId, data, onBack }) => {
  const { students, courses, feePayments, assignments } = data;

  const student = students.find(s => s.id === studentId);
  const studentCourses = courses.filter(c => student?.courseIds.includes(c.id));
  const payments = feePayments.filter(p => p.studentId === studentId);
  const studentAssignments = assignments.filter(a => a.studentId === studentId);

  if (!student) {
    return (
      <div className={styles.notFound}>
        <h1>Student not found.</h1>
        <button onClick={onBack}>Back to List</button>
      </div>
    );
  }

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalFee = studentCourses.reduce((sum, course) => sum + course.totalFee, 0);
  const balanceDue = totalFee - totalPaid;
  const paymentProgress = totalFee > 0 ? (totalPaid / totalFee) * 100 : 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <img
            src={student.imageUrl || `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`}
            alt={student.name}
            className={styles.avatar}
          />
          <div>
            <button onClick={onBack} className={styles.backButton}>
              <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Students
            </button>
            <h1 className={styles.studentName}>{student.name}</h1>
            <p className={styles.studentInfo}>{student.email} • {student.phone}</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Student Details */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Details</h3>
            <div className={styles.detailsList}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Join Date</span>
                <span className={styles.detailValue}>{student.joinDate}</span>
              </div>
              <div className={styles.detailColumn}>
                <span className={styles.detailLabel}>Address</span>
                <span className={styles.detailValue}>{student.address || 'N/A'}</span>
              </div>
              <div className={styles.detailColumnBorder}>
                <span className={styles.detailLabel}>Enrolled Courses</span>
                <div className={styles.courseList}>
                  {studentCourses.map(c => (
                    <span key={c.id} className={styles.detailValue}>{c.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Financials</h3>
            <div className={styles.detailsList}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${paymentProgress}%` }} />
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Total Fee</span>
                <span className={styles.detailValue}>₹{totalFee.toLocaleString()}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Amount Paid</span>
                <span className={styles.paid}>₹{totalPaid.toLocaleString()}</span>
              </div>
              <div className={styles.detailRowBorder}>
                <span className={styles.balanceLabel}>Balance Due</span>
                <span className={styles.balanceDue}>₹{balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Payment History */}
          <div className={styles.tableCard}>
            <h3 className={styles.tableTitle}>Payment History</h3>
            <div className={styles.scrollContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {["Date", "Amount", "Method", "Status"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td>{p.date}</td>
                      <td>₹{p.amount.toLocaleString()}</td>
                      <td>{p.paymentMethod}</td>
                      <td>
                        <span className={p.status === 'Paid' ? styles.statusPaid : styles.statusPending}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assignments */}
          <div className={styles.tableCard}>
            <h3 className={styles.tableTitle}>Assignments</h3>
            <div className={styles.scrollContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {["Title", "Course", "Due Date", "Status"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {studentAssignments.map(a => (
                    <tr key={a.id}>
                      <td>{a.title}</td>
                      <td>{courses.find(c => c.id === a.courseId)?.name || 'N/A'}</td>
                      <td>{a.dueDate}</td>
                      <td>
                        <span className={a.status === 'Submitted' ? styles.statusSubmitted : styles.statusDefault}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;
