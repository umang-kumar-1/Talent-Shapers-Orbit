import * as React from 'react';
import { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { useMockData } from '../../hooks/useMockData';
import type { Expense } from "../../../../types";
import styles from "./ExpensesView.module.scss";
import { ExpenseContext } from '../context/ExpenseContext';

// Icons
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Reusable Form Components
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.formLabel}>{label}</label>
    <input {...props} className={styles.formInput} />
  </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.formLabel}>{label}</label>
    <select {...props} className={styles.formSelect}>
      {children}
    </select>
  </div>
);

const FormTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.formLabel}>{label}</label>
    <textarea {...props} rows={3} className={styles.formTextArea} />
  </div>
);

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const ExpensesView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({ data }) => {
  const {expenseData } = React.useContext(ExpenseContext);
  const { addExpense, updateExpense, deleteExpense } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const initialFormState: Omit<Expense, 'id'> = {
    description: '',
    category: 'Other',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    billUrl: '',
    comments: ''
  };
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
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Expenses</h1>
        <button onClick={() => handleOpenModal()} className={styles.addButton}>
          Add Expense
        </button>
      </div>

      {/* Table */}
      <Table headers={['Description', 'Category', 'Amount', 'Date', 'Bill', 'Actions']}>
        {expenseData.map((item:any) => (
          <tr key={item.id} className={styles.tableRow}>
            <td className={styles.tableCell}>
              <div className={styles.description}>{item.Description}</div>
              {item.Comments && <div className={styles.comments}>{item.Comments}</div>}
            </td>
            <td className={styles.tableCell}>{item.Category}</td>
            <td className={styles.amountCell}>-₹{item.Amount.toLocaleString()}</td>
            <td className={styles.tableCell}>{item.Date.substring(0, 10)}</td>
            <td className={styles.tableCell}>
              {item.billUrl ? (
                <a href={item.billUrl} target="_blank" rel="noopener noreferrer" className={styles.billLink}>
                  <DocumentIcon className={styles.icon} />
                </a>
              ) : (
                <span className={styles.noBill}>-</span>
              )}
            </td>
            <td className={styles.tableCell}>
              <div className={styles.actions}>
                <button onClick={() => handleOpenModal(item)} className={styles.iconButton}>
                  <EditIcon className={styles.icon} />
                </button>
                <button onClick={() => setExpenseToDelete(item)} className={styles.iconButton}>
                  <DeleteIcon className={styles.icon} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* Delete Confirmation */}
      {expenseToDelete && (
        <ConfirmationModal
          title="Delete Expense"
          message={`Are you sure you want to delete the expense "${expenseToDelete.description}"?`}
          onConfirm={handleDelete}
          onCancel={() => setExpenseToDelete(null)}
        />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <Modal title={editingExpense ? "Edit Expense" : "Add New Expense"} onClose={handleCloseModal}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <FormInput label="Description" name="description" value={formState.description} onChange={handleInputChange} required />
            <div className={styles.formRow}>
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

            <div className={styles.modalActions}>
              <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>Cancel</button>
              <button type="submit" className={styles.saveButton}>
                {editingExpense ? "Save Changes" : "Add Expense"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ExpensesView;
