import * as React from 'react';
import { useState } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';
import { useMockData } from '../../hooks/useMockData';
import type { Student } from '../../../../types';
import styles from './StudentsView.module.scss';

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
  <div className={styles.formGroup}>
    <label className={styles.label}>{label}</label>
    <input {...props} className={styles.input} />
  </div>
);
const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.label}>{label}</label>
    <select {...props} className={styles.select}>{children}</select>
  </div>
);
const FormTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.label}>{label}</label>
    <textarea {...props} className={styles.textarea} />
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

  const getCourseNames = (courseIds: string[]) =>
    courseIds.map((id) => courses.find((c) => c.id === id)?.name).filter(Boolean).join(', ');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormState({ ...formState, [e.target.name]: e.target.value });

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
      editingStudent ? updateStudent(formState as Student) : addStudent(formState);
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
      <div className={styles.header}>
        <h1 className={styles.title}>Students</h1>
        <button onClick={() => handleOpenModal()} className={styles.addBtn}>Add Student</button>
      </div>

      {/* Table */}
      <Table headers={['Name', 'Courses', 'Join Date', 'Status', 'Actions']}>
        {students.map((student) => (
          <tr key={student.id} className={styles.tableRow}>
            <td className={styles.tableCell}>
              <div className={styles.studentInfo}>
                <img
                  src={student.imageUrl || `https://ui-avatars.com/api/?name=${student.name.replace(' ', '+')}&background=random`}
                  alt={student.name}
                  className={styles.avatar}
                />
                <div>
                  <button onClick={() => onViewProfile(student.id)} className={styles.nameBtn}>
                    {student.name}
                  </button>
                  <div className={styles.email}>{student.email}</div>
                </div>
              </div>
            </td>
            <td className={styles.tableCell}>{getCourseNames(student.courseIds)}</td>
            <td className={styles.tableCell}>{student.joinDate}</td>
            <td className={styles.tableCell}>
              <span className={`${styles.status} ${student.status === 'Active' ? styles.active : styles.inactive}`}>
                {student.status}
              </span>
            </td>
            <td className={styles.tableCell}>
              <div className={styles.actions}>
                <button onClick={() => handleOpenModal(student)} className={styles.iconBtn}><EditIcon /></button>
                <button onClick={() => setStudentToDelete(student)} className={styles.deleteBtn}><DeleteIcon /></button>
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

            <div className={styles.twoColGrid}>
              <FormInput label="Phone Number" name="phone" type="tel" value={formState.phone} onChange={handleInputChange} />
              <FormSelect label="Gender" name="gender" value={formState.gender} onChange={handleInputChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </FormSelect>
            </div>

            <FormTextArea label="Address" name="address" value={formState.address} onChange={handleInputChange} />

            <div className={styles.twoColGrid}>
              <FormInput label="Profile Picture" name="imageUrl" type="file" accept="image/*" onChange={handleFileChange} />
              <FormSelect label="Status" name="status" value={formState.status} onChange={handleInputChange} required>
                <option value="Active">Active</option>
                <option value="Discontinued">Discontinued</option>
              </FormSelect>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Courses</label>
              <div className={styles.courseList}>
                {courses.map((course) => (
                  <label key={course.id} className={styles.courseItem}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={formState.courseIds.includes(course.id)}
                      onChange={() => handleCourseChange(course.id)}
                    />
                    <span className={styles.courseName}>{course.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" onClick={handleCloseModal} className={styles.cancelBtn}>Cancel</button>
              <button type="submit" className={styles.saveBtn}>
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
