import * as React from "react";
import { useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import ConfirmationModal from "../common/ConfirmationModal";
import { useMockData } from "../../hooks/useMockData";
import type { Trainer } from "../../types";

// Icons
const EditIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
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

const DeleteIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
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

// Reusable form components
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
        marginBottom: "4px",
      }}
    >
      {label}
    </label>
    <input
      {...props}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #CBD5E1",
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
        marginBottom: "4px",
      }}
    >
      {label}
    </label>
    <select
      {...props}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #CBD5E1",
        borderRadius: "6px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        outline: "none",
      }}
    >
      {children}
    </select>
  </div>
);

const FormTextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
> = ({ label, ...props }) => (
  <div style={{ marginBottom: "16px" }}>
    <label
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: 500,
        color: "#334155",
        marginBottom: "4px",
      }}
    >
      {label}
    </label>
    <textarea
      {...props}
      rows={3}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #CBD5E1",
        borderRadius: "6px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        outline: "none",
      }}
    />
  </div>
);

// File → Base64 helper
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const TrainersView: React.FC<{ data: ReturnType<typeof useMockData> }> = ({
  data,
}) => {
  const { trainers, courses, addTrainer, updateTrainer, deleteTrainer } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);

  const initialFormState: Omit<Trainer, "id"> = {
    name: "",
    email: "",
    expertise: [],
    phone: "",
    address: "",
    imageUrl: "",
    gender: "Male",
  };
  const [formState, setFormState] = useState(initialFormState);

  const getExpertiseNames = (expertiseIds: string[]) => {
    return expertiseIds
      .map((id) => courses.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const handleOpenModal = (trainer: Trainer | null = null) => {
    if (trainer) {
      setEditingTrainer(trainer);
      setFormState(trainer);
    } else {
      setEditingTrainer(null);
      setFormState(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrainer(null);
    setFormState(initialFormState);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleExpertiseChange = (courseId: string) => {
    const newExpertise = formState.expertise.includes(courseId)
      ? formState.expertise.filter((id) => id !== courseId)
      : [...formState.expertise, courseId];
    setFormState({ ...formState, expertise: newExpertise });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await toBase64(e.target.files[0]);
      setFormState({ ...formState, imageUrl: base64 });
    }
  };

  const handleSubmit = () => {
    if (formState.name && formState.email) {
      if (editingTrainer) {
        updateTrainer(formState as Trainer);
      } else {
        addTrainer(formState);
      }
      handleCloseModal();
    } else {
      alert("Please fill Name and Email fields.");
    }
  };

  const handleDelete = () => {
    if (trainerToDelete) {
      deleteTrainer(trainerToDelete.id);
      setTrainerToDelete(null);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#1E293B" }}>
          Trainers
        </h1>
        <button
          onClick={() => handleOpenModal()}
          style={{
            backgroundColor: "#4F46E5",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Trainer
        </button>
      </div>

      <Table headers={["Name", "Expertise", "Contact", "Actions"]}>
        {trainers.map((trainer) => (
          <tr key={trainer.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
            <td style={{ padding: "12px 16px", verticalAlign: "middle" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={
                    trainer.imageUrl ||
                    `https://ui-avatars.com/api/?name=${trainer.name.replace(
                      " ",
                      "+"
                    )}&background=random`
                  }
                  alt={trainer.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "12px",
                    objectFit: "cover",
                  }}
                />
                <span style={{ fontWeight: 500, color: "#1E293B" }}>
                  {trainer.name}
                </span>
              </div>
            </td>
            <td
              style={{
                padding: "16px",
                verticalAlign: "middle",
                color: "#475569",
              }}
            >
              {getExpertiseNames(trainer.expertise)}
            </td>
            <td
              style={{
                padding: "16px",
                verticalAlign: "middle",
                color: "#475569",
              }}
            >
              <div>{trainer.email}</div>
              <div style={{ fontSize: "12px" }}>{trainer.phone}</div>
            </td>
            <td style={{ padding: "16px", verticalAlign: "middle" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => handleOpenModal(trainer)}
                  style={{
                    padding: "4px",
                    borderRadius: "50%",
                    color: "#64748B",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <EditIcon style={{ width: "20px", height: "20px" }} />
                </button>
                <button
                  onClick={() => setTrainerToDelete(trainer)}
                  style={{
                    padding: "4px",
                    borderRadius: "50%",
                    color: "#64748B",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <DeleteIcon style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {trainerToDelete && (
        <ConfirmationModal
          title="Delete Trainer"
          message={`Are you sure you want to delete ${trainerToDelete.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setTrainerToDelete(null)}
        />
      )}

      {isModalOpen && (
        <Modal
          title={editingTrainer ? "Edit Trainer" : "Add New Trainer"}
          onClose={handleCloseModal}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormInput
              label="Full Name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formState.phone}
              onChange={handleInputChange}
            />
            <FormSelect
              label="Gender"
              name="gender"
              value={formState.gender}
              onChange={handleInputChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </FormSelect>
            <FormTextArea
              label="Address"
              name="address"
              value={formState.address}
              onChange={handleInputChange}
            />
            <FormInput
              label="Profile Picture"
              name="imageUrl"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Expertise Section */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                  marginBottom: "8px",
                }}
              >
                Expertise
              </label>
              <div
                style={{
                  display: "grid",
                  gap: "8px",
                  padding: "8px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                }}
              >
                {courses.map((course) => (
                  <label
                    key={course.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px",
                      borderRadius: "6px",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formState.expertise.includes(course.id)}
                      onChange={() => handleExpertiseChange(course.id)}
                    />
                    <span style={{ fontSize: "14px", color: "#1E293B" }}>
                      {course.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #E2E8F0",
              }}
            >
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  marginRight: "8px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "#E2E8F0",
                  fontWeight: 600,
                  border: "none",
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
                  backgroundColor: "#4F46E5",
                  color: "#fff",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {editingTrainer ? "Save Changes" : "Add Trainer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TrainersView;
