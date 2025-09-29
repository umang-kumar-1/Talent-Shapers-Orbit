import * as React from 'react';
import { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { useMockData } from '../../hooks/useMockData';
import type { FeePayment } from "../../../../types";

// Icons
const EditIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);
const DeleteIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const ReceiptIcon: React.FC<{ className?: string }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Reusable Form Components
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#334155' }}>{label}</label>
    <input
      {...props}
      style={{
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #cbd5e1',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        outline: 'none'
      }}
    />
  </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#334155' }}>{label}</label>
    <select
      {...props}
      style={{
        width: '100%',
        padding: '0.5rem 0.75rem',
        border: '1px solid #cbd5e1',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        outline: 'none'
      }}
    >
      {children}
    </select>
  </div>
);

const FeesView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({ data }) => {
  const { feePayments, students, addFeePayment, updateFeePayment, deleteFeePayment } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<FeePayment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<FeePayment | null>(null);

  const initialFormState: Omit<FeePayment, 'id'> = { studentId: '', amount: 0, date: new Date().toISOString().split('T')[0], status: 'Paid', paymentMethod: 'Cash' };
  const [formState, setFormState] = useState(initialFormState);

  const getStudentName = (studentId: string) => students.find(s => s.id === studentId)?.name || 'Unknown Student';

  const handleOpenModal = (payment: FeePayment | null = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormState(payment);
    } else {
      setEditingPayment(null);
      setFormState(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(null);
    setFormState(initialFormState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormState(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleSubmit = () => {
    if (formState.studentId && formState.amount > 0) {
      if (editingPayment) updateFeePayment(formState as FeePayment);
      else addFeePayment(formState);
      handleCloseModal();
    } else {
      alert('Please select a student and enter a valid amount.');
    }
  };

  const handleDelete = () => {
    if (paymentToDelete) {
      deleteFeePayment(paymentToDelete.id);
      setPaymentToDelete(null);
    }
  };

  const generateBillPdf = (payment: FeePayment) => {
    const student = students.find(s => s.id === payment.studentId);
    if (!student) return;

    // @ts-ignore
    const doc = new window.jspdf.jsPDF();
    doc.setFontSize(20).setFont('helvetica', 'bold').text('Talent Shapers Orbit', 105, 20, { align: 'center' });
    doc.setFontSize(10).setFont('helvetica', 'normal').text('Kirti Tower, Techzone-4 Greater Noida west', 105, 27, { align: 'center' });
    doc.setFontSize(14).text('Payment Receipt', 105, 38, { align: 'center' });

    doc.setFontSize(10).text(`Bill To: ${student.name}`, 20, 55).text(`Email: ${student.email}`, 20, 60);
    doc.text(`Transaction ID: ${payment.id}`, 190, 55, { align: 'right' });
    doc.text(`Date: ${payment.date}`, 190, 60, { align: 'right' });
    doc.text(`Payment Method: ${payment.paymentMethod}`, 190, 65, { align: 'right' });

    doc.autoTable({
      startY: 75,
      head: [['Description', 'Amount']],
      body: [['Course Fee Payment', `₹${payment.amount.toLocaleString()}`]],
      foot: [[{ content: 'Total Paid', colSpan: 1, styles: { halign: 'right', fontStyle: 'bold' } }, { content: `₹${payment.amount.toLocaleString()}`, styles: { fontStyle: 'bold' } }]],
      theme: 'striped',
      headStyles: { fillColor: [78, 89, 104] }
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10).text('Thank you for your payment!', 105, finalY + 20, { align: 'center' });
    doc.save(`Receipt-${student.name.replace(' ', '_')}-${payment.date}.pdf`);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>Fee Collection</h1>
        <button
          onClick={() => handleOpenModal()}
          style={{
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          Add Payment
        </button>
      </div>

      {/* Table */}
      <Table headers={['Student', 'Amount', 'Date', 'Payment Method', 'Status', 'Actions']}>
        {feePayments.map(payment => (
          <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
            <td style={{ padding: '1rem', fontWeight: 500, color: '#1e293b' }}>{getStudentName(payment.studentId)}</td>
            <td style={{ padding: '1rem', color: '#475569' }}>₹{payment.amount.toLocaleString()}</td>
            <td style={{ padding: '1rem', color: '#475569' }}>{payment.date}</td>
            <td style={{ padding: '1rem', color: '#475569' }}>{payment.paymentMethod}</td>
            <td style={{ padding: '1rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '9999px',
                  backgroundColor: payment.status === 'Paid' ? '#dcfce7' : '#fef9c3',
                  color: payment.status === 'Paid' ? '#166534' : '#854d0e'
                }}
              >
                {payment.status}
              </span>
            </td>
            <td style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {payment.status === 'Paid' && (
                  <button onClick={() => generateBillPdf(payment)} style={{ cursor: 'pointer', color: '#16a34a', border: 'none', background: 'transparent' }}>
                    <ReceiptIcon  />
                  </button>
                )}
                <button onClick={() => handleOpenModal(payment)} style={{ cursor: 'pointer', color: '#4f46e5', border: 'none', background: 'transparent' }}>
                  <EditIcon  />
                </button>
                <button onClick={() => setPaymentToDelete(payment)} style={{ cursor: 'pointer', color: '#dc2626', border: 'none', background: 'transparent' }}>
                  <DeleteIcon  />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* Confirmation */}
      {paymentToDelete && (
        <ConfirmationModal
          title="Delete Payment"
          message={`Are you sure you want to delete this payment record?`}
          onConfirm={handleDelete}
          onCancel={() => setPaymentToDelete(null)}
        />
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <Modal title={editingPayment ? 'Edit Payment' : 'Add New Payment'} onClose={handleCloseModal}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <FormSelect label="Student" name="studentId" value={formState.studentId} onChange={handleInputChange} required>
              <option value="">Select a student</option>
              {students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)}
            </FormSelect>
            <FormInput label="Amount (₹)" name="amount" type="number" value={formState.amount > 0 ? formState.amount : ''} onChange={handleInputChange} required />
            <FormInput label="Date" name="date" type="date" value={formState.date} onChange={handleInputChange} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormSelect label="Payment Method" name="paymentMethod" value={formState.paymentMethod} onChange={handleInputChange} required>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
                <option value="Other">Other</option>
              </FormSelect>
              <FormSelect label="Status" name="status" value={formState.status} onChange={handleInputChange} required>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </FormSelect>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {editingPayment ? 'Save Changes' : 'Add Payment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeesView;
