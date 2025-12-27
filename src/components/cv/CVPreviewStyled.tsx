import { CVData } from '@/types/cv';
import { ColorPalette } from './ColorPaletteSelector';

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

  const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim();

  return (
    <div 
      className="rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
      style={{ backgroundColor: palette.background, color: palette.text }}
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 max-h-[calc(100vh-10rem)] lg:max-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Header */}
        <header className={`pb-5 ${isCreative ? 'text-left' : 'text-center'}`} style={{ borderBottom: `2px solid ${palette.primary}20` }}>
          <div className={`flex ${isCreative ? 'flex-row items-start gap-4' : 'flex-col items-center'}`}>
            {data.personalInfo.photo ? (
              <img src={data.personalInfo.photo} alt={fullName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2" style={{ borderColor: palette.primary }} />
            ) : isCreative && (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0" style={{ backgroundColor: palette.primary, color: '#fff' }}>
                {data.personalInfo.firstName?.charAt(0) || 'U'}
              </div>
            )}
            <div className={isCreative ? '' : 'text-center'}>
              <h1 className={`font-bold mb-1 ${isModern ? 'text-2xl sm:text-3xl tracking-tight' : isMinimal ? 'text-xl sm:text-2xl font-light' : 'text-xl sm:text-2xl md:text-3xl'}`} style={{ color: palette.text }}>
                {fullName || 'Your Name'}
              </h1>
              <p className={`font-medium ${isMinimal ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`} style={{ color: palette.primary }}>
                {data.personalInfo.title || 'Your Title'}
              </p>
              {data.personalInfo.subtitle && <p className="text-sm mt-1" style={{ color: `${palette.text}99` }}>{data.personalInfo.subtitle}</p>}
            </div>
          </div>
          {data.personalInfo.contactItems.length > 0 && (
            <div className={`flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mt-4 ${isCreative ? 'justify-start' : 'justify-center'}`}>
              {data.personalInfo.contactItems.map((item) => (
                <span key={item.id} className="flex items-center gap-1">
                  <span className="font-medium" style={{ color: palette.primary }}>{item.key}:</span>
                  <span style={{ color: palette.text }}>{item.value}</span>
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className={`font-semibold mb-2 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`} style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}>
              {isMinimal ? 'About' : 'Professional Summary'}
            </h2>
            <div className="text-sm leading-relaxed prose prose-sm max-w-none" style={{ color: `${palette.text}cc` }} dangerouslySetInnerHTML={{ __html: data.summary }} />
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section>
            <h2 className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`} style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}>Experience</h2>
            <div className="space-y-3 sm:space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className={isCreative ? 'pl-3 sm:pl-4' : ''} style={{ borderLeft: isCreative ? `3px solid ${palette.primary}` : 'none' }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base" style={{ color: palette.text }}>{exp.position}</h3>
                      <p className="text-xs sm:text-sm" style={{ color: palette.primary }}>{exp.company}</p>
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: `${palette.text}80` }}>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  {exp.description && <p className="text-sm mt-1" style={{ color: `${palette.text}cc` }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`} style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}>Education</h2>
            <div className="space-y-2 sm:space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className={isCreative ? 'pl-3 sm:pl-4' : ''} style={{ borderLeft: isCreative ? `3px solid ${palette.primary}` : 'none' }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base" style={{ color: palette.text }}>{edu.position}</h3>
                      <p className="text-xs sm:text-sm" style={{ color: palette.primary }}>{edu.institution}</p>
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: `${palette.text}80` }}>{formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}</span>
                  </div>
                  {edu.description && <p className="text-sm mt-1" style={{ color: `${palette.text}cc` }}>{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`} style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}>Skills</h2>
            <div className="space-y-2">
              {data.skills.map((skill) => (
                <div key={skill.id}>
                  <span className="text-sm font-medium" style={{ color: palette.text }}>{skill.key}: </span>
                  <span className="text-sm" style={{ color: `${palette.text}cc` }}>{skill.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h2 className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`} style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}>Certifications</h2>
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
            <h2 className={`font-semibold mb-3 pb-1 ${isMinimal ? 'text-base uppercase tracking-wider' : 'text-lg'}`} style={{ borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`, color: palette.text }}>Projects</h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <h3 className="font-semibold text-sm" style={{ color: palette.text }}>{project.title}</h3>
                  {project.subTitle && <p className="text-xs" style={{ color: palette.primary }}>{project.subTitle}</p>}
                  {project.description && <div className="text-sm mt-1" style={{ color: `${palette.text}cc` }} dangerouslySetInnerHTML={{ __html: project.description }} />}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.split(',').map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${palette.primary}15`, color: palette.primary }}>{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CVPreviewStyled;