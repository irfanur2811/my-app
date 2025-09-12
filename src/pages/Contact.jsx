import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: ''});
  function onChange(e){ setForm({...form, [e.target.name]: e.target.value}); }
  function onSubmit(e){ e.preventDefault(); alert('Thanks! — demo form, no backend yet'); }

  return (
    <section className="page contact">
      <h2>Contact</h2>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required/>
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} required/>
        </label>
        <label>
          Message
          <textarea name="message" value={form.message} onChange={onChange} required/>
        </label>
        <button className="btn" type="submit">Send</button>
      </form>
    </section>
  );
}
