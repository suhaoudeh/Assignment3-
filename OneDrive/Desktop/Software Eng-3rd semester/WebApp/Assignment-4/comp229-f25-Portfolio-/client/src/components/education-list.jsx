import { useEffect, useState } from 'react';
import EducationForm from './education-form.jsx';

// export default function EducationList() {
//   const [items, setItems] = useState([]);
//   const [editing, setEditing] = useState(null);

//   const fetchItems = () => {
//     fetch('/api/education')
//       .then(r => r.json())
//       .then(setItems)
//       .catch(err => console.error('Failed to fetch education', err));
//   };

//   useEffect(() => { fetchItems(); }, []);

//   const handleDelete = (id) => {
//     if (!confirm('Delete this entry?')) return;
//     fetch(`/api/education/${id}`, { method: 'DELETE' })
//       .then(() => fetchItems())
//       .catch(err => console.error(err));
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Education</h2>
//       <EducationForm
//         key={editing?._id || 'new'}
//         existing={editing}
//         onSaved={() => { setEditing(null); fetchItems(); }}
//       />

//       <ul className="list-group mt-3">
//         {items.map(it => (
//           <li className="list-group-item d-flex justify-content-between align-items-start" key={it._id}>
//             <div>
//               <strong>{it.degree}</strong> — {it.institution}
//               <div className="small text-muted">{it.startDate} — {it.endDate}</div>
//             </div>
//             <div>
//               <button className="btn btn-sm btn-primary me-2" onClick={() => setEditing(it)}>Edit</button>
//               <button className="btn btn-sm btn-danger" onClick={() => handleDelete(it._id)}>Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
export default function Education() {
  const [educations, setEducations] = useState([]);
  const [error, setError] = useState(null);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editEdu, setEditEdu] = useState(null);

  const token = localStorage.getItem('token');

  const fetchEducation = async () => {
    setError(null);
    setEducations([]);

    if (!token) {
      setError('Please log in to view education entries.');
      return;
    }

    try {
      const res = await fetch('/api/education', { headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.message || 'Failed to fetch education');
      }
      setEducations(body);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEducation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refresh + close form after saving
  const handleSaved = () => {
    setShowEduForm(false);
    setEditEdu(null);
    fetchEducation();
  };

  // Delete an education entry (owner only)
  const handleDelete = async (id) => {
    if (!confirm('Delete this education entry?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = body.message || body.error || 'Delete failed';
        throw new Error(msg);
      }
      // refresh list
      fetchEducation();
    } catch (err) {
      console.error('Delete failed', err);
      setError(err.message);
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Education</h1>
        {token ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowEduForm(!showEduForm);
              setEditEdu(null);
            }}
          >
            {showEduForm ? 'Close Form' : 'Add Education'}
          </button>
        ) : (
          <div className="text-muted">Log in to add or view education entries.</div>
        )}
      </div>

      {/* Show Form */}
      {showEduForm && (
        <div className="mt-3">
          <EducationForm existing={editEdu} onSaved={handleSaved} />
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}

      {/* Education List */}
      {educations.length === 0 ? (
        <p>No education entries yet.</p>
      ) : (
        educations.map((edu) => (
          <div key={edu._id} className="border p-3 mb-2">
            <h5>
              {edu.degree} - {edu.institution}
            </h5>
            <p>
              {edu.startDate} - {edu.endDate}
            </p>
            <p>{edu.description}</p>

            <div>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => {
                  setEditEdu(edu);
                  setShowEduForm(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => handleDelete(edu._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}