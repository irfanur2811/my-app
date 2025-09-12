import React, { useEffect, useState } from 'react';

export default function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // mock data for now
    const sample = [
      { id: '1', name: 'Ali', age: 25, note: 'Initial check' },
      { id: '2', name: 'Sakib', age: 30, note: 'Follow up' },
      { id: '3', name: 'Riya', age: 28, note: 'New patient' },
    ];
    // simulate small delay
    const t = setTimeout(() => setPatients(sample), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="page patients">
      <h2>Patients</h2>
      {patients.length === 0 ? (
        <p>No patients yet</p>
      ) : (
        <div className="grid">
          {patients.map(p => (
            <div key={p.id} className="patient-card">
              <h4>{p.name}</h4>
              <p>Age: {p.age}</p>
              <p className="muted">{p.note}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
