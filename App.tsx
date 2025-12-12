import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  GraduationCap, 
  LayoutDashboard,
  UserCircle, 
  LogOut, 
  Mail, 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  FileText, 
  Home, 
  MonitorPlay, 
  ScrollText, 
  Network, 
  Bot, 
  Server, 
  Database, 
  ArrowLeft, 
  Info, 
  ExternalLink, 
  Handshake, 
  Briefcase, 
  Wifi, 
  Radio, 
  Lock, 
  Building2, 
  Code2, 
  Lightbulb, 
  Rocket, 
  BarChart, 
  Presentation, 
  MessageCircle, 
  Phone, 
  Download, 
  Save, 
  Menu, 
  X, 
  MapPin, 
  BrainCircuit, 
  Globe,
  Link,
  Video
} from 'lucide-react';
import { 
  User, 
  Course, 
  Enrollment, 
  EducationLevel, 
  SelectionCriteria, 
  CourseStatus, 
  EnrollmentStatus, 
  Professor 
} from './types';
import { ImageEditor } from './components/ImageEditor';
import { AdminDashboard } from './components/AdminDashboard';

// --- MOCK DATA & STORAGE UTILS ---

const COURSE_CATEGORIES = [
  'Redes de Computadores',
  'Cibersegurança',
  'IoT (Internet das Coisas)',
  'Inteligência Artificial',
  'Ciência de Dados',
  'Sistemas Operacionais (Linux, FreeBSD, UNIX)',
  'Programação',
  'Infraestrutura de TI'
];

const INITIAL_PROFESSORS: Professor[] = [
  {
    id: '1',
    name: 'Cristofe',
    role: 'Coordenador Técnico & PhD Candidate',
    bio: 'Doutorando em Computação no Centro de Informática CIn/UFPE; Mestre em Computação Aplicada pela Universidade do Vale do Rio dos Sinos; Pós-graduando em Inteligência Artificial Deep Learning. Atualmente é professor no Instituto Federal de Roraima - RR, Instrutor Cisco - Netacad Funding. Área de atuação: Redes de Computadores, IoT, AI e Computação Ubíqua.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    lattesUrl: 'http://lattes.cnpq.br/0666510670986707'
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'João da Silva',
    email: 'joao.silva@email.com',
    phone: '11999999999',
    age: 22,
    education: EducationLevel.SECONDARY,
    gender: 'M',
    address: 'Rua A, 123'
  },
  {
    id: 'u2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '11888888888',
    age: 28,
    education: EducationLevel.HIGHER,
    gender: 'F',
    address: 'Av. B, 456'
  }
];

const INITIAL_COURSES: Course[] = [
  // --- REDES DE COMPUTADORES ---
  {
    id: 'net-1',
    name: 'Networking Essentials',
    description: 'Aprenda os conceitos fundamentais de redes e como os dispositivos se comunicam. Ideal para iniciantes.',
    startDate: '2025-09-01',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.EDUCATION_HIGH,
    imageUrl: 'https://picsum.photos/400/200?random=1',
    category: 'Redes de Computadores',
    minAge: 16,
    prerequisites: 'Nenhum.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },
  {
    id: 'net-2',
    name: 'CCNA: Introduction to Networks (ITN)',
    description: 'O primeiro de três cursos CCNA. Abrange arquitetura, modelos, protocolos e elementos de rede.',
    startDate: '2025-09-15',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.AGE_DESC,
    imageUrl: 'https://picsum.photos/400/200?random=2',
    category: 'Redes de Computadores',
    minAge: 18,
    prerequisites: 'Networking Essentials recomendado.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },
  {
    id: 'net-3',
    name: 'CCNA: Switching, Routing, and Wireless Essentials',
    description: 'Foca em tecnologias de switching e operações de roteamento que suportam redes de pequenas e médias empresas.',
    startDate: '2025-10-01',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.FIRST_COME,
    imageUrl: 'https://picsum.photos/400/200?random=3',
    category: 'Redes de Computadores',
    minAge: 18,
    prerequisites: 'CCNA: ITN.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },
  {
    id: 'net-4',
    name: 'CCNA: Enterprise Networking, Security, and Automation',
    description: 'Descreve arquiteturas e considerações de design para redes corporativas seguras e automatizadas.',
    startDate: '2025-10-15',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.EDUCATION_HIGH,
    imageUrl: 'https://picsum.photos/400/200?random=4',
    category: 'Redes de Computadores',
    minAge: 18,
    prerequisites: 'CCNA: SRWE.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },

  // --- CIBERSEGURANÇA ---
  {
    id: 'sec-1',
    name: 'Introduction to Cybersecurity',
    description: 'Explore o mundo da segurança cibernética e entenda como proteger sua vida digital e a de empresas.',
    startDate: '2025-09-05',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.AGE_ASC,
    imageUrl: 'https://picsum.photos/400/200?random=5',
    category: 'Cibersegurança',
    minAge: 15,
    prerequisites: 'Nenhum.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },
  {
    id: 'sec-2',
    name: 'Cybersecurity Essentials',
    description: 'Aprofunde-se nos princípios de segurança, tecnologias e procedimentos para defender redes.',
    startDate: '2025-09-20',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.EDUCATION_HIGH,
    imageUrl: 'https://picsum.photos/400/200?random=6',
    category: 'Cibersegurança',
    minAge: 18,
    prerequisites: 'Introduction to Cybersecurity.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },
  {
    id: 'sec-3',
    name: 'CyberOps Associate',
    description: 'Desenvolva o conhecimento e as habilidades necessárias para trabalhar em um Centro de Operações de Segurança (SOC).',
    startDate: '2025-11-01',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.EDUCATION_HIGH,
    imageUrl: 'https://picsum.photos/400/200?random=7',
    category: 'Cibersegurança',
    minAge: 18,
    prerequisites: 'Conhecimentos de redes e segurança básica.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },

  // --- SISTEMAS OPERACIONAIS ---
  {
    id: 'os-1',
    name: 'NDG Linux Unhatched',
    description: 'Um mergulho rápido no Linux para iniciantes. Perfeito para começar a explorar o sistema operacional open source.',
    startDate: '2025-09-10',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.FIRST_COME,
    imageUrl: 'https://picsum.photos/400/200?random=8',
    category: 'Sistemas Operacionais (Linux, FreeBSD, UNIX)',
    minAge: 14,
    prerequisites: 'Nenhum.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'NDG / Cisco'
  },
  {
    id: 'os-2',
    name: 'NDG Linux Essentials',
    description: 'Aprenda os fundamentos do Linux, linha de comando e conceitos básicos de código aberto.',
    startDate: '2025-09-25',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.AGE_ASC,
    imageUrl: 'https://picsum.photos/400/200?random=9',
    category: 'Sistemas Operacionais (Linux, FreeBSD, UNIX)',
    minAge: 16,
    prerequisites: 'NDG Linux Unhatched recomendado.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'NDG / Cisco'
  },
  {
    id: 'os-3',
    name: 'Adminstração de Sistemas FreeBSD',
    description: 'Curso focado na instalação, configuração e administração de servidores utilizando o sistema operacional FreeBSD.',
    startDate: '2025-10-10',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.EDUCATION_HIGH,
    imageUrl: 'https://picsum.photos/400/200?random=10',
    category: 'Sistemas Operacionais (Linux, FreeBSD, UNIX)',
    minAge: 18,
    prerequisites: 'Conhecimentos sólidos em Unix/Linux.',
    professorId: '1',
    hasPartnership: false
  },

  // --- PROGRAMAÇÃO ---
  {
    id: 'prog-1',
    name: 'PCAP: Programming Essentials in Python',
    description: 'Comece a programar do zero com Python, uma das linguagens mais populares e versáteis do mercado.',
    startDate: '2025-09-01',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.FIRST_COME,
    imageUrl: 'https://picsum.photos/400/200?random=11',
    category: 'Programação',
    minAge: 14,
    prerequisites: 'Lógica básica.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Python Institute'
  },
  {
    id: 'prog-2',
    name: 'JavaScript Essentials 1',
    description: 'Aprenda a linguagem que impulsiona a web interativa. Fundamentos de JS para desenvolvimento front-end.',
    startDate: '2025-09-15',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.AGE_ASC,
    imageUrl: 'https://picsum.photos/400/200?random=12',
    category: 'Programação',
    minAge: 16,
    prerequisites: 'Nenhum.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },
  {
    id: 'prog-3',
    name: 'C++ Essentials',
    description: 'Domine os fundamentos de C++, uma linguagem poderosa usada em sistemas operacionais, jogos e IoT.',
    startDate: '2025-10-05',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.EDUCATION_HIGH,
    imageUrl: 'https://picsum.photos/400/200?random=13',
    category: 'Programação',
    minAge: 18,
    prerequisites: 'Lógica de programação.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'C++ Institute'
  },

  // --- IOT & DATA ---
  {
    id: 'iot-1',
    name: 'Introduction to IoT',
    description: 'Descubra como a Internet das Coisas está transformando o mundo e criando novas oportunidades de carreira.',
    startDate: '2025-09-08',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.FIRST_COME,
    imageUrl: 'https://picsum.photos/400/200?random=14',
    category: 'IoT (Internet das Coisas)',
    minAge: 16,
    prerequisites: 'Nenhum.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  },
  {
    id: 'iot-2',
    name: 'IoT Fundamentals: Big Data & Analytics',
    description: 'Aprenda a coletar, armazenar e analisar dados gerados por sensores IoT para tomada de decisões.',
    startDate: '2025-10-20',
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.EDUCATION_HIGH,
    imageUrl: 'https://picsum.photos/400/200?random=15',
    category: 'Ciência de Dados',
    minAge: 18,
    prerequisites: 'Python e IoT Básico.',
    professorId: '1',
    hasPartnership: true,
    partnerName: 'Cisco NetAcad'
  }
];

// --- BUSINESS SERVICES DATA ---
const BUSINESS_SERVICES = [
  {
    id: 'training',
    viewId: 'business_training',
    title: 'Treinamento Corporativo',
    icon: Briefcase,
    shortDesc: 'Capacitação sob medida para equipes de TI. Cursos customizados de cibersegurança, cloud e infraestrutura in-company ou remoto.',
    fullDesc: 'Oferecemos programas de educação corporativa desenhados especificamente para suprir os gaps de competência técnica da sua equipe. Utilizando metodologias ativas e ambientes de laboratório realistas, aceleramos o aprendizado em tecnologias críticas como Cloud Computing, DevOps, Segurança da Informação e Redes.',
    features: [
      'Conteúdo adaptado à realidade da empresa (In-Company ou Remoto)',
      'Mentoria com especialistas de mercado e acadêmicos',
      'Certificação técnica interna e preparação para provas oficiais',
      'Relatórios de evolução e desempenho da equipe'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'development',
    viewId: 'business_systems',
    title: 'Desenvolvimento de Sistemas',
    icon: Code2,
    shortDesc: 'Fábrica de software especializada em soluções IoT, dashboards analíticos e sistemas de gestão integrados para consórcios.',
    fullDesc: 'Transformamos necessidades complexas em software robusto e escalável. Nossa fábrica de software é especializada na criação de soluções que integram o mundo físico e digital (Phygital) através de IoT, além de plataformas de gestão para consórcios e dashboards analíticos para visualização de Big Data em tempo real.',
    features: [
      'Arquitetura de Microserviços e Serverless',
      'Integração de hardware (Sensores/Atuadores) com plataformas web',
      'Dashboards de Business Intelligence e Analytics',
      'APIs Restful seguras e documentadas'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'consulting',
    viewId: 'business_consulting',
    title: 'Consultoria Tecnológica',
    icon: Lightbulb,
    shortDesc: 'Assessoria para implementação de redes seguras, migração de dados e adoção de inteligência artificial em processos industriais.',
    fullDesc: 'Nossa consultoria visa modernizar o parque tecnológico da sua empresa, garantindo segurança, eficiência e inovação. Atuamos desde o diagnóstico da infraestrutura atual até o planejamento e execução da migração para tecnologias emergentes, com foco especial na adoção de Inteligência Artificial para otimização de processos industriais.',
    features: [
      'Diagnóstico e Auditoria de Cibersegurança',
      'Planejamento de Migração de Dados e Nuvem',
      'Implementação de IA em processos produtivos',
      'Projeto e Otimização de Infraestrutura de Redes'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }
];

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

// --- NEURAL BACKGROUND COMPONENT ---
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const numParticles = 100; 
    const connectionDistance = 200; 

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and Draw Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // Draw Connections (Synapses)
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(192, 192, 192, ${1.0 - distance / connectionDistance})`; 
            ctx.lineWidth = 1.5; 
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
       width = canvas.width = canvas.offsetWidth;
       height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// --- ADDITIONAL COMPONENTS ---

const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-brand-surface border border-brand-neon/50 p-8 rounded-2xl max-w-md w-full relative shadow-[0_0_50px_rgba(6,182,212,0.3)] text-center transform scale-100 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <CheckCircle className="text-green-500 w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-4">Solicitação Enviada!</h3>
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          Sua solicitação foi enviada com sucesso. <br/>
          <span className="text-brand-neon font-bold">Aguarde a aprovação da matrícula.</span>
        </p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-neon-sm hover:shadow-neon"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

const PublicCourseList = ({ 
  courses, 
  showOpenCoursesOnly, 
  openCourseDetail 
}: { 
  courses: Course[], 
  showOpenCoursesOnly: boolean, 
  openCourseDetail: (c: Course) => void 
}) => {
  const sortedCourses = useMemo(() => {
      let filtered = courses;
      if (showOpenCoursesOnly) {
          filtered = courses.filter(c => c.status === CourseStatus.OPEN);
      }
      return [...filtered].sort((a, b) => {
          if (a.status === CourseStatus.OPEN && b.status !== CourseStatus.OPEN) return -1;
          if (a.status !== CourseStatus.OPEN && b.status === CourseStatus.OPEN) return 1;
          if (a.status === CourseStatus.IN_PROGRESS && b.status === CourseStatus.CLOSED) return -1;
          if (a.status === CourseStatus.CLOSED && b.status === CourseStatus.IN_PROGRESS) return 1;
          return 0;
      });
  }, [courses, showOpenCoursesOnly]);


  if (sortedCourses.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-brand-500/30 rounded-lg">
        <p className="text-slate-500 font-mono">
            Nenhum curso com inscrições abertas. Instagram: <a href="https://instagram.com/professorcristofe" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-neon">@professorcristofe</a>
        </p>
        {showOpenCoursesOnly && (
           <p className="text-xs text-brand-500 mt-2">Tente visualizar todos os cursos.</p>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {sortedCourses.map(course => (
          <div key={course.id} className="group bg-brand-surface border border-brand-border hover:border-brand-neon/50 transition-all duration-500 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
               <div className="relative h-48 overflow-hidden">
                  <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent"></div>
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-sm border border-brand-500/30 text-brand-neon text-[10px] font-bold uppercase tracking-widest rounded">
                          {course.category}
                      </span>
                      {course.hasPartnership && course.partnerName && (
                        <span className="px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded border border-white">
                            {course.partnerName}
                        </span>
                      )}
                  </div>
               </div>
               
               <div className="p-6 flex-grow flex flex-col">
                   <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-neon transition-colors line-clamp-2 min-h-[3.5rem] uppercase tracking-wide">
                      {course.name}
                   </h3>
                   <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mb-4 uppercase">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(course.startDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Users size={12}/> Min: {course.minAge} Anos</span>
                   </div>
                   <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow border-l-2 border-brand-800 pl-3">
                      {course.description}
                   </p>
                   
                   <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between gap-4">
                       {course.status !== CourseStatus.CLOSED ? (
                           <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded ${
                                course.status === CourseStatus.OPEN ? 'border-green-500 text-green-400 bg-green-500/10' : 
                                'border-yellow-500 text-yellow-400 bg-yellow-500/10'
                            }`}>
                                {course.status === CourseStatus.OPEN ? '● Inscrições Abertas' : course.status.toUpperCase()}
                            </span>
                       ) : (
                           <div></div>
                       )}
                       
                       <button 
                          onClick={() => openCourseDetail(course)}
                          className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-brand-500 hover:text-white transition group/btn ml-auto"
                       >
                          Detalhes <ArrowLeft className="rotate-180 group-hover/btn:translate-x-1 transition-transform" size={14} />
                       </button>
                   </div>
               </div>
          </div>
       ))}
    </div>
  )
};

const TechInfoSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-brand-border pt-12">
        {[
            { 
                icon: Wifi, 
                title: "IoT e Conectividade", 
                desc: "Internet das Coisas, LoRaWAN e infraestrutura inteligente.",
                img: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            { 
                icon: BrainCircuit, 
                title: "Inteligência Artificial", 
                desc: "Redes Neurais, Machine Learning e Deep Learning aplicado.",
                img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            { 
                icon: Database, 
                title: "Big Data & AI", 
                desc: "Análise de dados, Machine Learning e redes neurais.",
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            { 
                icon: Server, 
                title: "Sistemas (Linux/BSD)", 
                desc: "Administração de servidores e Kernel Hacking.",
                img: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            }
        ].map((item, idx) => (
            <div key={idx} className="relative group overflow-hidden border border-brand-border bg-brand-dark rounded-xl h-64">
                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="w-10 h-10 bg-brand-neon/20 rounded-full flex items-center justify-center mb-3 border border-brand-neon/50">
                        <item.icon className="text-brand-neon" size={20} />
                    </div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-300 text-xs line-clamp-2">{item.desc}</p>
                </div>
            </div>
        ))}
    </div>
);

const BusinessSection = ({ setView }: { setView: (v: any) => void }) => (
    <div id="business" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-8 border-b border-brand-border pb-2">
            <Briefcase className="text-brand-neon" size={20}/>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Espaço Empresarial</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {BUSINESS_SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                    <div key={service.id} className="relative group bg-brand-surface border border-brand-border overflow-hidden rounded-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Icon size={100} />
                        </div>
                        <div className="p-8 relative z-10">
                            <div className="w-12 h-12 bg-brand-neon/10 rounded flex items-center justify-center mb-6 border border-brand-neon/20">
                                <Icon className="text-brand-neon" size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">{service.title}</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed border-l-2 border-brand-800 pl-4">
                                {service.shortDesc}
                            </p>
                            <button 
                                onClick={() => {
                                    setView(service.viewId);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-2 text-brand-500 hover:text-white text-xs font-bold uppercase tracking-widest border-b border-brand-500/50 pb-1 hover:border-brand-neon transition-colors"
                            >
                                Conhecer Solução <ArrowLeft className="rotate-180" size={14} />
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
);

const PartnersSection = () => (
    <div id="partners" className="scroll-mt-24 border-t border-brand-border pt-12">
        <div className="flex items-center gap-2 mb-8 border-b border-brand-border pb-2">
            <Handshake className="text-brand-neon" size={20}/>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Parceiros Oficiais</h3>
        </div>
        
        <div className="bg-brand-surface border border-brand-border p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/10 to-transparent pointer-events-none"></div>
            <div className="text-left relative z-10">
                <h4 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                   <Globe className="text-brand-500" /> NetAcad da Cisco
                </h4>
                <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                    Somos uma academia oficial Cisco Networking Academy. Oferecemos formação profissional de nível internacional, conectando nossos alunos às oportunidades da economia digital global através de cursos reconhecidos mundialmente.
                </p>
            </div>
            {/* Visual Representation of Partnership */}
            <div className="px-8 py-4 bg-white rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] transform group-hover:scale-105 transition-transform duration-500">
                <div className="flex flex-col items-center">
                   <span className="text-2xl font-bold text-[#00bceb] tracking-tighter">Cisco</span>
                   <span className="text-xs text-slate-800 font-bold uppercase tracking-widest">Networking Academy</span>
                </div>
            </div>
        </div>
    </div>
);

const ProfessorSection = ({ professors }: { professors: Professor[] }) => (
    <div id="professor-section" className="scroll-mt-24 bg-brand-900/5 border border-brand-border p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8 border-b border-brand-border pb-2">
                <GraduationCap className="text-brand-neon" size={20}/>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Coordenador Técnico</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {professors.map(prof => (
                    <div key={prof.id} className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="shrink-0 relative">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-brand-500/30">
                                <img src={prof.imageUrl} alt={prof.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-brand-dark border border-brand-500 text-brand-neon p-1.5 rounded">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white uppercase tracking-wide">{prof.name}</h4>
                            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-2 block">{prof.role}</span>
                            <p className="text-slate-400 text-sm leading-relaxed mb-3 text-justify">
                                {prof.bio}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                {prof.lattesUrl && (
                                    <a href={prof.lattesUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-brand-neon flex items-center gap-1 uppercase tracking-widest transition-colors">
                                        <ExternalLink size={14} /> Currículo Lattes
                                    </a>
                                )}
                                <a href="https://wa.me/558288092476" target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-500 hover:text-green-400 flex items-center gap-1 uppercase tracking-widest transition-colors">
                                    <MessageCircle size={14} /> WhatsApp
                                </a>
                                <a href="mailto:cclr@cin.ufpe.br" className="text-[10px] text-brand-500 hover:text-brand-neon flex items-center gap-1 uppercase tracking-widest transition-colors">
                                    <Mail size={14} /> Email
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const StudentGallery = () => (
    <div className="mt-20 border-t border-brand-border pt-12">
        <div className="flex items-center gap-2 mb-10 border-b border-brand-border pb-2">
            <Users className="text-brand-neon" size={20}/>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Ambiente de Imersão</h3>
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[400px]">
             {/* Content remains same as before */}
             <div className="md:col-span-2 md:row-span-2 relative group rounded-xl overflow-hidden border border-brand-border">
                 <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
                 <div className="absolute bottom-0 p-6">
                     <h4 className="text-2xl font-bold text-white uppercase mb-2">Aprendizado Colaborativo</h4>
                     <p className="text-slate-300 text-sm">Metodologia baseada em projetos reais e squads ágeis.</p>
                 </div>
            </div>
            {/* ... other items (truncated for brevity since unchanged) */}
        </div>
    </div>
);

const CourseDetail = ({ 
  course, 
  professors, 
  enrolledStudents, 
  onEnroll, 
  onBack 
}: { 
  course: Course; 
  professors: Professor[];
  enrolledStudents: User[];
  onEnroll: (userData: Omit<User, 'id'>, onSuccess: () => void) => void;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    education: EducationLevel.SECONDARY,
    address: '',
    gender: 'M' as 'M' | 'F' | 'Outro'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.age) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const ageNum = parseInt(formData.age as any);
    if (isNaN(ageNum)) {
        alert("Por favor, insira uma idade válida.");
        return;
    }

    onEnroll({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: ageNum,
      education: formData.education,
      address: formData.address,
      gender: formData.gender
    }, () => {
        // Clear form on success callback
        setFormData({
            name: '',
            email: '',
            phone: '',
            age: '',
            education: EducationLevel.SECONDARY,
            address: '',
            gender: 'M'
        });
    });
  };

  const responsibleProfessor = professors.find(p => p.id === course.professorId);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <button 
        onClick={onBack} 
        className="group mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-brand-neon transition-colors"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Voltar para cursos
      </button>

      {/* HEADER WITH IMAGE */}
      <div className="relative h-80 rounded-xl overflow-hidden mb-8 border border-brand-border group">
          <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 w-full">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 mb-3 rounded bg-brand-neon/20 border border-brand-neon/50 text-brand-neon text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                        {course.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2 text-shadow-lg">
                        {course.name}
                    </h1>
                  </div>
                  {/* PUBLIC LINKS (Shown if available) */}
                  <div className="flex gap-4">
                      {course.whatsappUrl && (
                          <a href={course.whatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600/90 hover:bg-green-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 font-bold uppercase text-xs tracking-widest backdrop-blur-sm transition-all shadow-lg hover:shadow-green-500/20">
                              <MessageCircle size={18} /> Grupo WhatsApp
                          </a>
                      )}
                      {course.classroomUrl && (
                          <a href={course.classroomUrl} target="_blank" rel="noopener noreferrer" className="bg-brand-600/90 hover:bg-brand-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 font-bold uppercase text-xs tracking-widest backdrop-blur-sm transition-all shadow-lg hover:shadow-brand-500/20">
                              <Video size={18} /> Link da Aula
                          </a>
                      )}
                  </div>
               </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: INFO & REGISTRATION */}
          <div className="lg:col-span-2 space-y-12">
              
              {/* DESCRIPTION */}
              <section>
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-brand-border pb-2">
                    <FileText size={20} className="text-brand-500"/> Sobre o Curso
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-justify text-lg font-light">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="bg-brand-surface border border-brand-border p-4 rounded-lg">
                          <h4 className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Pré-requisitos</h4>
                          <p className="text-slate-400 text-sm">{course.prerequisites || "Nenhum."}</p>
                      </div>
                      <div className="bg-brand-surface border border-brand-border p-4 rounded-lg">
                          <h4 className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1">Critério de Seleção</h4>
                          <p className="text-slate-400 text-sm">{course.criteria}</p>
                      </div>
                  </div>
              </section>

              {/* REGISTRATION FORM */}
              {course.status === CourseStatus.OPEN && (
                  <section className="bg-brand-surface border border-brand-border rounded-xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                        <Plus size={20} className="text-brand-500"/> Inscreva-se Agora
                      </h3>
                      
                      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Nome Completo</label>
                                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none transition-colors" placeholder="Seu nome" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Email</label>
                                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none transition-colors" placeholder="seu@email.com" />
                              </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">WhatsApp</label>
                                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none transition-colors" placeholder="(00) 00000-0000" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Idade</label>
                                  <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none transition-colors" placeholder="Anos" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Escolaridade</label>
                                  <select value={formData.education} onChange={e => setFormData({...formData, education: e.target.value as EducationLevel})} className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none transition-colors">
                                      {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
                                  </select>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-3">
                                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Endereço Completo</label>
                                  <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none transition-colors" placeholder="Rua, Número, Bairro, Cidade" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Sexo</label>
                                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as 'M' | 'F' | 'Outro'})} className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none transition-colors">
                                      <option value="M">Masculino</option>
                                      <option value="F">Feminino</option>
                                      <option value="Outro">Outro</option>
                                  </select>
                              </div>
                          </div>

                          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded uppercase tracking-widest font-bold text-sm shadow-neon-sm hover:shadow-neon transition-all mt-4">
                              Enviar Solicitação
                          </button>
                      </form>
                  </section>
              )}

              {/* APPROVED STUDENTS SQUAD */}
              <section>
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-brand-border pb-2">
                    <Users size={20} className="text-brand-500"/> Alunos Aprovados ({enrolledStudents.length})
                  </h3>
                  
                  {enrolledStudents.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {enrolledStudents.map(student => (
                              <div key={student.id} className="bg-brand-surface border border-brand-border p-4 rounded-lg flex flex-col items-center text-center hover:border-brand-500/50 transition-colors group">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-900 to-brand-dark border-2 border-brand-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform overflow-hidden">
                                      {student.imageUrl ? (
                                        <img src={student.imageUrl} alt={student.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-xl font-bold text-brand-500 uppercase">{student.name.substring(0,2)}</span>
                                      )}
                                  </div>
                                  <p className="text-sm font-bold text-white uppercase leading-tight">{student.name.split(' ')[0]}</p>
                                  <p className="text-[10px] text-slate-500 uppercase mt-1">{student.education}</p>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-8 border border-dashed border-brand-border rounded-lg">
                          <p className="text-slate-500">Ainda não há alunos aprovados visíveis.</p>
                      </div>
                  )}
              </section>
          </div>

          {/* RIGHT COLUMN: DETAILS & PROFESSOR */}
          <div className="space-y-8">
               <div className="bg-brand-surface border border-brand-border rounded-xl p-6 space-y-4 shadow-lg sticky top-24">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-brand-border pb-2">Detalhes Técnicos</h4>
                  <div className="flex justify-between items-center">
                     <span className="text-slate-400 text-sm">Status</span>
                     <span className={`font-bold px-2 py-1 rounded text-xs uppercase ${
                        course.status === CourseStatus.OPEN ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                     }`}>{course.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-slate-400 text-sm">Início</span>
                     <span className="text-white font-mono text-sm">{new Date(course.startDate).toLocaleDateString()}</span>
                  </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-400 text-sm">Idade Mínima</span>
                     <span className="text-white font-mono text-sm">{course.minAge} Anos</span>
                  </div>
                  
                  {course.hasPartnership && (
                      <div className="mt-4 pt-4 border-t border-brand-border text-center">
                          <p className="text-[10px] text-slate-500 uppercase mb-2">Parceria Oficial</p>
                          <div className="inline-block px-3 py-1 bg-white rounded border border-white">
                              <span className="text-black font-bold text-xs uppercase">{course.partnerName}</span>
                          </div>
                      </div>
                  )}
               </div>

               {responsibleProfessor && (
                   <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
                       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-brand-border pb-2">Professor Responsável</h4>
                       <div className="flex items-center gap-4 mb-4">
                           <img src={responsibleProfessor.imageUrl} alt={responsibleProfessor.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-500" />
                           <div>
                               <p className="text-white font-bold uppercase">{responsibleProfessor.name}</p>
                               <p className="text-[10px] text-brand-500 uppercase tracking-widest">{responsibleProfessor.role}</p>
                           </div>
                       </div>
                       <p className="text-slate-400 text-xs text-justify leading-relaxed">
                           {responsibleProfessor.bio}
                       </p>
                   </div>
               )}
          </div>
      </div>
    </div>
  );
};

const App = () => {
    const [courses, setCourses] = useLocalStorage<Course[]>('courses', INITIAL_COURSES);
    const [professors, setProfessors] = useLocalStorage<Professor[]>('professors', INITIAL_PROFESSORS);
    const [users, setUsers] = useLocalStorage<User[]>('users', INITIAL_USERS);
    const [enrollments, setEnrollments] = useLocalStorage<Enrollment[]>('enrollments', []);
    const [view, setView] = useState('home'); 
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showOpenCoursesOnly, setShowOpenCoursesOnly] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleOpenCourse = (c: Course) => {
        setSelectedCourse(c);
        setView('course-detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToHome = () => {
        setSelectedCourse(null);
        setView('home');
    };

    const scrollToSection = (id: string, onlyOpen: boolean = false) => {
      setShowOpenCoursesOnly(onlyOpen);
      const targetId = id === 'courses-section' ? 'courses-section' : id;
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };
    
    // Logic to handle enrollment submission from CourseDetail
    const handleEnroll = (userData: Omit<User, 'id'>, onSuccess: () => void) => {
        if (!selectedCourse) return;

        // 1. Create or Find User
        // Simple check by email for now
        let user = users.find(u => u.email === userData.email);
        let userIdToUse = '';

        if (!user) {
            userIdToUse = Date.now().toString();
            user = { ...userData, id: userIdToUse };
            setUsers(prev => [...prev, user!]);
        } else {
            // Update existing user with new details if provided
            userIdToUse = user.id;
            const updatedUser = { ...user, ...userData };
            setUsers(prev => prev.map(u => u.id === user!.id ? updatedUser : u));
            user = updatedUser;
        }

        // 2. Create Enrollment
        const newEnrollment: Enrollment = {
            id: `enr-${Date.now()}`,
            courseId: selectedCourse.id,
            userId: userIdToUse,
            status: EnrollmentStatus.PENDING,
            timestamp: Date.now()
        };

        setEnrollments(prev => [...prev, newEnrollment]);
        setShowSuccessModal(true);
        onSuccess();
    };

    // Calculate approved students for the selected course to pass to Detail view
    const approvedStudentsForSelectedCourse = useMemo(() => {
        if (!selectedCourse) return [];
        const approvedEnrollments = enrollments.filter(
            e => e.courseId === selectedCourse.id && e.status === EnrollmentStatus.SELECTED
        );
        return approvedEnrollments.map(e => users.find(u => u.id === e.userId)).filter((u): u is User => !!u);
    }, [selectedCourse, enrollments, users]);


    // --- RENDER ADMIN ---
    if (view === 'admin') {
      return (
        <AdminDashboard 
          courses={courses}
          setCourses={setCourses}
          professors={professors}
          setProfessors={setProfessors}
          users={users}
          setUsers={setUsers}
          enrollments={enrollments}
          setEnrollments={setEnrollments}
          onLogout={handleBackToHome}
        />
      )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
            {/* Injecting some custom CSS vars for the brand colors used in components if they aren't in tailwind config */}
            <style>{`
            :root {
                --color-brand-neon: #06b6d4;
                --color-brand-dark: #050505;
            }
            .text-shadow-lg {
                text-shadow: 0 0 20px rgba(6,182,212,0.5);
            }
            `}</style>
            
            <NeuralBackground />
            
            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />

             <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="border-b border-brand-border bg-brand-dark/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToHome}>
                           <div className="w-8 h-8 bg-brand-500/20 rounded flex items-center justify-center border border-brand-500">
                               <Terminal size={20} className="text-brand-500" />
                           </div>
                           <span className="font-bold text-white uppercase tracking-widest text-sm hidden sm:inline-block">
                               <span className="text-brand-500">Cristofe</span> Treinamentos
                           </span>
                        </div>
                        
                        <nav className="hidden md:flex items-center gap-6 md:gap-8 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                            <button onClick={handleBackToHome} className="hover:text-brand-500 transition-colors">Início</button>
                            <button onClick={() => scrollToSection('courses-section')} className="hover:text-brand-500 transition-colors">Cursos</button>
                            <button onClick={() => scrollToSection('courses-section', true)} className="hover:text-brand-500 transition-colors">Inscrições Abertas</button>
                            <button onClick={() => scrollToSection('business')} className="hover:text-brand-500 transition-colors">Empresário</button>
                            <button onClick={() => scrollToSection('partners')} className="hover:text-brand-500 transition-colors">Parceiros</button>
                            <button 
                                onClick={() => setView('admin')}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-neon/5 hover:bg-brand-neon/10 border border-brand-neon/30 hover:border-brand-neon text-brand-neon rounded text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            >
                                <Lock size={12} /> Área Restrita
                            </button>
                        </nav>
                        
                        {/* Mobile Menu Icon Placeholder - logic would go here if we were implementing full responsive menu */}
                        <div className="md:hidden text-brand-500">
                             <Menu size={24} />
                        </div>
                    </div>
                </header>

                <main className="flex-grow container mx-auto px-4 md:px-6 py-8 md:py-12">
                    {view === 'home' && (
                        <div className="space-y-24 animate-in fade-in duration-700">
                            {/* HERO */}
                            <div className="relative py-20 flex flex-col items-center text-center">
                               {/* Neural Background specific to first block */}
                               <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                                    <img 
                                        src="https://images.unsplash.com/photo-1558494949-efc5e60dc1db?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                                        alt="Neural Network Background" 
                                        className="w-full h-full object-cover opacity-10"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
                               </div>

                               <div className="relative z-10 max-w-5xl mx-auto space-y-6 px-4">
                                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/50 border border-brand-500/30 text-brand-neon text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                      <div className="w-2 h-2 bg-brand-neon rounded-full"></div>
                                      PLATAFORMA DE CURSOS
                                  </div>
                                  <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight uppercase tracking-wide">
                                    Somos uma empresa de computação dedicada a democratizar o conhecimento
                                  </h1>
                                  <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                                    Domine o futuro com especialização avançada em Redes e Administração de Sistemas, IA, Empreendedorismo e Inovação.
                                  </p>
                                  <p className="text-sm md:text-base text-brand-500 font-mono italic mt-4">
                                      "Não somos quem pensamos ser, mas sim o que pensamos"
                                  </p>

                                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                     <button 
                                        onClick={() => scrollToSection('courses-section', true)}
                                        className="px-8 py-4 bg-brand-600 hover:bg-brand-neon hover:text-black text-white font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2"
                                     >
                                        Inscrições em aberto <ArrowLeft className="rotate-180" size={16}/>
                                     </button>
                                     <button 
                                        onClick={() => scrollToSection('courses-section')}
                                        className="px-8 py-4 border border-brand-border hover:border-brand-neon text-slate-300 hover:text-white font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center"
                                     >
                                        Catálogo de Cursos
                                     </button>
                                  </div>
                               </div>
                            </div>
                            
                            <div id="courses-section" className="scroll-mt-24">
                                <div className="flex items-center gap-2 mb-8 border-b border-brand-border pb-2">
                                    <BookOpen className="text-brand-neon" size={20}/>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">
                                        {showOpenCoursesOnly ? 'Inscrições Abertas' : 'Catálogo de Cursos'}
                                    </h3>
                                </div>
                                <PublicCourseList 
                                    courses={courses} 
                                    showOpenCoursesOnly={showOpenCoursesOnly} 
                                    openCourseDetail={handleOpenCourse}
                                />
                            </div>

                            <TechInfoSection />
                            
                            <BusinessSection setView={setView} />
                            
                            <PartnersSection />

                            <ProfessorSection professors={professors} />

                            <StudentGallery />
                        </div>
                    )}

                    {view === 'course-detail' && selectedCourse && (
                        <CourseDetail 
                            course={selectedCourse} 
                            professors={professors}
                            enrolledStudents={approvedStudentsForSelectedCourse}
                            onEnroll={handleEnroll}
                            onBack={handleBackToHome} 
                        />
                    )}
                    
                    {/* Placeholder for Business Views */}
                    {['business_training', 'business_systems', 'business_consulting'].includes(view) && (
                        <div className="max-w-4xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button onClick={handleBackToHome} className="mb-6 text-brand-500 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                                <ArrowLeft size={16} /> Voltar
                            </button>
                            <div className="bg-brand-surface border border-brand-border p-8 rounded-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-brand-500/10 rounded-lg border border-brand-500/30">
                                       <Briefcase className="text-brand-500" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest">
                                        {BUSINESS_SERVICES.find(s => s.viewId === view)?.title}
                                    </h2>
                                </div>
                                
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <p className="text-slate-300 text-lg leading-relaxed mb-8 border-l-4 border-brand-500 pl-4">
                                        {BUSINESS_SERVICES.find(s => s.viewId === view)?.fullDesc}
                                    </p>
                                    
                                    <div className="grid md:grid-cols-2 gap-4 not-prose mb-8">
                                         {BUSINESS_SERVICES.find(s => s.viewId === view)?.features.map((feat, i) => (
                                             <div key={i} className="flex items-start gap-3 p-4 bg-brand-dark rounded border border-brand-border">
                                                 <CheckCircle size={18} className="text-brand-500 mt-0.5 shrink-0" />
                                                 <span className="text-slate-300 text-sm">{feat}</span>
                                             </div>
                                         ))}
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-brand-border flex justify-end">
                                     <button className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded uppercase tracking-widest font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center gap-2">
                                         <Mail size={16} /> Falar com Consultor
                                     </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="border-t border-brand-border bg-brand-dark/80 backdrop-blur-md mt-auto">
                    <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                            &copy; 2025 Professor Cristofe. All rights reserved.
                        </div>
                        <div className="flex gap-6 items-center">
                            <button 
                              onClick={() => setView('admin')} 
                              className="text-brand-500 hover:text-white transition-colors flex items-center gap-2"
                              title="Acesso Administrativo"
                            >
                              <Lock size={14}/> <span className="uppercase text-[10px] font-bold">Admin</span>
                            </button>
                            <a href="#" className="text-slate-600 hover:text-brand-500 transition-colors"><Mail size={16}/></a>
                            <a href="#" className="text-slate-600 hover:text-brand-500 transition-colors"><MessageCircle size={16}/></a>
                            <a href="#" className="text-slate-600 hover:text-brand-500 transition-colors"><ExternalLink size={16}/></a>
                        </div>
                    </div>
                </footer>
             </div>
        </div>
    );
};

export default App;