import { useState, useEffect } from 'react';

export default function EducationForm({ existing, onSaved }) {
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (existing) {
      setDegree(existing.degree || '');
      setInstitution(existing.institution || '');
      setStartDate(existing.startDate || '');
      setEndDate(existing.endDate || '');
      setDescription(existing.description || '');
    } else {
      setDegree(''); setInstitution(''); setStartDate(''); setEndDate(''); setDescription('');
    }
  }, [existing]);

  const token = localStorage.getItem('token');

  const submit = (e) => {
    e.preventDefault();
    const payload = { degree, institution, startDate, endDate, description };
    const method = existing ? 'PUT' : 'POST';
    const url = existing ? `/api/education/${existing._id}` : '/api/education';

    fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(payload) })
      .then(async (r) => {
        if (!r.ok) {
          const errBody = await r.json().catch(() => ({}));
          throw new Error(errBody.message || 'Save failed');
        }
        return r.json();
      })
      .then(() => { if (onSaved) onSaved(); })
      .catch(err => {
        console.error('Save failed', err);
        alert('Save failed: ' + err.message);
      });
  };

  return (
    <form onSubmit={submit} className="border p-3">
      <div className="mb-2">
        <label className="form-label">Degree</label>
        <input className="form-control" value={degree} onChange={e => setDegree(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="form-label">Institution</label>
        <input className="form-control" value={institution} onChange={e => setInstitution(e.target.value)} required />
      </div>
      <div className="row">
        <div className="col mb-2">
          <label className="form-label">Start</label>
          <input className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="col mb-2">
          <label className="form-label">End</label>
          <input className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>
      <div className="mb-2">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <button className="btn btn-success" type="submit">{existing ? 'Update' : 'Add'}</button>
    </form>
  );
}

 