export interface ContactItem {
  id: string;
  key: string;
  value: string;
}

export interface SkillItem {
  id: string;
  key: string;
  value: string;
}

export interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    subtitle: string;
    photo?: string;
    contactItems: ContactItem[];
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights: string[];
  }[];
  education: {
    id: string;
    institution: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights: string[];
  }[];
  skills: SkillItem[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  projects: {
    id: string;
    title: string;
    subTitle: string;
    description: string;
    technologies: string;
    position: string;
    responsibilities: string;
    demo?: string;
    source?: string;
  }[];
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'professional' | 'creative' | 'modern' | 'minimal';
  isPremium: boolean;
}

export const defaultCVData: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    subtitle: '',
    contactItems: [],
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
};

export const sampleCVData: CVData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Anderson',
    title: 'Senior Software Engineer',
    subtitle: 'Building scalable web applications',
    photo: '',
    contactItems: [
      { id: '1', key: 'Email', value: 'john.anderson@email.com' },
      { id: '2', key: 'Phone', value: '+1 (555) 123-4567' },
      { id: '3', key: 'Location', value: 'San Francisco, CA' },
      { id: '4', key: 'LinkedIn', value: 'linkedin.com/in/johnanderson' },
      { id: '5', key: 'Website', value: 'johnanderson.dev' },
    ],
  },
  summary: '<p>Passionate software engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Led teams of 5-10 engineers delivering products used by millions.</p>',
  experience: [
    {
      id: '1',
      company: 'Tech Corp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Lead developer for the core platform team, responsible for architecting and implementing key features.',
      highlights: [
        'Led migration of legacy system to microservices, reducing latency by 40%',
        'Mentored 5 junior developers, improving team velocity by 25%',
        'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
      ],
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'New York, NY',
      startDate: '2018-06',
      endDate: '2020-12',
      current: false,
      description: 'Full-stack development for a B2B SaaS platform serving enterprise clients.',
      highlights: [
        'Built real-time collaboration features using WebSockets',
        'Developed RESTful APIs serving 10K+ daily requests',
        'Optimized database queries improving page load by 60%',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      position: 'Bachelor of Science - Computer Science',
      location: 'Berkeley, CA',
      startDate: '2014-09',
      endDate: '2018-05',
      current: false,
      description: 'Graduated with honors. Focused on software engineering and machine learning.',
      highlights: ['Dean\'s List 2016-2018', 'CS Club President'],
    },
  ],
  skills: [
    { id: '1', key: 'Frontend', value: 'React, TypeScript, Next.js, Tailwind CSS, Vue.js' },
    { id: '2', key: 'Backend', value: 'Node.js, Python, PostgreSQL, MongoDB, Redis' },
    { id: '3', key: 'DevOps', value: 'AWS, Docker, Kubernetes, CI/CD, Terraform' },
  ],
  certifications: [
    { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2023-03' },
    { id: '2', name: 'Google Cloud Professional', issuer: 'Google', date: '2022-08' },
  ],
  projects: [
    {
      id: '1',
      title: 'Open Source Dashboard',
      subTitle: 'Analytics Platform',
      description: '<p>A customizable analytics dashboard built with React and D3.js for real-time data visualization.</p>',
      technologies: 'React, D3.js, TypeScript, GraphQL',
      position: 'Lead Developer',
      responsibilities: 'Designed the architecture, implemented core features, and managed the open-source community.',
      demo: 'https://dashboard-demo.com',
      source: 'github.com/john/dashboard',
    },
  ],
};
