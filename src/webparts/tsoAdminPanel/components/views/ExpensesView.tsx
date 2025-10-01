import * as React from 'react';
import { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { useMockData } from '../../hooks/useMockData';
import type { Expense } from "../../../../types";
import styles from "./ExpensesView.module.scss";
import { ExpensesMethods } from '../ExpensesMethods';


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


const ExpensesView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const initialFormState: any = {
    description: '',
    category: 'Other',
    amount: 0,
    date: new Date().toISOString(),
    billUrl: '',
    comments: ''
  };

  const [formState, setFormState] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { expenseData, addExpense, updateExpense, deleteExpense } = ExpensesMethods();

  const handleOpenModal = (expense: any) => {
    if (expense) {
      setEditingExpense(expense);
      setFormState((prev:any) => ({
        ...prev,
        description: expense.Description || '',
        category: expense.Category || 'Other',
        amount: expense.Amount || 0,
        date: expense.Date ? new Date(expense.Date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10),
        comments: expense.Comments || '',
        billUrl: expense.billUrl || expense.Reciept || ''
      }));
      setPreviewUrl(expense.billUrl || expense.Reciept || null);
    } else {
      setEditingExpense(null);
      setFormState(initialFormState);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = evt.target.files?.[0] || null;
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    setFormState(initialFormState);
    setSelectedFile(null);
    
    // Clean up preview URL if it was created from a file
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };


  const handleInputChange = (e:any):any => {
    const { name, value, type } = e.target;

    setFormState((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };


  const handleSubmit = () => {
    if (formState.description && formState.amount > 0) {
      const expenseData = {
        ...formState,
        file: selectedFile
      };
      
      if (editingExpense) {
        updateExpense({ ...editingExpense, ...expenseData });
      } else {
        addExpense(expenseData);
      }
      handleCloseModal();
    } else {
      alert('Please fill description and a valid amount.');
    }
  };

  const handleDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };


  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Expenses</h1>
        <button onClick={() => handleOpenModal(null)} className={styles.addButton}>
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
                <div className={'imageContainer'}>
                  <button 
                    onClick={() => window.open(item.billUrl, '_blank')}
                    className="previewButton"
                    title="Click to view receipt"
                  >
                    <DocumentIcon className={styles.icon} />
                  </button>
                </div>
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
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bill/Receipt</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className={styles.formInput}
              />
              {previewUrl && (
                <div className={'existingImageContainer'}>
                  {/* Show actual image for both existing expense and new file uploads */}
                  {editingExpense && !selectedFile ? (
                    // Existing expense - show current image with info
                    <div className="existingImageContainer">
                      <img 
                        src={previewUrl} 
                        alt="Current receipt" 
                        className="existingImage"
                      />
                      <div className="imageInfo">
                        <span className="imageLabel">Current receipt</span>
                        <a 
                          href={previewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="viewFullImageLink"
                        >
                          View full size
                        </a>
                      </div>
                    </div>
                  ) : (
                    // New file upload - show image preview
                    <div className="newImageContainer">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="newImagePreview"
                      />
                      <div className="imageInfo">
                        <span className="imageLabel">
                          {selectedFile ? "New image selected" : "Image preview"}
                        </span>
                        <span className="imageSize">
                          {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ""}
                        </span>
                      </div>
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className={'removeImageButton'}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

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
