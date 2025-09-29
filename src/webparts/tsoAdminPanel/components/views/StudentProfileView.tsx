import * as React from 'react'; 
import { useMockData } from '../../hooks/useMockData';

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
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Student not found.</h1>
                <button 
                    onClick={onBack} 
                    style={{ marginTop: "1rem", backgroundColor: "#4f46e5", color: "#fff", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", border: "none" }}
                >
                    Back to List
                </button>
            </div>
        );
    }
    
    const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const totalFee = studentCourses.reduce((sum, course) => sum + course.totalFee, 0);
    const balanceDue = totalFee - totalPaid;
    const paymentProgress = totalFee > 0 ? (totalPaid / totalFee) * 100 : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img 
                        src={student.imageUrl || `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`} 
                        alt={student.name} 
                        style={{ width: "5rem", height: "5rem", borderRadius: "9999px", objectFit: "cover", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} 
                    />
                    <div>
                        <button 
                            onClick={onBack} 
                            style={{ display: "flex", alignItems: "center", fontSize: "0.875rem", fontWeight: 600, color: "#4f46e5", background: "none", border: "none", cursor: "pointer", marginBottom: "0.25rem" }}
                        >
                            <svg style={{ width: "1.25rem", height: "1.25rem", marginRight: "0.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                            Back to Students
                        </button>
                        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b" }}>{student.name}</h1>
                        <p style={{ marginTop: "0.25rem", color: "#64748b" }}>{student.email} • {student.phone}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Student Details */}
                    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#334155", marginBottom: "1rem" }}>Details</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 500, color: "#64748b" }}>Join Date</span>
                                <span style={{ fontWeight: 600, color: "#334155" }}>{student.joinDate}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontWeight: 500, color: "#64748b", marginBottom: "0.25rem" }}>Address</span>
                                <span style={{ fontWeight: 600, color: "#334155" }}>{student.address || 'N/A'}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", paddingTop: "0.5rem", marginTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                                <span style={{ fontWeight: 500, color: "#64748b", marginBottom: "0.25rem" }}>Enrolled Courses</span>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                    {studentCourses.map(c => (
                                        <span key={c.id} style={{ fontWeight: 600, color: "#334155" }}>{c.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#334155", marginBottom: "1rem" }}>Financials</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                            <div style={{ width: "100%", backgroundColor: "#e2e8f0", borderRadius: "9999px", height: "0.625rem" }}>
                                <div style={{ backgroundColor: "#4f46e5", height: "0.625rem", borderRadius: "9999px", width: `${paymentProgress}%` }}></div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 500, color: "#64748b" }}>Total Fee</span>
                                <span style={{ fontWeight: 600, color: "#334155" }}>₹{totalFee.toLocaleString()}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 500, color: "#64748b" }}>Amount Paid</span>
                                <span style={{ fontWeight: 600, color: "#16a34a" }}>₹{totalPaid.toLocaleString()}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                                <span style={{ fontWeight: "bold", color: "#475569" }}>Balance Due</span>
                                <span style={{ fontWeight: "bold", color: "#dc2626" }}>₹{balanceDue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Payment History */}
                    <div style={{ backgroundColor: "#fff", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#334155", padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>Payment History</h3>
                        <div style={{ maxHeight: "15rem", overflowY: "auto" }}>
                            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                                <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8fafc" }}>
                                    <tr>
                                        {["Date", "Amount", "Method", "Status"].map(h => (
                                            <th key={h} style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(p => (
                                        <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#475569" }}>{p.date}</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 500, color: "#334155" }}>₹{p.amount.toLocaleString()}</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#475569" }}>{p.paymentMethod}</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                                                <span style={{ padding: "0.125rem 0.5rem", fontSize: "0.75rem", fontWeight: "bold", borderRadius: "9999px", backgroundColor: p.status === 'Paid' ? "#dcfce7" : "#fef9c3", color: p.status === 'Paid' ? "#166534" : "#854d0e" }}>
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
                    <div style={{ backgroundColor: "#fff", borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#334155", padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>Assignments</h3>
                        <div style={{ maxHeight: "15rem", overflowY: "auto" }}>
                            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                                <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8fafc" }}>
                                    <tr>
                                        {["Title", "Course", "Due Date", "Status"].map(h => (
                                            <th key={h} style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentAssignments.map(a => (
                                        <tr key={a.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", fontWeight: 500, color: "#334155" }}>{a.title}</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#475569" }}>{courses.find(c=>c.id === a.courseId)?.name || 'N/A'}</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", color: "#475569" }}>{a.dueDate}</td>
                                            <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                                                <span style={{ padding: "0.125rem 0.5rem", fontSize: "0.75rem", fontWeight: "bold", borderRadius: "9999px", backgroundColor: a.status === 'Submitted' ? "#dcfce7" : "#f1f5f9", color: a.status === 'Submitted' ? "#166534" : "#334155" }}>
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
