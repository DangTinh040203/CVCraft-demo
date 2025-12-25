export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    linkedin?: string;
    website?: string;
    photo?: string;
  };
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
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    highlights: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    highlights: string[];
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
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

export const sampleCVData: CVData = {
  personalInfo: {
    fullName: 'John Anderson',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    summary: 'Passionate software engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Led teams of 5-10 engineers delivering products used by millions.',
    linkedin: 'linkedin.com/in/johnanderson',
    website: 'johnanderson.dev',
  },
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
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8',
      highlights: ['Dean\'s List 2016-2018', 'CS Club President'],
    },
  ],
  skills: [
    { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'] },
    { category: 'DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Spanish', level: 'Professional' },
  ],
  certifications: [
    { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2023-03' },
    { id: '2', name: 'Google Cloud Professional', issuer: 'Google', date: '2022-08' },
  ],
  projects: [
    {
      id: '1',
      name: 'Open Source Dashboard',
      description: 'A customizable analytics dashboard built with React and D3.js',
      technologies: ['React', 'D3.js', 'TypeScript', 'GraphQL'],
      url: 'github.com/john/dashboard',
      highlights: ['2K+ GitHub stars', 'Used by 500+ companies'],
    },
  ],
};
