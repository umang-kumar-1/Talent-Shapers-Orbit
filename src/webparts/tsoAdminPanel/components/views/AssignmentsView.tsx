import * as React from "react";
import { useState, useMemo } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import ConfirmationModal from "../common/ConfirmationModal";
import { useMockData } from "../../hooks/useMockData";
import { Assignment } from '../../../../types'
// Icons
const EditIcon: React.FC<{ className?: string }> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);
const DeleteIcon: React.FC<{ className?: string }> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
const DocumentIcon: React.FC<{ className?: string }> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Reusable Form Components
const FormInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
> = ({ label, ...props }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 500,
        color: "#334155",
        marginBottom: "6px",
      }}
    >
      {label}
    </label>
    <input
      {...props}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        outline: "none",
      }}
    />
  </div>
);

const FormSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }
> = ({ label, children, ...props }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 500,
        color: "#334155",
        marginBottom: "6px",
      }}
    >
      {label}
    </label>
    <select
      {...props}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        outline: "none",
      }}
    >
      {children}
    </select>
  </div>
);

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AssignmentsView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({
  data,
}) => {
  const {
    assignments,
    students,
    courses,
    trainers,
    addAssignment,
    updateAssignment,
    deleteAssignment,
  } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<Assignment | null>(null);

  const initialFormState: Omit<Assignment, "id" | "status"> = {
    title: "",
    courseId: "",
    studentId: "",
    trainerId: "",
    dueDate: new Date().toISOString().split("T")[0],
    assignmentFileUrl: "",
  };
  const [formState, setFormState] = useState(initialFormState);

  const getStudentName = (studentId: string) =>
    students.find((s) => s.id === studentId)?.name || "N/A";
  const getCourseName = (courseId: string) =>
    courses.find((c) => c.id === courseId)?.name || "N/A";

  const handleOpenModal = (assignment: Assignment | null = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormState(assignment);
    } else {
      setEditingAssignment(null);
      setFormState(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssignment(null);
    setFormState(initialFormState);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "courseId" && { studentId: "", trainerId: "" }),
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await toBase64(e.target.files[0]);
      setFormState({ ...formState, assignmentFileUrl: base64 });
    }
  };

  const handleSubmit = () => {
    if (
      formState.title &&
      formState.courseId &&
      formState.studentId &&
      formState.trainerId
    ) {
      if (editingAssignment) {
        updateAssignment(formState as Assignment);
      } else {
        addAssignment(formState);
      }
      handleCloseModal();
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleDelete = () => {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete.id);
      setAssignmentToDelete(null);
    }
  };

  const studentsForCourse = useMemo(
    () => students.filter((s) => s.courseIds.includes(formState.courseId)),
    [students, formState.courseId]
  );
  const trainersForCourse = useMemo(
    () => trainers.filter((t) => t.expertise.includes(formState.courseId)),
    [trainers, formState.courseId]
  );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#1e293b",
            margin: 0,
          }}
        >
          Assignments
        </h1>
        <button
          onClick={() => handleOpenModal()}
          style={{
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
          }}
        >
          Allocate Assignment
        </button>
      </div>

      {/* Table */}
      <Table
        headers={[
          "Title",
          "Student",
          "Course",
          "Due Date",
          "Status",
          "File",
          "Actions",
        ]}
      >
        {assignments.map((assignment) => (
          <tr
            key={assignment.id}
            style={{
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <td style={{ padding: "16px", fontWeight: 500, color: "#1e293b" }}>
              {assignment.title}
            </td>
            <td style={{ padding: "16px", color: "#475569" }}>
              {getStudentName(assignment.studentId)}
            </td>
            <td style={{ padding: "16px", color: "#475569" }}>
              {getCourseName(assignment.courseId)}
            </td>
            <td style={{ padding: "16px", color: "#475569" }}>
              {assignment.dueDate}
            </td>
            <td style={{ padding: "16px" }}>
              <span
                style={{
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "9999px",
                  backgroundColor:
                    assignment.status === "Submitted" ? "#dcfce7" : "#f1f5f9",
                  color:
                    assignment.status === "Submitted" ? "#166534" : "#1e293b",
                }}
              >
                {assignment.status}
              </span>
            </td>
            <td style={{ padding: "16px", textAlign: "center" }}>
              {assignment.assignmentFileUrl ? (
                <a
                  href={assignment.assignmentFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#4f46e5" }}
                >
                  <DocumentIcon  />
                </a>
              ) : (
                <span style={{ color: "#94a3b8" }}>-</span>
              )}
            </td>
            <td style={{ padding: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button
                  onClick={() => handleOpenModal(assignment)}
                  style={{
                    padding: "4px",
                    borderRadius: "9999px",
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  <EditIcon  />
                </button>
                <button
                  onClick={() => setAssignmentToDelete(assignment)}
                  style={{
                    padding: "4px",
                    borderRadius: "9999px",
                    border: "none",
                    background: "transparent",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  <DeleteIcon  />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* Delete Confirmation */}
      {assignmentToDelete && (
        <ConfirmationModal
          title="Delete Assignment"
          message={`Are you sure you want to delete the assignment "${assignmentToDelete.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setAssignmentToDelete(null)}
        />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <Modal
          title={editingAssignment ? "Edit Assignment" : "Allocate New Assignment"}
          onClose={handleCloseModal}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormInput
              label="Assignment Title"
              name="title"
              value={formState.title}
              onChange={handleInputChange}
              required
            />
            <FormSelect
              label="Course"
              name="courseId"
              value={formState.courseId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              label="Student"
              name="studentId"
              value={formState.studentId}
              onChange={handleInputChange}
              required
              disabled={!formState.courseId}
            >
              <option value="">Select a student</option>
              {studentsForCourse.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              label="Trainer"
              name="trainerId"
              value={formState.trainerId}
              onChange={handleInputChange}
              required
              disabled={!formState.courseId}
            >
              <option value="">Select a trainer</option>
              {trainersForCourse.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </FormSelect>
            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formState.dueDate}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Assignment File"
              name="assignmentFileUrl"
              type="file"
              onChange={handleFileChange}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "16px",
                marginTop: "16px",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  marginRight: "8px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#e2e8f0",
                  color: "#334155",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {editingAssignment ? "Save Changes" : "Allocate"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AssignmentsView;
