import React, { useState } from 'react';
import { useImmerReducer } from 'use-immer';
import "./DataSiswa.css";

// --- Initial State ---
const initialState = {
  students: [
    { id: 1, nama: 'Baraka Ramadhan', umur: 16, kelas: '10-A' },
    { id: 2, nama: 'Bintang Maulana lazuardy', umur: 15, kelas: '10-B' }
  ]
};

// --- Reducer Logic dengan Immer ---
function studentReducer(draft, action) {
  switch (action.type) {
    case 'ADD_DATA':
      draft.students.push(action.payload);
      break;
    case 'DELETE_DATA':
      const indexToDelete = draft.students.findIndex(s => s.id === action.payload);
      if (indexToDelete !== -1) draft.students.splice(indexToDelete, 1);
      break;
    case 'EDIT_DATA':
      const indexToEdit = draft.students.findIndex(s => s.id === action.payload.id);
      if (indexToEdit !== -1) {
        draft.students[indexToEdit] = action.payload;
      }
      break;
    default:
      break;
  }
}

export default function StudentManager() {
  const [state, dispatch] = useImmerReducer(studentReducer, initialState);
  
  // State untuk form input
  const [formData, setFormData] = useState({ id: null, nama: '', umur: '', kelas: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Handler Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit Handler (Create & Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.umur || !formData.kelas) return alert("Mohon isi semua field!");

    if (isEditing) {
      dispatch({ type: 'EDIT_DATA', payload: { ...formData, umur: parseInt(formData.umur) } });
      setIsEditing(false);
    } else {
      const newData = { 
        ...formData, 
        id: Date.now(), 
        umur: parseInt(formData.umur) 
      };
      dispatch({ type: 'ADD_DATA', payload: newData });
    }
    setFormData({ id: null, nama: '', umur: '', kelas: '' }); // Reset form
  };

  // Set form untuk edit
  const handleEditClick = (student) => {
    setIsEditing(true);
    setFormData(student);
  };

  return (
    <div className="container">
      <h2>Manajemen Data Siswa</h2>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="student-form">
        <input name="nama" placeholder="Nama Siswa" value={formData.nama} onChange={handleChange} />
        <input name="umur" type="number" placeholder="Umur" value={formData.umur} onChange={handleChange} />
        <input name="kelas" placeholder="Kelas" value={formData.kelas} onChange={handleChange} />
        <button type="submit" className={isEditing ? "btn-edit" : "btn-add"}>
          {isEditing ? 'Update Data' : 'Tambah Siswa'}
        </button>
      </form>

      {/* Tabel Data */}
      <table className="student-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Umur</th>
            <th>Kelas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {state.students.map((student) => (
            <tr key={student.id}>
              <td>{student.nama}</td>
              <td>{student.umur} Tahun</td>
              <td>{student.kelas}</td>
              <td>
                <button className="action-btn edit" onClick={() => handleEditClick(student)}>Edit</button>
                <button className="action-btn delete" onClick={() => dispatch({ type: 'DELETE_DATA', payload: student.id })}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}