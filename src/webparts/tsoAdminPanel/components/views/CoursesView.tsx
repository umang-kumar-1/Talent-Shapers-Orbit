import * as React from 'react';
import { useState } from 'react';
import { useMockData } from '../../hooks/useMockData';
import type { Course } from '../../types';
import Modal from '../common/Modal';
import ConfirmationModal from '../common/ConfirmationModal';

// Icons
const EditIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const DeleteIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Form Input
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>{label}</label>
    <input
      {...props}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        outline: 'none'
      }}
    />
  </div>
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '4px' }}>{label}</label>
    <select
      {...props}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        outline: 'none'
      }}
    >
      {children}
    </select>
  </div>
);

// CourseCard
const CourseCard: React.FC<{ course: Course; onEdit: () => void; onDelete: () => void }> = ({ course, onEdit, onDelete }) => {
  const isEnglish = course.category === 'Spoken English';
  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <span
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '9999px',
              backgroundColor: isEnglish ? '#DBEAFE' : '#DCFCE7',
              color: isEnglish ? '#1E40AF' : '#166534'
            }}
          >
            {course.category}
          </span>
          <span
            style={{
              marginLeft: '8px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '9999px',
              backgroundColor: '#F1F5F9',
              color: '#334155'
            }}
          >
            {course.level}
          </span>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>{course.name}</h3>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Duration: {course.duration}</p>
      </div>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#4F46E5' }}>₹{course.totalFee.toLocaleString()}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onEdit} style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
            <EditIcon style={{ width: '20px', height: '20px' }} />
          </button>
          <button onClick={onDelete} style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}>
            <DeleteIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

// CoursesView
const CoursesView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({ data }) => {
  const { courses, addCourse, updateCourse, deleteCourse } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const initialFormState: Omit<Course, 'id'> = { name: '', category: 'Spoken English', level: 'Basic', duration: '', totalFee: 0 };
  const [formState, setFormState] = useState(initialFormState);

  const handleOpenModal = (course: Course | null = null) => {
    if (course) {
      setEditingCourse(course);
      setFormState(course);
    } else {
      setEditingCourse(null);
      setFormState(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormState(initialFormState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    if (formState.name && formState.duration && formState.totalFee > 0) {
      if (editingCourse) {
        updateCourse(formState as Course);
      } else {
        addCourse(formState);
      }
      handleCloseModal();
    } else {
      alert('Please fill all fields and provide a valid total fee.');
    }
  };

  const handleDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setCourseToDelete(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 700, color: '#1E293B' }}>Courses</h1>
        <button
          onClick={() => handleOpenModal()}
          style={{
            backgroundColor: '#4F46E5',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          Add Course
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '24px' }}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onEdit={() => handleOpenModal(course)} onDelete={() => setCourseToDelete(course)} />
        ))}
      </div>

      {courseToDelete && (
        <ConfirmationModal
          title="Delete Course"
          message={`Are you sure you want to delete the course "${courseToDelete.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setCourseToDelete(null)}
        />
      )}

      {isModalOpen && (
        <Modal title={editingCourse ? 'Edit Course' : 'Add New Course'} onClose={handleCloseModal}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <FormInput label="Course Name" name="name" value={formState.name} onChange={handleInputChange} required />
            <FormSelect label="Category" name="category" value={formState.category} onChange={handleInputChange} required>
              <option value="Spoken English">Spoken English</option>
              <option value="Computer">Computer</option>
            </FormSelect>
            <FormSelect label="Level" name="level" value={formState.level} onChange={handleInputChange} required>
              <option value="Basic">Basic</option>
              <option value="Advanced">Advanced</option>
            </FormSelect>
            <FormInput label="Duration (e.g., '3 Months')" name="duration" value={formState.duration} onChange={handleInputChange} required />
            <FormInput label="Total Fee (₹)" name="totalFee" type="number" value={formState.totalFee > 0 ? formState.totalFee : ''} onChange={handleInputChange} required />

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0', paddingTop: '16px', marginTop: '16px' }}>
              <button type="button" onClick={handleCloseModal} style={{ marginRight: '8px', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, backgroundColor: '#E2E8F0', color: '#334155', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, backgroundColor: '#4F46E5', color: '#fff', cursor: 'pointer' }}>
                {editingCourse ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CoursesView;
