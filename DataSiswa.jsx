import { createContext, useContext, useState, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import "./DataSiswa.css";

const StudentContext = createContext(null);

function studentReducer(draft, action) {
  switch (action.type) {
    case "ADD_STUDENT":
      draft.push(action.payload);
      break;

    case "DELETE_STUDENT":
      return draft.filter((s) => s.id !== action.payload);

    case "UPDATE_STUDENT": {
      const index = draft.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        draft[index] = action.payload;
      }
      break;
    }

    default:
      break;
  }
}

export default function DataSiswa() {
  const [students, dispatch] = useImmerReducer(studentReducer, [
    { id: 1, nama: "Baraka Ramadhan", umur: 16, kelas: "10-A" },
    { id: 2, nama: "Bintang Maulana Lazuardy", umur: 15, kelas: "10-B" },
  ]);

  const [editingStudent, setEditingStudent] = useState(null);

  return (
    <StudentContext.Provider
      value={{ students, dispatch, editingStudent, setEditingStudent }}
    >
      <div className="container">
        <h2>Manajemen Data Siswa</h2>
        <StudentForm />
        <StudentTable />
      </div>
    </StudentContext.Provider>
  );
}

function StudentForm() {
  const { dispatch, editingStudent, setEditingStudent } =
    useContext(StudentContext);

  const [form, setForm] = useState({
    id: null,
    nama: "",
    umur: "",
    kelas: "",
  });

  // ✅ update form saat edit
  useEffect(() => {
    if (editingStudent) {
      setForm(editingStudent);
    }
  }, [editingStudent]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.nama || !form.umur || !form.kelas) return;

    if (editingStudent) {
      dispatch({
        type: "UPDATE_STUDENT",
        payload: { ...form, umur: Number(form.umur) },
      });
      setEditingStudent(null);
    } else {
      dispatch({
        type: "ADD_STUDENT",
        payload: {
          ...form,
          id: Date.now(),
          umur: Number(form.umur),
        },
      });
    }

    setForm({ id: null, nama: "", umur: "", kelas: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <input
        placeholder="Nama"
        value={form.nama}
        onChange={(e) => setForm({ ...form, nama: e.target.value })}
      />

      <input
        type="number"
        placeholder="Umur"
        value={form.umur}
        onChange={(e) => setForm({ ...form, umur: e.target.value })}
      />

      <input
        placeholder="Kelas"
        value={form.kelas}
        onChange={(e) => setForm({ ...form, kelas: e.target.value })}
      />

      <button
        type="submit"
        className={editingStudent ? "btn-edit" : "btn-add"}
      >
        {editingStudent ? "Update" : "Tambah"}
      </button>
    </form>
  );
}

function StudentTable() {
  const { students, dispatch, setEditingStudent } =
    useContext(StudentContext);

  return (
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
        {students.map((s) => (
          <tr key={s.id}>
            <td>{s.nama}</td>
            <td>{s.umur} Tahun</td>
            <td>{s.kelas}</td>
            <td>
              <button
                className="action-btn edit"
                onClick={() => setEditingStudent(s)}
              >
                Edit
              </button>

              <button
                className="action-btn delete"
                onClick={() =>
                  dispatch({ type: "DELETE_STUDENT", payload: s.id })
                }
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
