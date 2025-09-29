import * as React from "react";
import { useState } from "react";
import Table from "../common/Table";
import Modal from "../common/Modal";
import ConfirmationModal from "../common/ConfirmationModal";
import { useMockData } from "../../hooks/useMockData";
import type { Trainer } from "../../../../types";
import styles from "./TrainersView.module.scss"; // ✅ Import CSS Module

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

// Reusable form components
const FormInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label: string }
> = ({ label, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.label}>{label}</label>
    <input {...props} className={styles.input} />
  </div>
);

const FormSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }
> = ({ label, children, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.label}>{label}</label>
    <select {...props} className={styles.select}>
      {children}
    </select>
  </div>
);

const FormTextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
> = ({ label, ...props }) => (
  <div className={styles.formGroup}>
    <label className={styles.label}>{label}</label>
    <textarea {...props} rows={3} className={styles.textarea} />
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

  const getExpertiseNames = (expertiseIds: string[]) =>
    expertiseIds
      .map((id) => courses.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ");

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
  ) => setFormState({ ...formState, [e.target.name]: e.target.value });

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
      editingTrainer ? updateTrainer(formState as Trainer) : addTrainer(formState);
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
      <div className={styles.header}>
        <h1 className={styles.title}>Trainers</h1>
        <button onClick={() => handleOpenModal()} className={styles.addBtn}>
          Add Trainer
        </button>
      </div>

      <Table headers={["Name", "Expertise", "Contact", "Actions"]}>
        {trainers.map((trainer) => (
          <tr key={trainer.id} className={styles.row}>
            <td className={styles.cell}>
              <div className={styles.trainerInfo}>
                <img
                  src={
                    trainer.imageUrl ||
                    `https://ui-avatars.com/api/?name=${trainer.name.replace(
                      " ",
                      "+"
                    )}&background=random`
                  }
                  alt={trainer.name}
                  className={styles.avatar}
                />
                <span className={styles.trainerName}>{trainer.name}</span>
              </div>
            </td>
            <td className={styles.cell}>{getExpertiseNames(trainer.expertise)}</td>
            <td className={styles.cell}>
              <div>{trainer.email}</div>
              <div className={styles.phone}>{trainer.phone}</div>
            </td>
            <td className={styles.cell}>
              <div className={styles.actions}>
                <button
                  onClick={() => handleOpenModal(trainer)}
                  className={styles.iconBtn}
                >
                  <EditIcon className={styles.icon} />
                </button>
                <button
                  onClick={() => setTrainerToDelete(trainer)}
                  className={styles.iconBtn}
                >
                  <DeleteIcon className={styles.icon} />
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
            <div className={styles.formGroup}>
              <label className={styles.label}>Expertise</label>
              <div className={styles.expertiseBox}>
                {courses.map((course) => (
                  <label key={course.id} className={styles.expertiseItem}>
                    <input
                      type="checkbox"
                      checked={formState.expertise.includes(course.id)}
                      onChange={() => handleExpertiseChange(course.id)}
                    />
                    <span>{course.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionsRow}>
              <button
                type="button"
                onClick={handleCloseModal}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn}>
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
