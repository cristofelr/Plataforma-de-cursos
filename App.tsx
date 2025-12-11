
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
  Save
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

const INITIAL_COURSES: Course[] = [
  // --- REDES DE COMPUTADORES ---
  {
    id: 'net-1',
    name: 'Networking Essentials',
    description: 'Aprenda os conceitos fundamentais de redes e como os dispositivos se comunicam. Ideal para iniciantes.',
    startDate: '2024-09-01',
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
    startDate: '2024-09-15',
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
    startDate: '2024-10-01',
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
    startDate: '2024-10-15',
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
    startDate: '2024-09-05',
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
    startDate: '2024-09-20',
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
    startDate: '2024-11-01',
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
    startDate: '2024-09-10',
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
    startDate: '2024-09-25',
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
    startDate: '2024-10-10',
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
    startDate: '2024-09-01',
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
    startDate: '2024-09-15',
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
    startDate: '2024-10-05',
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
    startDate: '2024-09-08',
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
    startDate: '2024-10-20',
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
    const numParticles = 100; // Increased density for better "connected" feel
    const connectionDistance = 200; // Increased distance to ensure points connect

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
            // Increased opacity and width for better visibility
            ctx.strokeStyle = `rgba(192, 192, 192, ${1.0 - distance / connectionDistance})`; // Silver, stronger opacity
            ctx.lineWidth = 1.5; // Thicker lines
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

const PublicCourseList = ({ 
  courses, 
  showOpenCoursesOnly, 
  openCourseDetail 
}: { 
  courses: Course[], 
  showOpenCoursesOnly: boolean, 
  openCourseDetail: (c: Course) => void 
}) => {
  // Logic to sort/filter courses.
  
  const sortedCourses = useMemo(() => {
      let filtered = courses;

      // If viewing "Inscrições Abertas", strictly show only OPEN courses.
      // If viewing "Cursos", show all courses (Open, Closed, In Progress) but sort accordingly.
      if (showOpenCoursesOnly) {
          filtered = courses.filter(c => c.status === CourseStatus.OPEN);
      }
      
      // Sort: OPEN courses first, then IN_PROGRESS, then CLOSED
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
        <p className="text-slate-500 font-mono">Nenhum curso disponível com os filtros atuais.</p>
        {showOpenCoursesOnly && (
           <p className="text-xs text-brand-500 mt-2">Tente visualizar todos os cursos.</p>
        )}
      </div>
    )
  }

  return (
    <div id="courses" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-mt-24">
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
                       {/* Show status tag only if NOT closed, or if actively open/in_progress */}
                       {course.status !== CourseStatus.CLOSED ? (
                           <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded ${
                                course.status === CourseStatus.OPEN ? 'border-green-500 text-green-400 bg-green-500/10' : 
                                'border-yellow-500 text-yellow-400 bg-yellow-500/10'
                            }`}>
                                {course.status === CourseStatus.OPEN ? '● Inscrições Abertas' : course.status.toUpperCase()}
                            </span>
                       ) : (
                           <div></div> /* Empty placeholder to keep layout if needed, or justify-between handles it */
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
                icon: ShieldCheck, 
                title: "Cibersegurança", 
                desc: "Proteção de dados, CyberOps e defesa de redes.",
                img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
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
                            {prof.lattesUrl && (
                                <a href={prof.lattesUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-brand-neon flex items-center gap-1 uppercase tracking-widest">
                                    <ExternalLink size={10} /> Currículo Lattes
                                </a>
                            )}
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
            {/* Large Feature Item */}
            <div className="md:col-span-2 md:row-span-2 relative group rounded-xl overflow-hidden border border-brand-border">
                 <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
                 <div className="absolute bottom-0 p-6">
                     <h4 className="text-2xl font-bold text-white uppercase mb-2">Aprendizado Colaborativo</h4>
                     <p className="text-slate-300 text-sm">Metodologia baseada em projetos reais e squads ágeis.</p>
                 </div>
            </div>

            {/* Top Right Text Block */}
            <div className="bg-brand-surface p-6 border border-brand-border rounded-xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-neon/5 rounded-full blur-2xl"></div>
                <h4 className="text-brand-neon font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Cpu size={16}/> Laboratórios de Alta Performance</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                    Infraestrutura equipada com servidores de última geração para simulação de cenários complexos de redes e IA.
                </p>
            </div>

            {/* Top Right Image */}
            <div className="relative group rounded-xl overflow-hidden border border-brand-border">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Lab" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500" />
                 <div className="absolute bottom-0 left-0 p-3 w-full bg-black/60 backdrop-blur-sm">
                    <p className="text-white text-[10px] font-bold uppercase">CyberOps Center</p>
                </div>
            </div>

            {/* Bottom Right Image */}
            <div className="relative group rounded-xl overflow-hidden border border-brand-border">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="IoT" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500" />
                 <div className="absolute bottom-0 left-0 p-3 w-full bg-black/60 backdrop-blur-sm">
                    <p className="text-white text-[10px] font-bold uppercase">IoT Prototyping</p>
                </div>
            </div>

            {/* Bottom Right Text Block */}
            <div className="bg-brand-900/20 p-6 border border-brand-border rounded-xl flex flex-col justify-center">
                 <h4 className="text-white font-bold uppercase tracking-widest mb-2 text-sm">Internet das Coisas - IoT</h4>
                 <p className="text-slate-400 text-xs leading-relaxed">
                    Infraestrutura de conectividade, protocolos de longo alcance e Baixo consumo de energia. Aprenda mais sobre as redes LPWAN.
                 </p>
            </div>
        </div>
    </div>
);

// --- MAIN APP ---

export default function App() {
  // Global State
  const [view, setView] = useState<'home' | 'admin' | 'simple_enroll' | 'course_detail' | 'business_training' | 'business_systems' | 'business_consulting'>('home');
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', INITIAL_COURSES);
  const [professors, setProfessors] = useLocalStorage<Professor[]>('professors', INITIAL_PROFESSORS);
  const [enrollments, setEnrollments] = useLocalStorage<Enrollment[]>('enrollments', []);
  const [users, setUsers] = useLocalStorage<User[]>('allUsers', []);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);
  
  // Filter State
  const [showOpenCoursesOnly, setShowOpenCoursesOnly] = useState(false);

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState<Course | null>(null);
  const [isEditingProfessor, setIsEditingProfessor] = useState<Professor | null>(null);
  const [isEditingUser, setIsEditingUser] = useState<User | null>(null);
  const [adminTab, setAdminTab] = useState<'courses' | 'selection' | 'professors' | 'users'>('courses');
  const [selectedCourseIdForSelection, setSelectedCourseIdForSelection] = useState<string>('');

  // --- ACTIONS ---

  const handleAdminAuth = (u: string, p: string) => {
      if ((u === 'admin' || u === 'administrador') && (p === '9999560' || p === '99956060')) {
          setIsAdminLoggedIn(true);
          setShowAdminLogin(false);
          setView('admin');
      } else {
          alert("Acesso Negado: Credenciais Inválidas.");
      }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setView('home');
  };

  const handleToggleAdmin = () => {
      if (view === 'admin') {
          setView('home');
      } else {
          if (isAdminLoggedIn) {
              setView('admin');
          } else {
              setShowAdminLogin(true);
          }
      }
  };

  const handleSimpleEnrollment = (formData: { name: string, email: string, phone: string, education: EducationLevel }) => {
    if (!pendingCourseId) return;

    let userId = '';
    let userToEnroll = users.find(u => u.email === formData.email);

    if (userToEnroll) {
      userId = userToEnroll.id;
      // Update with new education level if provided, preserving other fields
      const updatedUser = { ...userToEnroll, education: formData.education };
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      userToEnroll = updatedUser;
    } else {
      userId = Date.now().toString();
      userToEnroll = {
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        education: formData.education
      };
      setUsers([...users, userToEnroll]);
    }

    // Set current user for session (so they see the enrolled status)
    setCurrentUser(userToEnroll);

    // Create Enrollment
    const alreadyEnrolled = enrollments.some(e => e.userId === userId && e.courseId === pendingCourseId);
    if (!alreadyEnrolled) {
      const newEnrollment: Enrollment = {
        id: Date.now().toString(),
        userId: userId,
        courseId: pendingCourseId,
        status: EnrollmentStatus.PENDING,
        timestamp: Date.now()
      };
      setEnrollments([...enrollments, newEnrollment]);
      alert("SUCESSO: Inscrição confirmada no curso!");
    } else {
      alert("AVISO: Você já está inscrito neste curso.");
    }

    // Reset and go home
    setPendingCourseId(null);
    setView('home');
  };

  const handleEnroll = (courseId: string) => {
    // If user is already "logged in", just enroll
    if (currentUser) {
      const alreadyEnrolled = enrollments.some(e => e.userId === currentUser.id && e.courseId === courseId);
      if (alreadyEnrolled) {
        alert("AVISO: Usuário já cadastrado neste protocolo.");
        return;
      }
      const newEnrollment: Enrollment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        courseId,
        status: EnrollmentStatus.PENDING,
        timestamp: Date.now()
      };
      setEnrollments([...enrollments, newEnrollment]);
      alert("SUCESSO: Inscrição registrada.");
    } else {
      // If not logged in, show the simplified form
      setPendingCourseId(courseId);
      setView('simple_enroll');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveCourse = (course: Course) => {
    if (courses.some(c => c.id === course.id)) {
      setCourses(courses.map(c => c.id === course.id ? course : c));
    } else {
      setCourses([...courses, course]);
    }
    setIsEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('CONFIRMAÇÃO: Deletar este curso do sistema?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSaveProfessor = (professor: Professor) => {
    if (professors.some(p => p.id === professor.id)) {
      setProfessors(professors.map(p => p.id === professor.id ? professor : p));
    } else {
      setProfessors([...professors, professor]);
    }
    setIsEditingProfessor(null);
  };

  const handleDeleteProfessor = (id: string) => {
    const isAssigned = courses.some(c => c.professorId === id);
    if (isAssigned) {
      alert("ERRO: Não é possível deletar professor vinculado a cursos ativos.");
      return;
    }
    if (confirm('CONFIRMAÇÃO: Remover este professor do corpo docente?')) {
      setProfessors(professors.filter(p => p.id !== id));
    }
  };

  const handleSaveUser = (user: User) => {
      setUsers(users.map(u => u.id === user.id ? user : u));
      setIsEditingUser(null);
  }

  const handleDeleteUser = (id: string) => {
      if(confirm('CONFIRMAÇÃO CRÍTICA: Deletar este usuário? Todas as inscrições serão perdidas.')) {
          setUsers(users.filter(u => u.id !== id));
          setEnrollments(enrollments.filter(e => e.userId !== id));
      }
  }

  const handleUpdateEnrollmentStatus = (enrollmentId: string, status: EnrollmentStatus) => {
    setEnrollments(enrollments.map(e => e.id === enrollmentId ? { ...e, status } : e));
  };

  const scrollToSection = (id: string, onlyOpen: boolean = false) => {
      if (view !== 'home') setView('home');
      setShowOpenCoursesOnly(onlyOpen);
      setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  };

  const openCourseDetail = (course: Course) => {
    setSelectedCourseDetail(course);
    setView('course_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- HELPERS ---

  const getFilteredEnrollments = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return [];

    const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
    
    return courseEnrollments.sort((a, b) => {
      const userA = users.find(u => u.id === a.userId);
      const userB = users.find(u => u.id === b.userId);

      if (!userA || !userB) return 0;

      // Handle missing optional fields safely
      const ageA = userA.age || 0;
      const ageB = userB.age || 0;
      const eduA = userA.education || EducationLevel.SECONDARY; // Default assumption
      const eduB = userB.education || EducationLevel.SECONDARY;

      switch (course.criteria) {
        case SelectionCriteria.AGE_DESC:
          return ageB - ageA; // Older first
        case SelectionCriteria.AGE_ASC:
          return ageA - ageB; // Younger first
        case SelectionCriteria.EDUCATION_HIGH:
          const eduMap = {
            [EducationLevel.PRIMARY]: 1,
            [EducationLevel.SECONDARY]: 2,
            [EducationLevel.HIGHER]: 3,
            [EducationLevel.POSTGRAD]: 4
          };
          return eduMap[eduB] - eduMap[eduA];
        case SelectionCriteria.FIRST_COME:
          return a.timestamp - b.timestamp;
        default:
          return 0;
      }
    });
  };

  // --- VIEWS ---

  const AdminLoginModal = () => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');

      return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
             <div className="bg-brand-surface border border-brand-neon/50 p-8 max-w-sm w-full relative shadow-[0_0_50px_rgba(0,240,255,0.1)]">
                 <div className="absolute top-0 left-0 w-full h-1 bg-brand-neon"></div>
                 <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                     <Lock className="text-brand-neon" /> Acesso Restrito
                 </h2>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-brand-500 mb-1">ID ADMINISTRADOR</label>
                         <input 
                            type="text" 
                            className="w-full bg-brand-dark border border-brand-border p-2 text-white font-mono focus:border-brand-neon outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-brand-500 mb-1">CHAVE DE ACESSO</label>
                         <input 
                            type="password" 
                            className="w-full bg-brand-dark border border-brand-border p-2 text-white font-mono focus:border-brand-neon outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                         />
                     </div>
                     <div className="flex gap-2 pt-4">
                         <button onClick={() => setShowAdminLogin(false)} className="flex-1 py-2 border border-brand-border text-slate-400 text-xs font-bold uppercase hover:text-white transition">Cancelar</button>
                         <button onClick={() => handleAdminAuth(username, password)} className="flex-1 py-2 bg-brand-600 text-white text-xs font-bold uppercase hover:bg-brand-neon hover:text-black transition shadow-[0_0_15px_rgba(6,182,212,0.3)]">Autenticar</button>
                     </div>
                 </div>
             </div>
        </div>
      )
  }

  const BusinessServiceView = ({ serviceId }: { serviceId: string }) => {
      const service = BUSINESS_SERVICES.find(s => s.viewId === serviceId);
      if (!service) return null;

      const Icon = service.icon;

      return (
          <div className="animate-fade-in space-y-8 mt-8 pb-20">
              <button 
                  onClick={() => setView('home')} 
                  className="flex items-center gap-2 text-brand-500 hover:text-white transition uppercase tracking-widest text-xs font-bold"
              >
                  <ArrowLeft size={16} /> Voltar para o Início
              </button>

              <div className="relative rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center border border-brand-border bg-brand-dark/50">
                  <div className="absolute inset-0">
                      <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover opacity-30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
                  </div>
                  <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                      <div className="w-20 h-20 bg-brand-neon/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-neon/30">
                          <Icon className="text-brand-neon" size={40} />
                      </div>
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-wider">
                          {service.title}
                      </h1>
                      <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                          {service.shortDesc}
                      </p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-8">
                      <div className="bg-brand-surface border border-brand-border p-8 rounded-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-neon to-transparent"></div>
                          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                              <Rocket className="text-brand-500" /> Detalhes do Serviço
                          </h2>
                          <p className="text-slate-300 leading-relaxed text-lg text-justify">
                              {service.fullDesc}
                          </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {service.features.map((feature, idx) => (
                               <div key={idx} className="bg-brand-dark border border-brand-border p-4 flex items-start gap-3 rounded hover:border-brand-neon/50 transition duration-300">
                                   <CheckCircle className="text-brand-neon shrink-0 mt-1" size={18} />
                                   <span className="text-slate-300 font-medium">{feature}</span>
                               </div>
                           ))}
                      </div>
                  </div>

                  <div className="md:col-span-1">
                      <div className="bg-brand-surface border border-brand-border p-6 rounded-lg sticky top-24">
                          <h3 className="text-white font-bold uppercase tracking-widest mb-6 border-b border-brand-border pb-4">
                              Entre em Contato
                          </h3>
                          <p className="text-slate-400 text-sm mb-6">
                              Interessado nesta solução para sua empresa? Nossa equipe de especialistas está pronta para desenhar o projeto ideal.
                          </p>
                          <button 
                             onClick={() => alert("Solicitação de contato enviada! Nossa equipe comercial entrará em contato em breve.")}
                             className="w-full bg-brand-600 hover:bg-brand-neon hover:text-black text-white py-3 font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] mb-4"
                          >
                              Solicitar Proposta
                          </button>
                          <div className="text-center text-slate-500 text-xs font-mono">
                              <p className="mb-2">Ou fale diretamente:</p>
                              <p className="text-brand-400">comercial@cristofe.com.br</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )
  }

  const CourseDetailView = () => {
    if (!selectedCourseDetail) return null;
    const assignedProfessor = professors.find(p => p.id === selectedCourseDetail.professorId);
    
    // Check if enrolled
    const isEnrolled = currentUser && enrollments.some(e => e.userId === currentUser.id && e.courseId === selectedCourseDetail.id);

    // Get Approved Students for this course
    const approvedEnrollments = enrollments.filter(e => e.courseId === selectedCourseDetail.id && e.status === EnrollmentStatus.SELECTED);

    return (
      <div className="animate-fade-in space-y-8 mt-8">
        <button 
          onClick={() => setView('home')} 
          className="flex items-center gap-2 text-brand-500 hover:text-white transition uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Voltar para o Início
        </button>

        <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden relative">
          <div className="h-64 md:h-96 w-full relative">
             <img 
               src={selectedCourseDetail.imageUrl} 
               alt={selectedCourseDetail.name} 
               className="w-full h-full object-cover opacity-50"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/50 to-transparent"></div>
             <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex gap-2 mb-4">
                             <span className="inline-block px-3 py-1 bg-brand-neon text-black text-xs font-bold uppercase tracking-widest">
                                {selectedCourseDetail.category}
                            </span>
                            {selectedCourseDetail.hasPartnership && selectedCourseDetail.partnerName && (
                                <span className="inline-block px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-widest">
                                    {selectedCourseDetail.partnerName}
                                </span>
                            )}
                        </div>
                       
                        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wide mb-2">
                        {selectedCourseDetail.name}
                        </h1>
                        <div className="flex items-center gap-4 text-slate-300 font-mono text-sm">
                            <span className="flex items-center gap-2"><Calendar size={16} className="text-brand-600"/> Início: {new Date(selectedCourseDetail.startDate).toLocaleDateString('pt-BR')}</span>
                            {selectedCourseDetail.minAge && <span className="flex items-center gap-2"><Users size={16} className="text-brand-600"/> Idade Mínima: {selectedCourseDetail.minAge} Anos</span>}
                        </div>
                    </div>
                </div>
             </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="md:col-span-2 space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Terminal size={20} className="text-brand-neon" /> Sobre o Curso
                   </h3>
                   <p className="text-slate-400 leading-relaxed text-lg">
                      {selectedCourseDetail.description}
                   </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-brand-neon" /> Pré-requisitos
                   </h3>
                   <div className="bg-brand-dark border-l-4 border-brand-600 p-4">
                      <p className="text-slate-400 font-mono">
                         {selectedCourseDetail.prerequisites || 'Nenhum pré-requisito específico listado.'}
                      </p>
                   </div>
                </div>

                {/* APPROVED STUDENTS LIST */}
                {approvedEnrollments.length > 0 && (
                    <div className="bg-brand-900/10 border border-brand-border p-6 rounded-lg mt-8">
                        <div className="flex items-center gap-2 mb-6 border-b border-brand-border pb-2">
                            <CheckCircle className="text-brand-neon" size={20} />
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest">Alunos Selecionados</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {approvedEnrollments.map(enrollment => {
                                const student = users.find(u => u.id === enrollment.userId);
                                return student ? (
                                    <div key={enrollment.id} className="bg-brand-dark p-3 rounded flex items-center gap-3 border border-brand-border/50">
                                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-neon font-bold text-xs">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm uppercase">{student.name}</p>
                                            <p className="text-slate-500 text-[10px] font-mono">Aprovado em: {new Date(enrollment.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}


                {assignedProfessor && (
                    <div className="bg-brand-900/20 border border-brand-border p-6 rounded-lg">
                        <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <GraduationCap size={20} className="text-brand-neon" /> Docente Responsável
                        </h3>
                        <div className="flex gap-4 items-start">
                            <img src={assignedProfessor.imageUrl} alt={assignedProfessor.name} className="w-16 h-16 object-cover rounded border border-brand-500" />
                            <div>
                                <h4 className="text-white font-bold text-lg">{assignedProfessor.name}</h4>
                                <p className="text-brand-500 text-xs uppercase tracking-wider mb-2">{assignedProfessor.role}</p>
                                <p className="text-slate-400 text-sm">{assignedProfessor.bio}</p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedCourseDetail.hasPartnership && (
                    <div className="bg-brand-900/20 border border-brand-500/20 p-6 rounded-lg flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full">
                        <Network className="text-brand-neon" size={24} />
                        </div>
                        <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-2">Parceria {selectedCourseDetail.partnerName || 'Oficial'}</h4>
                        <p className="text-slate-400 text-sm mb-3">
                            Este curso utiliza material oficial e metodologia de nossos parceiros de tecnologia.
                        </p>
                        </div>
                    </div>
                )}
             </div>

             <div className="md:col-span-1">
                <div className="bg-brand-dark p-6 border border-brand-border sticky top-24">
                   <h4 className="text-white font-bold uppercase tracking-widest mb-6 border-b border-brand-border pb-2">Detalhes da Inscrição</h4>
                   
                   <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Status:</span>
                         <span className={`font-bold ${
                            selectedCourseDetail.status === CourseStatus.OPEN ? 'text-green-500' : 
                            selectedCourseDetail.status === CourseStatus.IN_PROGRESS ? 'text-yellow-500' :
                            'text-red-500'
                         }`}>
                             {selectedCourseDetail.status.toUpperCase()}
                         </span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-500">Critério:</span>
                         <span className="text-white text-right max-w-[150px]">{selectedCourseDetail.criteria}</span>
                      </div>
                   </div>

                   {isEnrolled ? (
                      <div className="w-full bg-brand-900/50 border border-brand-neon text-brand-neon py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                          <CheckCircle size={18} /> Inscrição Confirmada
                      </div>
                   ) : (
                      <button 
                          onClick={() => handleEnroll(selectedCourseDetail.id)}
                          disabled={selectedCourseDetail.status !== CourseStatus.OPEN}
                          className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                          <BookOpen size={18} />
                          {selectedCourseDetail.status === CourseStatus.OPEN ? 'Inscrever-se Agora' : 'Inscrições Fechadas'}
                      </button>
                   )}
                   
                   {selectedCourseDetail.whatsappUrl && (
                       <a 
                          href={selectedCourseDetail.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white py-4 font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-2"
                       >
                          <MessageCircle size={18} />
                          Grupo WhatsApp
                       </a>
                   )}

                   {selectedCourseDetail.classroomUrl && (
                       <a 
                          href={selectedCourseDetail.classroomUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-2 bg-yellow-600 hover:bg-yellow-500 text-white py-4 font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all flex items-center justify-center gap-2"
                       >
                          <Presentation size={18} />
                          Google Classroom
                       </a>
                   )}

                   <p className="text-center mt-4 text-[10px] text-slate-600 uppercase">
                      Vagas limitadas. Sujeito a aprovação.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const SimpleEnrollmentForm = () => {
    const [formData, setFormData] = useState<{
      name: string;
      email: string;
      phone: string;
      education: EducationLevel;
    }>({
      name: '',
      email: '',
      phone: '',
      education: EducationLevel.SECONDARY // Default
    });
    
    const course = courses.find(c => c.id === pendingCourseId);
    
    const inputClass = "mt-1 block w-full bg-brand-dark border-brand-border border p-3 text-brand-neon font-mono focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all placeholder:text-slate-700";
    const labelClass = "block text-xs font-bold text-brand-500 uppercase tracking-widest mb-1";

    return (
      <div className="max-w-md mx-auto bg-brand-surface p-8 border border-brand-border relative overflow-hidden group mt-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-neon to-transparent"></div>
        <div className="flex justify-between items-center mb-8 border-b border-brand-border pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 uppercase tracking-widest">
            <BookOpen className="text-brand-neon" /> Inscrição Simplificada
            </h2>
        </div>
        
        {course && (
          <div className="mb-6 p-4 bg-brand-900/30 border border-brand-border rounded">
             <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Você está se inscrevendo em:</p>
             <h3 className="text-white font-bold text-lg">{course.name}</h3>
          </div>
        )}
        
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSimpleEnrollment(formData);
        }} className="space-y-6">
          
          <div>
            <label className={labelClass}>Nome Completo</label>
            <input required type="text" className={inputClass}
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="SEU NOME" />
          </div>
          
          <div>
            <label className={labelClass}>WhatsApp / Celular</label>
            <div className="relative">
                <input required type="tel" className={`${inputClass} pl-10`}
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="00 00000-0000" />
                <Phone className="absolute left-3 top-3.5 text-brand-600 h-5 w-5" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
                <input required type="email" className={`${inputClass} pl-10 border-l-4 border-l-brand-600`}
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="USUARIO@EMAIL.COM" />
                <Mail className="absolute left-3 top-3.5 text-brand-600 h-5 w-5" />
            </div>
          </div>

          <div>
              <label className={labelClass}>Escolaridade</label>
              <select 
                  required 
                  className={inputClass}
                  value={formData.education} 
                  onChange={e => setFormData({...formData, education: e.target.value as EducationLevel})}
              >
                  {Object.values(EducationLevel).map(level => (
                      <option key={level} value={level}>{level}</option>
                  ))}
              </select>
          </div>
          
          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-neon hover:text-black text-white py-4 px-4 transition-all duration-300 font-bold uppercase tracking-widest text-sm border border-brand-500 mt-4 relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="relative z-10 flex items-center justify-center gap-2"><CheckCircle size={16}/> Confirmar Inscrição</span>
          </button>

          <p className="text-[10px] text-slate-500 text-center font-mono mt-4">
            Ao confirmar, seus dados serão registrados e vinculados ao curso selecionado.
          </p>
        </form>
      </div>
    );
  };

  const AdminPanel = () => {
    // Course Form State
    const [courseForm, setCourseForm] = useState<Course>(isEditingCourse || {
      id: Date.now().toString(),
      name: '',
      description: '',
      startDate: '',
      status: CourseStatus.OPEN,
      criteria: SelectionCriteria.FIRST_COME,
      imageUrl: 'https://picsum.photos/400/200',
      category: COURSE_CATEGORIES[0],
      minAge: 16,
      prerequisites: '',
      professorId: '',
      hasPartnership: false,
      partnerName: '',
      whatsappUrl: '',
      classroomUrl: ''
    });

    // Professor Form State
    const [profForm, setProfForm] = useState<Professor>(isEditingProfessor || {
        id: Date.now().toString(),
        name: '',
        role: '',
        bio: '',
        imageUrl: 'https://picsum.photos/200/200',
        lattesUrl: ''
    });

    // User Edit Form State
    const [userForm, setUserForm] = useState<User>(isEditingUser || {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        education: EducationLevel.SECONDARY,
        age: 18,
        gender: 'M'
    });

    useEffect(() => {
        if(isEditingCourse) setCourseForm(isEditingCourse);
    }, [isEditingCourse]);

    useEffect(() => {
        if(isEditingProfessor) setProfForm(isEditingProfessor);
    }, [isEditingProfessor]);

    useEffect(() => {
        if(isEditingUser) setUserForm(isEditingUser);
    }, [isEditingUser]);

    const inputClass = "w-full bg-brand-dark border-brand-border border p-2 text-slate-200 focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition outline-none";
    const labelClass = "block text-xs font-bold text-brand-500 uppercase tracking-wider mb-1";

    const handleExportCSV = () => {
        // Updated to include enrolled courses
        const headers = ["ID", "Nome", "Email", "Telefone", "Idade", "Sexo", "Escolaridade", "Endereço", "Cursos Inscritos"];
        const csvContent = [
            headers.join(","),
            ...users.map(u => {
                // Find user's enrollments and map to course names
                const userEnrollments = enrollments.filter(e => e.userId === u.id);
                const courseNames = userEnrollments.map(e => {
                    const c = courses.find(course => course.id === e.courseId);
                    return c ? c.name : 'Unknown';
                }).join(" | ");

                return [
                    `"${u.id}"`,
                    `"${u.name}"`,
                    u.email,
                    u.phone,
                    u.age || "",
                    u.gender || "",
                    `"${u.education || ""}"`,
                    `"${u.address || ""}"`,
                    `"${courseNames}"` // Add courses column
                ].join(",")
            })
        ].join("\n");
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "lista_alunos_completa.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const handleExportDB = () => {
        // Exports the full state as a JSON file ("script do banco")
        const dbData = {
            users,
            courses,
            professors,
            enrollments,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(dbData, null, 2)], { type: 'application/json' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "cristofe_db_backup.json");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // --- MODAL: CREATE/EDIT COURSE ---
    if (isEditingCourse || (view === 'admin' && adminTab === 'create_mode_fake' as any)) { 
       return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-brand-surface border border-brand-500/30 p-6 max-w-2xl w-full my-8 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-brand-neon rounded-tl-xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-brand-neon rounded-br-xl pointer-events-none"></div>

                <div className="flex justify-between mb-6 border-b border-brand-border pb-4">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-brand-neon">{isEditingCourse ? 'Editar Curso' : 'Novo Curso'}</h2>
                    <button onClick={() => { setIsEditingCourse(null); setAdminTab('courses'); }}><XCircle className="text-slate-500 hover:text-brand-neon transition" /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Nome do Curso</label>
                            <input className={inputClass} value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Categoria</label>
                             <select className={inputClass} value={courseForm.category} onChange={e => setCourseForm({...courseForm, category: e.target.value})}>
                                {COURSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className={labelClass}>Descrição Breve</label>
                            <textarea className={inputClass} rows={3} value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} />
                        </div>
                         <div>
                            <label className={labelClass}>Professor Responsável</label>
                             <select className={inputClass} value={courseForm.professorId || ''} onChange={e => setCourseForm({...courseForm, professorId: e.target.value})}>
                                <option value="">-- SELECIONE --</option>
                                {professors.map(p => <option key={p.id} value={p.id}>{p.name} - {p.role}</option>)}
                             </select>
                        </div>
                        <div className="border border-brand-border p-2 bg-brand-dark/50 space-y-2">
                             <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="partnership"
                                    checked={courseForm.hasPartnership || false} 
                                    onChange={e => setCourseForm({...courseForm, hasPartnership: e.target.checked})}
                                    className="w-4 h-4 text-brand-neon rounded focus:ring-brand-neon"
                                />
                                <label htmlFor="partnership" className="text-xs font-bold text-white uppercase tracking-wider cursor-pointer">Possui Parceria?</label>
                            </div>
                            {courseForm.hasPartnership && (
                                <input 
                                    type="text" 
                                    placeholder="Nome do Parceiro (Ex: Cisco, AWS)"
                                    className={inputClass}
                                    value={courseForm.partnerName || ''}
                                    onChange={e => setCourseForm({...courseForm, partnerName: e.target.value})}
                                />
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Pré-requisitos</label>
                            <textarea className={inputClass} rows={2} value={courseForm.prerequisites || ''} onChange={e => setCourseForm({...courseForm, prerequisites: e.target.value})} placeholder="Ex: Lógica de Programação..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className={labelClass}>Data de Início</label>
                              <input type="date" className={inputClass} value={courseForm.startDate} onChange={e => setCourseForm({...courseForm, startDate: e.target.value})} />
                           </div>
                           <div>
                              <label className={labelClass}>Idade Mínima</label>
                              <input type="number" className={inputClass} value={courseForm.minAge || 16} onChange={e => setCourseForm({...courseForm, minAge: parseInt(e.target.value)})} />
                           </div>
                        </div>
                         <div>
                            <label className={labelClass}>Status</label>
                             <select className={inputClass} value={courseForm.status} onChange={e => setCourseForm({...courseForm, status: e.target.value as CourseStatus})}>
                                <option value={CourseStatus.OPEN}>ABERTAS</option>
                                <option value={CourseStatus.CLOSED}>FECHADAS</option>
                                <option value={CourseStatus.IN_PROGRESS}>EM ANDAMENTO</option>
                             </select>
                        </div>
                        <div>
                            <label className={labelClass}>Critério de Seleção</label>
                             <select className={inputClass} value={courseForm.criteria} onChange={e => setCourseForm({...courseForm, criteria: e.target.value as SelectionCriteria})}>
                                {Object.values(SelectionCriteria).map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                        </div>
                        <div>
                            <label className={labelClass}>Link Grupo WhatsApp (Opcional)</label>
                            <input className={inputClass} value={courseForm.whatsappUrl || ''} onChange={e => setCourseForm({...courseForm, whatsappUrl: e.target.value})} placeholder="https://chat.whatsapp.com/..." />
                        </div>
                        <div>
                            <label className={labelClass}>Link Google Classroom (Opcional)</label>
                            <input className={inputClass} value={courseForm.classroomUrl || ''} onChange={e => setCourseForm({...courseForm, classroomUrl: e.target.value})} placeholder="https://classroom.google.com/..." />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <label className={labelClass}>Imagem do Curso</label>
                        <ImageEditor 
                            currentImageUrl={courseForm.imageUrl} 
                            onImageUpdate={(url) => setCourseForm({...courseForm, imageUrl: url})} 
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t border-brand-border pt-4">
                    <button onClick={() => { setIsEditingCourse(null); setAdminTab('courses'); }} className="px-5 py-2 border border-brand-border text-slate-400 hover:text-white hover:border-white transition uppercase text-xs font-bold tracking-widest">Cancelar</button>
                    <button onClick={() => { handleSaveCourse(courseForm); setAdminTab('courses'); }} className="px-5 py-2 bg-brand-600 hover:bg-brand-neon hover:text-black text-white transition uppercase text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)]">Salvar Dados</button>
                </div>
            </div>
        </div>
       )
    }

    // --- MODAL: CREATE/EDIT PROFESSOR ---
    if (isEditingProfessor || (view === 'admin' && adminTab === 'create_prof_mode_fake' as any)) {
         return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-brand-surface border border-brand-500/30 p-6 max-w-2xl w-full my-8 shadow-2xl relative">
                    <div className="flex justify-between mb-6 border-b border-brand-border pb-4">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-brand-neon">{isEditingProfessor ? 'Editar Professor' : 'Novo Professor'}</h2>
                        <button onClick={() => { setIsEditingProfessor(null); setAdminTab('professors'); }}><XCircle className="text-slate-500 hover:text-brand-neon transition" /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                             <div>
                                <label className={labelClass}>Nome Completo</label>
                                <input className={inputClass} value={profForm.name} onChange={e => setProfForm({...profForm, name: e.target.value})} />
                             </div>
                             <div>
                                <label className={labelClass}>Cargo / Título</label>
                                <input className={inputClass} value={profForm.role} onChange={e => setProfForm({...profForm, role: e.target.value})} placeholder="Ex: Coordenador, PhD..." />
                             </div>
                             <div>
                                <label className={labelClass}>Biografia Resumida</label>
                                <textarea className={inputClass} rows={4} value={profForm.bio} onChange={e => setProfForm({...profForm, bio: e.target.value})} />
                             </div>
                             <div>
                                <label className={labelClass}>Link Lattes (Opcional)</label>
                                <input className={inputClass} value={profForm.lattesUrl || ''} onChange={e => setProfForm({...profForm, lattesUrl: e.target.value})} />
                             </div>
                         </div>
                         <div className="space-y-4">
                            <label className={labelClass}>Foto do Professor</label>
                            <ImageEditor 
                                currentImageUrl={profForm.imageUrl} 
                                onImageUpdate={(url) => setProfForm({...profForm, imageUrl: url})} 
                            />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3 border-t border-brand-border pt-4">
                        <button onClick={() => { setIsEditingProfessor(null); setAdminTab('professors'); }} className="px-5 py-2 border border-brand-border text-slate-400 hover:text-white hover:border-white transition uppercase text-xs font-bold tracking-widest">Cancelar</button>
                        <button onClick={() => { handleSaveProfessor(profForm); setAdminTab('professors'); }} className="px-5 py-2 bg-brand-600 hover:bg-brand-neon hover:text-black text-white transition uppercase text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)]">Salvar Docente</button>
                    </div>
                </div>
            </div>
         )
    }

    // --- MODAL: EDIT USER ---
    if (isEditingUser) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-brand-surface border border-brand-500/30 p-6 max-w-lg w-full my-8 shadow-2xl relative">
                     <div className="flex justify-between mb-6 border-b border-brand-border pb-4">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-brand-neon">Editar Usuário</h2>
                        <button onClick={() => { setIsEditingUser(null); }}><XCircle className="text-slate-500 hover:text-brand-neon transition" /></button>
                    </div>
                     <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Nome</label>
                            <input className={inputClass} value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input className={inputClass} value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelClass}>WhatsApp / Telefone</label>
                            <input className={inputClass} value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} />
                        </div>
                        {/* 
                            We keep these inputs available for admin but they might be empty for new users 
                        */}
                        <div>
                            <label className={labelClass}>Endereço (Opcional)</label>
                            <input className={inputClass} value={userForm.address || ''} onChange={e => setUserForm({...userForm, address: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Idade (Opcional)</label>
                                <input type="number" className={inputClass} value={userForm.age || ''} onChange={e => setUserForm({...userForm, age: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label className={labelClass}>Sexo (Opcional)</label>
                                <select className={inputClass} value={userForm.gender || ''} onChange={e => setUserForm({...userForm, gender: e.target.value as any})}>
                                    <option value="">-</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                        </div>
                         <div>
                            <label className={labelClass}>Escolaridade (Opcional)</label>
                             <select className={inputClass} value={userForm.education || ''} onChange={e => setUserForm({...userForm, education: e.target.value as any})}>
                                <option value="">-</option>
                                {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
                             </select>
                        </div>
                     </div>
                     <div className="mt-8 flex justify-end gap-3 border-t border-brand-border pt-4">
                        <button onClick={() => setIsEditingUser(null)} className="px-5 py-2 border border-brand-border text-slate-400 hover:text-white hover:border-white transition uppercase text-xs font-bold tracking-widest">Cancelar</button>
                        <button onClick={() => handleSaveUser(userForm)} className="px-5 py-2 bg-brand-600 hover:bg-brand-neon hover:text-black text-white transition uppercase text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)]">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-2">
            <div className="flex flex-wrap gap-4">
                <button 
                    onClick={() => setAdminTab('courses')}
                    className={`pb-2 px-4 font-bold uppercase tracking-widest text-xs transition-colors ${adminTab === 'courses' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Gerenciar Cursos
                </button>
                <button 
                    onClick={() => setAdminTab('professors')}
                    className={`pb-2 px-4 font-bold uppercase tracking-widest text-xs transition-colors ${adminTab === 'professors' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Corpo Docente
                </button>
                <button 
                    onClick={() => setAdminTab('users')}
                    className={`pb-2 px-4 font-bold uppercase tracking-widest text-xs transition-colors ${adminTab === 'users' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Gerenciar Alunos
                </button>
                <button 
                    onClick={() => setAdminTab('selection')}
                    className={`pb-2 px-4 font-bold uppercase tracking-widest text-xs transition-colors ${adminTab === 'selection' ? 'text-brand-neon border-b-2 border-brand-neon' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Sistema de Seleção
                </button>
            </div>
            <button 
                onClick={handleAdminLogout}
                className="pb-2 px-4 font-bold uppercase tracking-widest text-xs transition-colors text-red-500 hover:text-red-400 flex items-center gap-2"
            >
                <LogOut size={16} /> Sair do Sistema
            </button>
        </div>

        {adminTab === 'courses' && (
            <div>
                <button 
                    onClick={() => { setIsEditingCourse(null); setAdminTab('create_mode_fake' as any); }}
                    className="mb-6 bg-brand-surface border border-brand-500/50 text-brand-neon px-6 py-3 flex items-center gap-2 hover:bg-brand-500 hover:text-black transition duration-300 font-bold uppercase tracking-widest text-sm"
                >
                    <Plus size={20} /> Criar Novo Curso
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-brand-surface border border-brand-border hover:border-brand-neon/50 transition duration-300 group relative">
                            <div className="relative h-40 overflow-hidden">
                                <img src={course.imageUrl} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-surface to-transparent"></div>
                                <h3 className="absolute bottom-3 left-4 right-4 font-bold text-lg text-white truncate drop-shadow-md">{course.name}</h3>
                                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                    <span className="px-2 py-0.5 bg-black/50 text-brand-neon text-[10px] font-bold uppercase tracking-widest border border-brand-900 backdrop-blur-sm">
                                        {course.category || 'Geral'}
                                    </span>
                                    {course.hasPartnership && (
                                        <span className="text-[10px] bg-brand-neon text-black px-1 font-bold">
                                            {course.partnerName ? course.partnerName.toUpperCase() : 'PARCEIRO'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-slate-400 text-sm mb-4 h-10 line-clamp-2">{course.description}</p>
                                <div className="flex justify-between items-center mt-4 border-t border-brand-border pt-4">
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                        course.status === CourseStatus.OPEN ? 'border-green-500 text-green-400' : 
                                        course.status === CourseStatus.IN_PROGRESS ? 'border-yellow-500 text-yellow-400' :
                                        'border-red-500 text-red-400'
                                    }`}>
                                        [{course.status}]
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsEditingCourse(course)} className="p-2 text-brand-500 hover:text-brand-neon transition"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-red-800 hover:text-red-500 transition"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {adminTab === 'professors' && (
            <div>
                 <button 
                    onClick={() => { setIsEditingProfessor(null); setAdminTab('create_prof_mode_fake' as any); }}
                    className="mb-6 bg-brand-surface border border-brand-500/50 text-brand-neon px-6 py-3 flex items-center gap-2 hover:bg-brand-500 hover:text-black transition duration-300 font-bold uppercase tracking-widest text-sm"
                >
                    <Plus size={20} /> Adicionar Professor
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {professors.map(prof => (
                        <div key={prof.id} className="bg-brand-surface border border-brand-border p-4 flex gap-4 items-start relative group">
                            <img src={prof.imageUrl} className="w-24 h-24 object-cover border border-brand-500" alt={prof.name} />
                            <div>
                                <h3 className="text-lg font-bold text-white">{prof.name}</h3>
                                <p className="text-brand-500 text-xs uppercase tracking-wider mb-2">{prof.role}</p>
                                <p className="text-slate-400 text-sm line-clamp-2">{prof.bio}</p>
                            </div>
                             <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => setIsEditingProfessor(prof)} className="p-1 text-brand-500 hover:text-brand-neon"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProfessor(prof.id)} className="p-1 text-red-800 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {adminTab === 'users' && (
            <div>
                <div className="flex justify-end mb-4 gap-2">
                     <button 
                        onClick={handleExportDB}
                        className="bg-brand-dark border border-brand-500/50 text-slate-300 px-4 py-2 flex items-center gap-2 hover:bg-brand-500/20 hover:text-white transition duration-300 font-bold uppercase tracking-widest text-xs"
                    >
                        <Database size={16} /> Backup Banco (JSON)
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="bg-brand-surface border border-brand-500/50 text-brand-neon px-4 py-2 flex items-center gap-2 hover:bg-brand-500 hover:text-black transition duration-300 font-bold uppercase tracking-widest text-xs"
                    >
                        <Download size={16} /> Exportar CSV
                    </button>
                </div>
                <div className="overflow-x-auto border border-brand-border">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-brand-dark text-brand-500 font-bold uppercase tracking-wider text-[10px] font-mono">
                            <tr>
                                <th className="p-4">Nome</th>
                                <th className="p-4">Sexo</th>
                                <th className="p-4">Idade</th>
                                <th className="p-4">Escolaridade</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">WhatsApp/Tel</th>
                                <th className="p-4">Endereço</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border bg-brand-surface/50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-brand-500/10 transition">
                                    <td className="p-4 font-bold text-white">{u.name}</td>
                                    <td className="p-4 font-mono">{u.gender || '-'}</td>
                                    <td className="p-4 font-mono">{u.age || '-'}</td>
                                    <td className="p-4 font-mono text-xs">{u.education || '-'}</td>
                                    <td className="p-4 font-mono">{u.email}</td>
                                    <td className="p-4 font-mono">{u.phone}</td>
                                    <td className="p-4 font-mono text-xs max-w-[150px] truncate">{u.address || '-'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => setIsEditingUser(u)} className="p-1 text-brand-500 hover:text-brand-neon transition" title="Editar Usuário"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="p-1 text-red-800 hover:text-red-500 transition" title="Excluir Usuário"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan={8} className="p-8 text-center text-slate-600">Nenhum usuário cadastrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {adminTab === 'selection' && (
            <div className="bg-brand-surface p-6 border border-brand-border relative">
                <div className="mb-6">
                    <label className="block text-xs font-bold text-brand-500 mb-2 uppercase tracking-widest">Selecionar Curso:</label>
                    <select 
                        className="w-full md:w-1/2 p-3 border border-brand-border bg-brand-dark text-white focus:border-brand-neon outline-none font-mono"
                        value={selectedCourseIdForSelection}
                        onChange={(e) => setSelectedCourseIdForSelection(e.target.value)}
                    >
                        <option value="">-- SELECIONE O CURSO --</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                {selectedCourseIdForSelection && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6 p-4 bg-brand-900/20 border-l-2 border-brand-neon">
                            <div>
                                <h3 className="font-bold text-brand-500 uppercase text-[10px] tracking-widest mb-1">Algoritmo de Seleção</h3>
                                <p className="text-white font-mono text-lg">{courses.find(c => c.id === selectedCourseIdForSelection)?.criteria}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-brand-border">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-brand-dark text-brand-500 font-bold uppercase tracking-wider text-[10px] font-mono">
                                    <tr>
                                        <th className="p-4">Identidade</th>
                                        <th className="p-4">Sexo</th>
                                        <th className="p-4">Idade</th>
                                        <th className="p-4">Nível</th>
                                        <th className="p-4">Contato (Email/Zap)</th>
                                        <th className="p-4">Endereço</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Comando</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border bg-brand-surface/50">
                                    {getFilteredEnrollments(selectedCourseIdForSelection).length === 0 ? (
                                        <tr><td colSpan={8} className="p-8 text-center text-slate-600 italic font-mono">Nenhum dado encontrado no sistema.</td></tr>
                                    ) : (
                                        getFilteredEnrollments(selectedCourseIdForSelection).map(enrollment => {
                                            const user = users.find(u => u.id === enrollment.userId);
                                            if (!user) return null;
                                            return (
                                                <tr key={enrollment.id} className="hover:bg-brand-500/10 transition duration-150">
                                                    <td className="p-4 font-bold text-white">{user.name}</td>
                                                    <td className="p-4 font-mono">{user.gender || '-'}</td>
                                                    <td className="p-4 font-mono">{user.age || '-'}</td>
                                                    <td className="p-4 text-xs">{user.education || '-'}</td>
                                                    <td className="p-4 font-mono text-xs">
                                                      <div>{user.email}</div>
                                                      <div className="text-brand-500">{user.phone}</div>
                                                    </td>
                                                    <td className="p-4 text-xs max-w-[100px] truncate">{user.address || '-'}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                                                            enrollment.status === EnrollmentStatus.SELECTED ? 'border-green-500 text-green-400 bg-green-500/10' :
                                                            enrollment.status === EnrollmentStatus.REJECTED ? 'border-red-500 text-red-400 bg-red-500/10' :
                                                            'border-yellow-500 text-yellow-400 bg-yellow-500/10'
                                                        }`}>
                                                            {enrollment.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        <button 
                                                            onClick={() => handleUpdateEnrollmentStatus(enrollment.id, EnrollmentStatus.SELECTED)}
                                                            className="text-green-600 hover:text-green-400 p-1 hover:bg-green-500/10 rounded transition" title="Aprovar"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateEnrollmentStatus(enrollment.id, EnrollmentStatus.REJECTED)}
                                                            className="text-red-600 hover:text-red-400 p-1 hover:bg-red-500/10 rounded transition" title="Rejeitar"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    );
  };

  // --- LAYOUT ---

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Login Modal */}
      {showAdminLogin && <AdminLoginModal />}

      {/* Navigation */}
      <nav className="border-b border-brand-border bg-brand-dark/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('home'); setSelectedCourseDetail(null); }}>
                <div className="relative">
                    <div className="absolute -inset-1 bg-brand-neon rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                    <Cpu className="relative text-brand-neon" size={32} strokeWidth={1.5} />
                </div>
                <div>
                    <span className="text-2xl font-bold text-white tracking-widest uppercase block leading-none">
                    Cristofé
                    </span>
                    <span className="text-[10px] text-brand-500 font-mono tracking-[0.2em] uppercase block">Plataforma de Cursos</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="hidden md:flex items-center gap-4 ml-8">
                  <button 
                    onClick={() => { setView('home'); setSelectedCourseDetail(null); setShowOpenCoursesOnly(false); }} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-neon transition-colors"
                  >
                     <Home size={14} /> Início
                  </button>
                  <button 
                    onClick={() => scrollToSection('courses', false)} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-neon transition-colors"
                  >
                     <BookOpen size={14} /> Cursos
                  </button>
                  <button 
                    onClick={() => scrollToSection('courses', true)} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-neon transition-colors"
                  >
                     <CheckCircle size={14} /> Inscrições Abertas
                  </button>
                  <button 
                    onClick={() => scrollToSection('business', false)} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-neon transition-colors"
                  >
                     <Briefcase size={14} /> Empresário
                  </button>
                   <button 
                    onClick={() => scrollToSection('partners', false)} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-neon transition-colors"
                  >
                     <Handshake size={14} /> Parceiros
                  </button>
                  <a 
                    href="#professor-section"
                    onClick={(e) => { e.preventDefault(); scrollToSection('professor-section'); }}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-neon transition-colors"
                  >
                     <FileText size={14} /> Currículo
                  </a>
                  <a 
                    href="mailto:cclr@cin.ufpe.br"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-neon transition-colors"
                  >
                     <Mail size={14} /> Contato
                  </a>
              </div>
          </div>
          
          <div className="flex items-center gap-6">
            {currentUser ? (
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-brand-600 hidden sm:block uppercase tracking-widest font-mono">USER: {currentUser.name.split(' ')[0]}</span>
                  <button 
                    onClick={() => { setCurrentUser(null); setView('home'); }} 
                    className="flex items-center gap-2 px-3 py-1 border border-red-900/50 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition rounded text-[10px] font-bold uppercase tracking-widest"
                  >
                    <LogOut size={14} /> Sair
                  </button>
               </div>
            ) : null /* Removed Generic Register button since flow is course-specific */}
            
            <div className="h-6 w-px bg-brand-border"></div>

            <button
              onClick={handleToggleAdmin}
              className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                view === 'admin' 
                  ? 'bg-brand-neon text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                  : 'bg-transparent border border-brand-border text-slate-400 hover:text-white hover:border-brand-500'
              }`}
            >
              {view === 'admin' ? <LayoutDashboard size={14} /> : <Users size={14} />}
              {view === 'admin' ? 'MODO ADMIN' : 'ADMIN SYS'}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full relative">
        {view === 'home' && (
          <div className="space-y-16 animate-fade-in-up">
            
            {/* HERO SECTION WITH NEURAL BACKGROUND */}
            <div className="relative rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center border border-brand-border bg-brand-dark/50 shadow-2xl mt-8">
               <NeuralBackground />
               <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-12">
                   <div className="inline-block px-4 py-1 bg-brand-neon/10 border border-brand-neon text-brand-neon rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 font-mono animate-pulse">
                        Neural Connection Established
                   </div>
                   <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                        PLATAFORMA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-purple-500">CURSOS</span>
                   </h1>
                   <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light border-t border-b border-brand-border/30 py-8 drop-shadow-md">
                        Somos uma empresa de computação dedicada a democratizar o conhecimento, inserindo a sociedade na era da Inteligência Artificial e Internet das Coisas. Domine o futuro com especialização avançada em Redes e Administração de Sistemas, IA, Empreendedorismo e Inovação. <br/><span className="italic text-brand-neon block mt-4">"Não somos quem pensamos ser, mas sim o que pensamos"</span>
                   </p>
               </div>
            </div>
            
            <div className="flex items-center gap-2 mb-6 border-b border-brand-border pb-2 mt-8">
                <Terminal className="text-brand-neon" size={20}/>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Cursos Disponíveis</h3>
             </div>
            <PublicCourseList courses={courses} showOpenCoursesOnly={showOpenCoursesOnly} openCourseDetail={openCourseDetail} />
            
            <div className="mt-20">
                 <TechInfoSection />
            </div>

            <div className="mt-20">
                 <BusinessSection setView={setView} />
            </div>

            <div className="mt-20">
                <ProfessorSection professors={professors} />
            </div>

            <StudentGallery />
            
             {/* Cisco NetAcad Partnership Banner */}
             <div id="partners" className="mb-12 scroll-mt-24">
                 <div className="flex items-center gap-2 mb-6 border-b border-brand-border pb-2">
                    <Handshake className="text-brand-neon" size={20}/>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Nossos Parceiros</h3>
                 </div>
                 <div className="border-y border-brand-border/50 bg-brand-900/10 py-8 backdrop-blur-sm relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-neon/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                     <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                         <div className="p-4 bg-white rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            {/* Placeholder for Cisco Logo */}
                             <div className="text-black font-bold text-xl tracking-tighter flex items-center gap-1">
                                <span>CISCO</span>
                                <span className="font-light">Networking Academy</span>
                             </div>
                         </div>
                         <div>
                             <h3 className="text-white font-bold uppercase tracking-widest text-lg">Centro de Treinamento Oficial</h3>
                             <p className="text-slate-400 text-sm max-w-md">
                                 Parceria estratégica para fornecer certificações reconhecidas globalmente em infraestrutura de TI e Segurança.
                             </p>
                         </div>
                         <a href="https://www.netacad.com/pt" target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-brand-500 text-brand-400 hover:bg-brand-500 hover:text-black transition uppercase text-xs font-bold tracking-widest rounded">
                             Saiba Mais
                         </a>
                     </div>
                 </div>
             </div>
            
          </div>
        )}

        {view === 'course_detail' && <CourseDetailView />}

        {/* Business Service Views */}
        {(view === 'business_training' || view === 'business_systems' || view === 'business_consulting') && (
            <BusinessServiceView serviceId={view} />
        )}

        {view === 'simple_enroll' && (
           <SimpleEnrollmentForm />
        )}

        {view === 'admin' && (
          <AdminPanel />
        )}
      </main>
      
      <footer className="border-t border-brand-border py-8 text-center bg-brand-dark relative mt-auto">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold font-mono">
            &copy; {new Date().getFullYear()} Plataforma Cristofé. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
