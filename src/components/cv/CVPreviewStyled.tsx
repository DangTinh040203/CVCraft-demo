import { CVData } from '@/types/cv';
import { ColorPalette } from './ColorPaletteSelector';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CVPreviewStyledProps {
  data: CVData;
  palette: ColorPalette;
  templateId: string;
}

const CVPreviewStyled = ({ data, palette, templateId }: CVPreviewStyledProps) => {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [year, month] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const isModern = templateId.includes('modern') || templateId.includes('tech');
  const isCreative = templateId.includes('creative') || templateId.includes('designer');
  const isMinimal = templateId.includes('minimal') || templateId.includes('zen');

  return (
    <div 
      className="rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
      style={{ 
        backgroundColor: palette.background,
        color: palette.text,
      }}
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 max-h-[calc(100vh-10rem)] lg:max-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Header */}
        <header 
          className={`pb-5 ${isCreative ? 'text-left' : 'text-center'}`}
          style={{ borderBottom: `2px solid ${palette.primary}20` }}
        >
          {isCreative && (
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4 flex items-center justify-center text-xl sm:text-2xl font-bold"
              style={{ backgroundColor: palette.primary, color: '#fff' }}
            >
              {data.personalInfo.fullName?.charAt(0) || 'U'}
            </div>
          )}
          <h1 
            className={`font-bold mb-1 ${isModern ? 'text-2xl sm:text-3xl tracking-tight' : isMinimal ? 'text-xl sm:text-2xl font-light' : 'text-xl sm:text-2xl md:text-3xl'}`}
            style={{ color: palette.text }}
          >
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p 
            className={`font-medium mb-3 sm:mb-4 ${isMinimal ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}
            style={{ color: palette.primary }}
          >
            {data.personalInfo.title || 'Your Title'}
          </p>
          
          <div className={`flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm ${isCreative ? 'justify-start' : 'justify-center'}`} style={{ color: `${palette.text}99` }}>
            {data.personalInfo.email && (
              <a 
                href={`mailto:${data.personalInfo.email}`} 
                className="flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: palette.text }}
              >
                <Mail className="w-4 h-4" style={{ color: palette.primary }} />
                {data.personalInfo.email}
              </a>
            )}
            {data.personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" style={{ color: palette.primary }} />
                {data.personalInfo.phone}
              </span>
            )}
            {data.personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" style={{ color: palette.primary }} />
                {data.personalInfo.location}
              </span>
            )}
            {data.personalInfo.linkedin && (
              <a href={`https://${data.personalInfo.linkedin}`} className="flex items-center gap-1 hover:opacity-80">
                <Linkedin className="w-4 h-4" style={{ color: palette.primary }} />
                LinkedIn
              </a>
            )}
            {data.personalInfo.website && (
              <a href={`https://${data.personalInfo.website}`} className="flex items-center gap-1 hover:opacity-80">
                <Globe className="w-4 h-4" style={{ color: palette.primary }} />
                Portfolio
              </a>
            )}
          </div>
        </header>

        {/* Summary */}
        {data.personalInfo.summary && (
          <section>
            <h2 
              className={`font-semibold mb-2 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`}
              style={{ 
                borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`,
                color: palette.text
              }}
            >
              {isMinimal ? 'About' : 'Professional Summary'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: `${palette.text}cc` }}>
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 
              className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`}
              style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}
            >
              Experience
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className={isCreative ? 'pl-3 sm:pl-4' : ''} style={{ borderLeft: isCreative ? `3px solid ${palette.primary}` : 'none' }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base" style={{ color: palette.text }}>{exp.position}</h3>
                      <p className="text-xs sm:text-sm" style={{ color: palette.primary }}>{exp.company}</p>
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: `${palette.text}80` }}>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-1" style={{ color: `${palette.text}cc` }}>{exp.description}</p>
                  )}
                  {exp.highlights.length > 0 && exp.highlights[0] && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.filter(h => h).map((highlight, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: `${palette.text}cc` }}>
                          <span style={{ color: palette.primary }} className="mt-1">•</span>
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
            <h2 
              className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`}
              style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}
            >
              Education
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base" style={{ color: palette.text }}>{edu.degree} in {edu.field}</h3>
                      <p className="text-xs sm:text-sm" style={{ color: palette.primary }}>{edu.institution}</p>
                    </div>
                    <span className="text-xs" style={{ color: `${palette.text}80` }}>
                      {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm mt-1" style={{ color: `${palette.text}cc` }}>GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 
              className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`}
              style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}
            >
              Skills
            </h2>
            <div className={isCreative ? 'flex flex-wrap gap-2' : 'space-y-2'}>
              {isCreative ? (
                data.skills.flatMap(skill => skill.items).map((item, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${palette.primary}15`, color: palette.primary }}
                  >
                    {item}
                  </span>
                ))
              ) : (
                data.skills.map((skill, index) => (
                  <div key={index}>
                    <span className="text-sm font-medium" style={{ color: palette.text }}>{skill.category}: </span>
                    <span className="text-sm" style={{ color: `${palette.text}cc` }}>{skill.items.join(', ')}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h2 
              className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`}
              style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm" style={{ color: palette.text }}>{cert.name}</h3>
                    <p className="text-xs" style={{ color: `${palette.text}80` }}>{cert.issuer}</p>
                  </div>
                  <span className="text-xs" style={{ color: `${palette.text}80` }}>{formatDate(cert.date)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section>
            <h2 
              className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`}
              style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}
            >
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-sm" style={{ color: palette.text }}>{project.name}</h3>
                  <p className="text-sm" style={{ color: `${palette.text}cc` }}>{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${palette.primary}15`, color: palette.primary }}
                        >
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
            <h2 
              className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`}
              style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.languages.map((lang, index) => (
                <span key={index} className="text-sm" style={{ color: `${palette.text}cc` }}>
                  <span className="font-medium" style={{ color: palette.text }}>{lang.name}</span> - {lang.level}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CVPreviewStyled;
