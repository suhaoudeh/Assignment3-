import React, { useEffect, useState } from 'react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [educations, setEducations] = useState([]);
  const [eduError, setEduError] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch projects only when logged in
  const fetchProjects = async () => {
    setError(null);
    setProjects([]);

    if (!token) {
      setError('Please log in to view projects.');
      return;
    }

    try {
      const res = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to fetch projects');
      setProjects(body);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEducation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchEducation = async () => {
    setEduError(null);
    setEducations([]);

    if (!token) {
      setEduError('Please log in to view education entries.');
      return;
    }

    try {
      const res = await fetch('/api/education', { headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to fetch education');
      setEducations(body);
    } catch (err) {
      setEduError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Welcome to the Home Page</h1>
      <p className="text-muted">A quick snapshot of your projects and education, personalized once you sign in.</p>
      {error && <p className="text-danger">Error: {error}</p>}

      {/* Projects Section */}
      <section className="mt-4">
        <h2>Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          projects.map((project) => (
              <div key={project._id} className="border p-3 mb-2">
                <h5>{project.name}</h5>
                <p>{project.description}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
                )}
              </div>
          ))
        )}
      </section>

      {/* Education Section */}
      <section className="mt-4">
        <h2>Education</h2>
        {eduError && <p className="text-danger">Error: {eduError}</p>}
        {!token ? (
          <p className="text-muted">Log in to view education entries.</p>
        ) : educations.length === 0 ? (
          <p>No education entries yet.</p>
        ) : (
          educations.map((edu) => (
            <div key={edu._id} className="border p-3 mb-2">
              <h5>{edu.degree} - {edu.institution}</h5>
              <p>{edu.startDate} - {edu.endDate}</p>
              <p>{edu.description}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
