import * as React from 'react';
import { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { useMockData } from '../../hooks/useMockData';
import type { Expense } from '../../types';

// Icons
const EditIcon: React.FC<{style?: React.CSSProperties}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
);
const DeleteIcon: React.FC<{style?: React.CSSProperties}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const DocumentIcon: React.FC<{style?: React.CSSProperties}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);


// Reusable Form Components
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#334155' }}>{label}</label>
        <input {...props} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none' }} />
    </div>
);
const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#334155' }}>{label}</label>
        <select {...props} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none' }}>
            {children}
        </select>
    </div>
);
const FormTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#334155' }}>{label}</label>
        <textarea {...props} rows={3} style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none' }} />
    </div>
);

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const ExpensesView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({ data }) => {
    const { expenses, addExpense, updateExpense, deleteExpense } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

    const initialFormState: Omit<Expense, 'id'> = { description: '', category: 'Other', amount: 0, date: new Date().toISOString().split('T')[0], billUrl: '', comments: '' };
    const [formState, setFormState] = useState(initialFormState);
    
    const handleOpenModal = (expense: Expense | null = null) => {
        if (expense) {
            setEditingExpense(expense);
            setFormState(expense);
        } else {
            setEditingExpense(null);
            setFormState(initialFormState);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
        setFormState(initialFormState);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await toBase64(e.target.files[0]);
            setFormState({ ...formState, billUrl: base64 });
        }
    };

    const handleSubmit = () => {
        if (formState.description && formState.amount > 0) {
            if (editingExpense) {
                updateExpense(formState as Expense);
            } else {
                addExpense(formState);
            }
            handleCloseModal();
        } else {
            alert('Please fill description and a valid amount.');
        }
    };

    const handleDelete = () => {
        if (expenseToDelete) {
            deleteExpense(expenseToDelete.id);
            setExpenseToDelete(null);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>Expenses</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    style={{ backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    Add Expense
                </button>
            </div>
            <Table headers={['Description', 'Category', 'Amount', 'Date', 'Bill', 'Actions']}>
                {expenses.map(expense => (
                    <tr key={expense.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                            <div style={{ fontWeight: 500, color: '#1e293b' }}>{expense.description}</div>
                            {expense.comments && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{expense.comments}</div>}
                        </td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle', color: '#475569' }}>{expense.category}</td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle', color: '#dc2626', fontWeight: 600 }}>-₹{expense.amount.toLocaleString()}</td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle', color: '#475569' }}>{expense.date}</td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                            {expense.billUrl ? (
                                <a href={expense.billUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5' }}>
                                    <DocumentIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                                </a>
                            ) : (
                                <span style={{ color: '#94a3b8' }}>-</span>
                            )}
                        </td>
                        <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <button onClick={() => handleOpenModal(expense)} style={{ padding: '0.25rem', borderRadius: '9999px', color: '#64748b' }}>
                                    <EditIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                                <button onClick={() => setExpenseToDelete(expense)} style={{ padding: '0.25rem', borderRadius: '9999px', color: '#64748b' }}>
                                    <DeleteIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>

            {expenseToDelete && (
                <ConfirmationModal
                    title="Delete Expense"
                    message={`Are you sure you want to delete the expense "${expenseToDelete.description}"?`}
                    onConfirm={handleDelete}
                    onCancel={() => setExpenseToDelete(null)}
                />
            )}

            {isModalOpen && (
                <Modal title={editingExpense ? "Edit Expense" : "Add New Expense"} onClose={handleCloseModal}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <FormInput label="Description" name="description" value={formState.description} onChange={handleInputChange} required />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <FormSelect label="Category" name="category" value={formState.category} onChange={handleInputChange} required>
                                <option value="Salary">Salary</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Rent">Rent</option>
                                <option value="Other">Other</option>
                            </FormSelect>
                            <FormInput label="Amount (₹)" name="amount" type="number" value={formState.amount > 0 ? formState.amount : ''} onChange={handleInputChange} required />
                        </div>
                         <FormInput label="Date" name="date" type="date" value={formState.date} onChange={handleInputChange} required />
                        <FormTextArea label="Comments" name="comments" value={formState.comments ?? ''} onChange={handleInputChange} />
                        <FormInput label="Bill/Receipt" name="billUrl" type="file" onChange={handleFileChange} />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button type="button" onClick={handleCloseModal} style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 600 }}>Cancel</button>
                            <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', backgroundColor: '#4f46e5', color: 'white', fontWeight: 600 }}>{editingExpense ? "Save Changes" : "Add Expense"}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ExpensesView;
