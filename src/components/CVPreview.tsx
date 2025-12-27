import { CVData } from '@/types/cv';

interface CVPreviewProps {
  data: CVData;
}

const CVPreview = ({ data }: CVPreviewProps) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim();

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      <div className="p-6 md:p-8 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Header */}
        <header className="text-center pb-6 border-b border-border">
          {data.personalInfo.photo && (
            <img 
              src={data.personalInfo.photo} 
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-primary"
            />
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
            {fullName || 'Your Name'}
          </h1>
          <p className="text-lg text-primary font-medium">
            {data.personalInfo.title || 'Your Title'}
          </p>
          {data.personalInfo.subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {data.personalInfo.subtitle}
            </p>
          )}
          
          {/* Contact Items */}
          {data.personalInfo.contactItems.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-4">
              {data.personalInfo.contactItems.map((item) => (
                <span key={item.id} className="flex items-center gap-1">
                  <span className="font-medium text-primary">{item.key}:</span>
                  <span>{item.value}</span>
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2 pb-1 border-b border-primary/20">
              Professional Summary
            </h2>
            <div 
              className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
              dangerouslySetInnerHTML={{ __html: data.summary }}
            />
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3 pb-1 border-b border-primary/20">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-foreground">{exp.position}</h3>
                      <p className="text-primary text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                  )}
                  {exp.highlights.length > 0 && exp.highlights[0] && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.filter(h => h).map((highlight, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3 pb-1 border-b border-primary/20">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{edu.degree} in {edu.field}</h3>
                      <p className="text-primary text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-muted-foreground mt-1">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3 pb-1 border-b border-primary/20">
              Skills
            </h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index}>
                  <span className="text-sm font-medium text-foreground">{skill.category}: </span>
                  <span className="text-sm text-muted-foreground">{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3 pb-1 border-b border-primary/20">
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(cert.date)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3 pb-1 border-b border-primary/20">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-foreground text-sm">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mb-3 pb-1 border-b border-primary/20">
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.languages.map((lang, index) => (
                <span key={index} className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{lang.name}</span> - {lang.level}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CVPreview;
