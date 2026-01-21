import { forwardRef } from 'react';
import { CVData } from '@/types/cv';
import { ColorPalette } from './ColorPaletteSelector';

interface CVPrintableProps {
  data: CVData;
  palette: ColorPalette;
  templateId: string;
}

const CVPrintable = forwardRef<HTMLDivElement, CVPrintableProps>(({ data, palette, templateId }, ref) => {
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
      ref={ref}
      style={{ 
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: palette.background, 
        color: palette.text,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '15mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <header style={{ 
        paddingBottom: '12px',
        marginBottom: '16px',
        borderBottom: `2px solid ${palette.primary}20`,
        textAlign: isCreative ? 'left' : 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: isCreative ? 'row' : 'column',
          alignItems: isCreative ? 'flex-start' : 'center',
          gap: '12px'
        }}>
          {data.personalInfo.photo ? (
            <img 
              src={data.personalInfo.photo} 
              alt={fullName} 
              style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: `2px solid ${palette.primary}`,
                flexShrink: 0
              }} 
            />
          ) : isCreative && (
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              backgroundColor: palette.primary, 
              color: '#fff',
              flexShrink: 0
            }}>
              {data.personalInfo.firstName?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h1 style={{ 
              margin: 0,
              fontSize: isModern ? '28px' : isMinimal ? '24px' : '26px',
              fontWeight: isMinimal ? 300 : 700,
              letterSpacing: isModern ? '-0.5px' : 'normal',
              color: palette.text
            }}>
              {fullName || 'Your Name'}
            </h1>
            <p style={{ 
              margin: '4px 0 0 0',
              fontSize: isMinimal ? '16px' : '18px',
              fontWeight: 500,
              color: palette.primary
            }}>
              {data.personalInfo.title || 'Your Title'}
            </p>
            {data.personalInfo.subtitle && (
              <p style={{ 
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: `${palette.text}99`
              }}>
                {data.personalInfo.subtitle}
              </p>
            )}
          </div>
        </div>
        
        {data.personalInfo.contactItems.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px',
            marginTop: '12px',
            fontSize: '12px',
            justifyContent: isCreative ? 'flex-start' : 'center'
          }}>
            {data.personalInfo.contactItems.map((item) => (
              <span key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 500, color: palette.primary }}>{item.key}:</span>
                <span style={{ color: palette.text }}>{item.value}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {data.summary && (
        <section style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            margin: '0 0 8px 0',
            fontSize: isMinimal ? '14px' : '16px',
            fontWeight: 600,
            textTransform: isMinimal ? 'uppercase' : 'none',
            letterSpacing: isMinimal ? '1px' : 'normal',
            paddingBottom: isMinimal ? '0' : '4px',
            borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`,
            color: palette.text
          }}>
            {isMinimal ? 'About' : 'Professional Summary'}
          </h2>
          <div 
            style={{ 
              fontSize: '13px', 
              lineHeight: 1.6, 
              color: `${palette.text}cc` 
            }} 
            dangerouslySetInnerHTML={{ __html: data.summary }} 
          />
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0',
            fontSize: isMinimal ? '14px' : '16px',
            fontWeight: 600,
            textTransform: isMinimal ? 'uppercase' : 'none',
            letterSpacing: isMinimal ? '1px' : 'normal',
            paddingBottom: isMinimal ? '0' : '4px',
            borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`,
            color: palette.text
          }}>
            Experience
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.experience.map((exp) => (
              <div 
                key={exp.id} 
                style={{ 
                  paddingLeft: isCreative ? '12px' : '0',
                  borderLeft: isCreative ? `3px solid ${palette.primary}` : 'none'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '4px'
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: palette.text }}>
                      {exp.position}
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: palette.primary }}>
                      {exp.company}
                    </p>
                  </div>
                  <span style={{ fontSize: '11px', color: `${palette.text}80`, whiteSpace: 'nowrap' }}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: `${palette.text}cc` }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0',
            fontSize: isMinimal ? '14px' : '16px',
            fontWeight: 600,
            textTransform: isMinimal ? 'uppercase' : 'none',
            letterSpacing: isMinimal ? '1px' : 'normal',
            paddingBottom: isMinimal ? '0' : '4px',
            borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`,
            color: palette.text
          }}>
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.education.map((edu) => (
              <div 
                key={edu.id}
                style={{ 
                  paddingLeft: isCreative ? '12px' : '0',
                  borderLeft: isCreative ? `3px solid ${palette.primary}` : 'none'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '4px'
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: palette.text }}>
                      {edu.position}
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: palette.primary }}>
                      {edu.institution}
                    </p>
                  </div>
                  <span style={{ fontSize: '11px', color: `${palette.text}80`, whiteSpace: 'nowrap' }}>
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: `${palette.text}cc` }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0',
            fontSize: isMinimal ? '14px' : '16px',
            fontWeight: 600,
            textTransform: isMinimal ? 'uppercase' : 'none',
            letterSpacing: isMinimal ? '1px' : 'normal',
            paddingBottom: isMinimal ? '0' : '4px',
            borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`,
            color: palette.text
          }}>
            Skills
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.skills.map((skill) => (
              <div key={skill.id}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: palette.text }}>{skill.key}: </span>
                <span style={{ fontSize: '13px', color: `${palette.text}cc` }}>{skill.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0',
            fontSize: isMinimal ? '14px' : '16px',
            fontWeight: 600,
            textTransform: isMinimal ? 'uppercase' : 'none',
            letterSpacing: isMinimal ? '1px' : 'normal',
            paddingBottom: isMinimal ? '0' : '4px',
            borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`,
            color: palette.text
          }}>
            Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: palette.text }}>{cert.name}</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: `${palette.text}80` }}>{cert.issuer}</p>
                </div>
                <span style={{ fontSize: '11px', color: `${palette.text}80` }}>{formatDate(cert.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section style={{ marginBottom: '14px' }}>
          <h2 style={{ 
            margin: '0 0 10px 0',
            fontSize: isMinimal ? '14px' : '16px',
            fontWeight: 600,
            textTransform: isMinimal ? 'uppercase' : 'none',
            letterSpacing: isMinimal ? '1px' : 'normal',
            paddingBottom: isMinimal ? '0' : '4px',
            borderBottom: isMinimal ? 'none' : `1px solid ${palette.primary}40`,
            color: palette.text
          }}>
            Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.projects.map((project) => (
              <div key={project.id}>
                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: palette.text }}>
                  {project.title}
                </h3>
                {project.subTitle && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: palette.primary }}>
                    {project.subTitle}
                  </p>
                )}
                {project.position && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: `${palette.text}99` }}>
                    <strong>Position:</strong> {project.position}
                  </p>
                )}
                {project.description && (
                  <div 
                    style={{ margin: '4px 0 0 0', fontSize: '12px', color: `${palette.text}cc` }} 
                    dangerouslySetInnerHTML={{ __html: project.description }} 
                  />
                )}
                {project.responsibilities && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: `${palette.text}cc` }}>
                    <strong>Responsibilities:</strong> {project.responsibilities}
                  </p>
                )}
                {project.technologies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {project.technologies.split(',').map((tech, i) => (
                      <span 
                        key={i} 
                        style={{ 
                          fontSize: '10px', 
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          backgroundColor: `${palette.primary}15`, 
                          color: palette.primary 
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {(project.demo || project.source) && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px' }}>
                    {project.demo && (
                      <span style={{ color: palette.primary }}>Demo: {project.demo}</span>
                    )}
                    {project.source && (
                      <span style={{ color: palette.primary }}>Source: {project.source}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

CVPrintable.displayName = 'CVPrintable';

export default CVPrintable;
