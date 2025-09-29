import * as React from 'react';
import { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { useMockData } from '../../hooks/useMockData';
import type { Student } from '../../types';

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
const FormTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div style={{ marginBottom: '1rem' }}>
    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem', color: '#334155' }}>{label}</label>
    <textarea
      {...props}
      rows={3}
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

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface StudentsViewProps {
  data: ReturnType<typeof useMockData>;
  onViewProfile: (studentId: string) => void;
}

const StudentsView: React.FC<StudentsViewProps> = ({ data, onViewProfile }) => {
  const { students, courses, addStudent, updateStudent, deleteStudent } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const initialFormState: Omit<Student, 'id' | 'joinDate'> = {
    name: '',
    email: '',
    phone: '',
    courseIds: [],
    address: '',
    imageUrl: '',
    gender: 'Male',
    status: 'Active'
  };
  const [formState, setFormState] = useState(initialFormState);

  const getCourseNames = (courseIds: string[]) => {
    return courseIds.map((id) => courses.find((c) => c.id === id)?.name).filter(Boolean).join(', ');
  };

  const handleOpenModal = (student: Student | null = null) => {
    if (student) {
      setEditingStudent(student);
      setFormState(student);
    } else {
      setEditingStudent(null);
      setFormState(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormState(initialFormState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleCourseChange = (courseId: string) => {
    const newCourseIds = formState.courseIds.includes(courseId)
      ? formState.courseIds.filter((id) => id !== courseId)
      : [...formState.courseIds, courseId];
    setFormState({ ...formState, courseIds: newCourseIds });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await toBase64(e.target.files[0]);
      setFormState({ ...formState, imageUrl: base64 });
    }
  };

  const handleSubmit = () => {
    if (formState.name && formState.email && formState.courseIds.length > 0) {
      if (editingStudent) {
        updateStudent(formState as Student);
      } else {
        addStudent(formState);
      }
      handleCloseModal();
    } else {
      alert('Please fill all required fields: Name, Email, and at least one Course.');
    }
  };

  const handleDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>Students</h1>
        <button
          onClick={() => handleOpenModal()}
          style={{
            backgroundColor: '#4f46e5',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          Add Student
        </button>
      </div>

      {/* Table */}
      <Table headers={['Name', 'Courses', 'Join Date', 'Status', 'Actions']}>
        {students.map((student) => (
          <tr key={student.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '0.75rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={student.imageUrl || `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`}
                  alt={student.name}
                  style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px', marginRight: '0.75rem', objectFit: 'cover' }}
                />
                <div>
                  <button
                    onClick={() => onViewProfile(student.id)}
                    style={{ fontWeight: 500, color: '#4f46e5', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {student.name}
                  </button>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{student.email}</div>
                </div>
              </div>
            </td>
            <td style={{ padding: '1rem', color: '#475569' }}>{getCourseNames(student.courseIds)}</td>
            <td style={{ padding: '1rem', color: '#475569' }}>{student.joinDate}</td>
            <td style={{ padding: '1rem' }}>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '9999px',
                  backgroundColor: student.status === 'Active' ? '#dcfce7' : '#e2e8f0',
                  color: student.status === 'Active' ? '#166534' : '#475569'
                }}
              >
                {student.status}
              </span>
            </td>
            <td style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => handleOpenModal(student)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                  <EditIcon  />
                </button>
                <button onClick={() => setStudentToDelete(student)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                  <DeleteIcon />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* Confirmation Modal */}
      {studentToDelete && (
        <ConfirmationModal
          title="Delete Student"
          message={`Are you sure you want to delete ${studentToDelete.name}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setStudentToDelete(null)}
        />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <Modal title={editingStudent ? 'Edit Student' : 'Add New Student'} onClose={handleCloseModal}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormInput label="Full Name" name="name" value={formState.name} onChange={handleInputChange} required />
            <FormInput label="Email Address" name="email" type="email" value={formState.email} onChange={handleInputChange} required />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput label="Phone Number" name="phone" type="tel" value={formState.phone} onChange={handleInputChange} />
              <FormSelect label="Gender" name="gender" value={formState.gender} onChange={handleInputChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </FormSelect>
            </div>

            <FormTextArea label="Address" name="address" value={formState.address} onChange={handleInputChange} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormInput label="Profile Picture" name="imageUrl" type="file" accept="image/*" onChange={handleFileChange} />
              <FormSelect label="Status" name="status" value={formState.status} onChange={handleInputChange} required>
                <option value="Active">Active</option>
                <option value="Discontinued">Discontinued</option>
              </FormSelect>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#334155' }}>Courses</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  maxHeight: '8rem',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem'
                }}
              >
                {courses.map((course) => (
                  <label key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: '#f8fafc' }}>
                    <input
                      type="checkbox"
                      style={{ width: '1rem', height: '1rem' }}
                      checked={formState.courseIds.includes(course.id)}
                      onChange={() => handleCourseChange(course.id)}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{course.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', backgroundColor: '#e2e8f0', color: '#334155', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 600 }}>
                {editingStudent ? 'Save Changes' : 'Add Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentsView;
