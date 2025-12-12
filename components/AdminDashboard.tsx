import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  LogOut, 
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  GraduationCap,
  Upload,
  Filter,
  SortAsc,
  UserCheck,
  Download
} from 'lucide-react';
import { Course, CourseStatus, SelectionCriteria, Enrollment, EnrollmentStatus, Professor, User, EducationLevel } from '../types';

interface AdminDashboardProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  professors: Professor[];
  setProfessors: React.Dispatch<React.SetStateAction<Professor[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  enrollments: Enrollment[];
  setEnrollments: React.Dispatch<React.SetStateAction<Enrollment[]>>;
  onLogout: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  courses, 
  setCourses, 
  professors,
  setProfessors,
  users,
  setUsers,
  enrollments,
  setEnrollments, 
  onLogout 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'professors' | 'users' | 'students' | 'selection'>('dashboard');
  
  // State for Selection Tab
  const [selectionCourseId, setSelectionCourseId] = useState<string>('');

  // State for Course CRUD
  const [isEditingCourse, setIsEditingCourse] = useState<Course | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // State for Professor CRUD
  const [isEditingProfessor, setIsEditingProfessor] = useState<Professor | null>(null);
  const [isCreatingProfessor, setIsCreatingProfessor] = useState(false);

  // State for User CRUD
  const [isEditingUser, setIsEditingUser] = useState<User | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);


  // --- HELPERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        alert("O arquivo é muito grande. O tamanho máximo permitido é 2MB.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            callback(reader.result);
        }
    };
    reader.readAsDataURL(file);
  };

  const getEducationScore = (level?: EducationLevel) => {
      switch (level) {
          case EducationLevel.POSTGRAD: return 4;
          case EducationLevel.HIGHER: return 3;
          case EducationLevel.SECONDARY: return 2;
          case EducationLevel.PRIMARY: return 1;
          default: return 0;
      }
  };

  // --- SELECTION LOGIC ---
  const sortedEnrollmentsForSelection = useMemo(() => {
      if (!selectionCourseId) return [];
      
      const course = courses.find(c => c.id === selectionCourseId);
      if (!course) return [];

      const pending = enrollments.filter(e => e.courseId === selectionCourseId && e.status === EnrollmentStatus.PENDING);
      
      // Enhance with user data for sorting
      const enhanced = pending.map(e => ({
          ...e,
          user: users.find(u => u.id === e.userId)
      })).filter(item => item.user !== undefined) as (Enrollment & { user: User })[];

      return enhanced.sort((a, b) => {
          switch (course.criteria) {
              case SelectionCriteria.AGE_DESC:
                  return (b.user.age || 0) - (a.user.age || 0);
              case SelectionCriteria.AGE_ASC:
                  return (a.user.age || 0) - (b.user.age || 0);
              case SelectionCriteria.EDUCATION_HIGH:
                  return getEducationScore(b.user.education) - getEducationScore(a.user.education);
              case SelectionCriteria.FIRST_COME:
                  return a.timestamp - b.timestamp;
              default:
                  return 0;
          }
      });
  }, [selectionCourseId, enrollments, users, courses]);

  const handleBulkApprove = (count: number) => {
      const toApprove = sortedEnrollmentsForSelection.slice(0, count);
      const idsToApprove = toApprove.map(e => e.id);
      
      setEnrollments(prev => prev.map(e => 
          idsToApprove.includes(e.id) ? { ...e, status: EnrollmentStatus.SELECTED } : e
      ));
      alert(`${count} alunos foram selecionados com sucesso!`);
  };

  // --- CSV EXPORT LOGIC ---
  const downloadCSV = () => {
      if (!selectionCourseId) return;
      
      const course = courses.find(c => c.id === selectionCourseId);
      if (!course) return;

      // Get approved students for this course
      const approvedEnrollments = enrollments.filter(e => e.courseId === selectionCourseId && e.status === EnrollmentStatus.SELECTED);
      const approvedUsers = approvedEnrollments.map(e => users.find(u => u.id === e.userId)).filter((u): u is User => !!u);

      if (approvedUsers.length === 0) {
          alert("Não há alunos aprovados para exportar neste curso.");
          return;
      }

      // Headers
      const headers = ["Nome", "Email", "Telefone", "Idade", "Sexo", "Escolaridade", "Endereço", "Data Aprovação"];
      
      // Rows
      const rows = approvedUsers.map(user => {
          const enrollment = approvedEnrollments.find(e => e.userId === user.id);
          const date = enrollment ? new Date(enrollment.timestamp).toLocaleDateString() : '';
          
          return [
              `"${user.name}"`,
              `"${user.email}"`,
              `"${user.phone}"`,
              user.age,
              user.gender,
              `"${user.education}"`,
              `"${user.address || ''}"`,
              date
          ].join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `aprovados_${course.name.replace(/\s+/g, '_').toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };


  // --- LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '999560') { 
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  // --- ENROLLMENT LOGIC ---
  const handleUpdateEnrollmentStatus = (id: string, newStatus: EnrollmentStatus) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <div className="bg-brand-surface border border-brand-border p-8 rounded-xl w-full max-w-md shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-brand-neon/10 rounded-xl flex items-center justify-center border border-brand-neon mb-4">
              <LayoutDashboard className="text-brand-neon" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Área Restrita</h2>
            <p className="text-slate-400 text-sm">Cristofe Treinamentos</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Senha de Acesso</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded p-3 text-white focus:border-brand-neon focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded uppercase tracking-widest transition-all">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- COURSE CRUD ---
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingCourse) return;

    if (isCreatingCourse) {
      setCourses(prev => [...prev, { ...isEditingCourse, id: Date.now().toString() }]);
    } else {
      setCourses(prev => prev.map(c => c.id === isEditingCourse.id ? isEditingCourse : c));
    }
    setIsEditingCourse(null);
    setIsCreatingCourse(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const createEmptyCourse = (): Course => ({
    id: '',
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    status: CourseStatus.CLOSED,
    criteria: SelectionCriteria.FIRST_COME,
    imageUrl: 'https://picsum.photos/400/200',
    category: 'Geral',
    minAge: 16
  });

  // --- PROFESSOR CRUD ---
  const handleSaveProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingProfessor) return;

    if (isCreatingProfessor) {
      setProfessors(prev => [...prev, { ...isEditingProfessor, id: Date.now().toString() }]);
    } else {
      setProfessors(prev => prev.map(p => p.id === isEditingProfessor.id ? isEditingProfessor : p));
    }
    setIsEditingProfessor(null);
    setIsCreatingProfessor(false);
  };

  const handleDeleteProfessor = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      setProfessors(prev => prev.filter(p => p.id !== id));
    }
  };

  const createEmptyProfessor = (): Professor => ({
    id: '',
    name: '',
    role: '',
    bio: '',
    imageUrl: 'https://picsum.photos/200',
    lattesUrl: ''
  });

  // --- USER CRUD ---
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingUser) return;

    if (isCreatingUser) {
        setUsers(prev => [...prev, { ...isEditingUser, id: Date.now().toString() }]);
    } else {
        setUsers(prev => prev.map(u => u.id === isEditingUser.id ? isEditingUser : u));
    }
    setIsEditingUser(null);
    setIsCreatingUser(false);
  };

  const handleDeleteUser = (id: string) => {
      if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
          setUsers(prev => prev.filter(u => u.id !== id));
      }
  };

  const createEmptyUser = (): User => ({
      id: '',
      name: '',
      email: '',
      phone: '',
      age: 18,
      education: EducationLevel.SECONDARY,
      address: '',
      gender: 'M'
  });

  // --- STATS ---
  const totalStudents = enrollments.length;
  const activeCourses = courses.filter(c => c.status === CourseStatus.OPEN).length;
  const totalCourses = courses.length;

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row animate-in fade-in">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-brand-surface border-r border-brand-border p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded flex items-center justify-center font-bold text-brand-dark">CT</div>
          <div>
            <h3 className="font-bold text-white uppercase text-sm">Cristofe</h3>
            <span className="text-[10px] text-brand-500 uppercase tracking-widest">Área Restrita</span>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'dashboard' ? 'bg-brand-neon/10 text-brand-neon border border-brand-neon/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'courses' ? 'bg-brand-neon/10 text-brand-neon border border-brand-neon/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <BookOpen size={18} /> Gerenciar Cursos
          </button>
          <button 
            onClick={() => setActiveTab('professors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'professors' ? 'bg-brand-neon/10 text-brand-neon border border-brand-neon/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <GraduationCap size={18} /> Professores
          </button>
           <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'users' ? 'bg-brand-neon/10 text-brand-neon border border-brand-neon/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users size={18} /> Alunos
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'students' ? 'bg-brand-neon/10 text-brand-neon border border-brand-neon/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <CheckCircle size={18} /> Matrículas
          </button>
           <button 
            onClick={() => setActiveTab('selection')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'selection' ? 'bg-brand-neon/10 text-brand-neon border border-brand-neon/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <UserCheck size={18} /> Seleção
          </button>
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-2 text-slate-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-3 transition-colors">
          <LogOut size={16} /> Sair do Sistema
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white uppercase tracking-wide mb-8">Visão Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-brand-surface border border-brand-border p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total de Cursos</h3>
                  <BookOpen className="text-brand-500" size={20} />
                </div>
                <p className="text-4xl font-bold text-white">{totalCourses}</p>
                <span className="text-xs text-brand-neon mt-2 block">{activeCourses} com inscrições abertas</span>
              </div>
              <div className="bg-brand-surface border border-brand-border p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total de Alunos</h3>
                  <Users className="text-green-500" size={20} />
                </div>
                <p className="text-4xl font-bold text-white">{users.length}</p>
                <span className="text-xs text-green-400 mt-2 block">+12% este mês</span>
              </div>
              <div className="bg-brand-surface border border-brand-border p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Status do Sistema</h3>
                  <CheckCircle className="text-brand-neon" size={20} />
                </div>
                <p className="text-xl font-bold text-white uppercase">Operacional</p>
                <span className="text-xs text-slate-500 mt-2 block">Versão 2.5.0 (Gemini AI Enabled)</span>
              </div>
            </div>
          </div>
        )}

        {/* COURSES VIEW */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wide">Gerenciar Cursos</h2>
              <button 
                onClick={() => { setIsCreatingCourse(true); setIsEditingCourse(createEmptyCourse()); }}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-wide shadow-neon-sm"
              >
                <Plus size={16} /> Novo Curso
              </button>
            </div>

            {isEditingCourse ? (
              <div className="bg-brand-surface border border-brand-border p-8 rounded-xl animate-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white uppercase">{isCreatingCourse ? 'Criar Curso' : 'Editar Curso'}</h3>
                  <button onClick={() => { setIsEditingCourse(null); setIsCreatingCourse(false); }} className="text-slate-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSaveCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Nome do Curso</label>
                    <input 
                      required
                      value={isEditingCourse.name}
                      onChange={e => setIsEditingCourse({...isEditingCourse, name: e.target.value})}
                      className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Descrição</label>
                    <textarea 
                      required
                      rows={4}
                      value={isEditingCourse.description}
                      onChange={e => setIsEditingCourse({...isEditingCourse, description: e.target.value})}
                      className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Categoria</label>
                    <input 
                      value={isEditingCourse.category}
                      onChange={e => setIsEditingCourse({...isEditingCourse, category: e.target.value})}
                      className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Data de Início</label>
                    <input 
                      type="date"
                      value={isEditingCourse.startDate}
                      onChange={e => setIsEditingCourse({...isEditingCourse, startDate: e.target.value})}
                      className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Status</label>
                    <select 
                      value={isEditingCourse.status}
                      onChange={e => setIsEditingCourse({...isEditingCourse, status: e.target.value as CourseStatus})}
                      className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none"
                    >
                      <option value={CourseStatus.OPEN}>Abertas</option>
                      <option value={CourseStatus.CLOSED}>Fechada</option>
                      <option value={CourseStatus.IN_PROGRESS}>Em Andamento</option>
                    </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Critério de Seleção</label>
                     <select 
                       value={isEditingCourse.criteria}
                       onChange={e => setIsEditingCourse({...isEditingCourse, criteria: e.target.value as SelectionCriteria})}
                       className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none"
                     >
                       {Object.values(SelectionCriteria).map(c => (
                           <option key={c} value={c}>{c}</option>
                       ))}
                     </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Professor Responsável</label>
                    <select 
                      value={isEditingCourse.professorId || ''}
                      onChange={e => setIsEditingCourse({...isEditingCourse, professorId: e.target.value})}
                      className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none"
                    >
                      <option value="">Selecione um Professor...</option>
                      {professors.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Imagem do Curso</label>
                     <div className="flex gap-2 items-center">
                         <div className="relative overflow-hidden w-full">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (base64) => setIsEditingCourse({...isEditingCourse, imageUrl: base64}))}
                                className="w-full bg-brand-dark border border-brand-border p-2 rounded text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-brand-dark hover:file:bg-brand-neon"
                            />
                         </div>
                         {isEditingCourse.imageUrl && <img src={isEditingCourse.imageUrl} alt="Preview" className="w-10 h-10 object-cover rounded border border-brand-500" />}
                     </div>
                  </div>
                   <div>
                     <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Pré-requisitos</label>
                     <input 
                        value={isEditingCourse.prerequisites || ''}
                        onChange={e => setIsEditingCourse({...isEditingCourse, prerequisites: e.target.value})}
                        className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                      />
                  </div>
                   <div>
                     <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Parceiro (Opcional)</label>
                     <input 
                        value={isEditingCourse.partnerName || ''}
                        onChange={e => setIsEditingCourse({...isEditingCourse, partnerName: e.target.value, hasPartnership: !!e.target.value})}
                        className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                      />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Link do Grupo (WhatsApp)</label>
                     <input 
                        value={isEditingCourse.whatsappUrl || ''}
                        onChange={e => setIsEditingCourse({...isEditingCourse, whatsappUrl: e.target.value})}
                        className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                        placeholder="https://chat.whatsapp.com/..."
                      />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Link da Aula (Classroom)</label>
                     <input 
                        value={isEditingCourse.classroomUrl || ''}
                        onChange={e => setIsEditingCourse({...isEditingCourse, classroomUrl: e.target.value})}
                        className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                        placeholder="https://meet.google.com/..."
                      />
                  </div>

                  <div className="col-span-2 flex justify-end gap-4 mt-4 border-t border-brand-border pt-4">
                    <button type="button" onClick={() => setIsEditingCourse(null)} className="px-6 py-2 text-slate-400 hover:text-white text-sm font-bold uppercase">Cancelar</button>
                    <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                      <Save size={16} /> Salvar Curso
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="bg-brand-surface border border-brand-border p-4 rounded-lg flex items-center justify-between group hover:border-brand-500/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={course.imageUrl} alt={course.name} className="w-16 h-16 object-cover rounded bg-brand-dark" />
                      <div>
                        <h4 className="font-bold text-white uppercase">{course.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            course.status === CourseStatus.OPEN ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {course.status}
                          </span>
                          <span className="text-xs text-slate-500">{course.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsEditingCourse(course)}
                        className="p-2 text-brand-500 hover:bg-brand-neon/10 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFESSORS VIEW */}
        {activeTab === 'professors' && (
           <div>
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-wide">Gerenciar Professores</h2>
                  <button 
                      onClick={() => { setIsCreatingProfessor(true); setIsEditingProfessor(createEmptyProfessor()); }}
                      className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-wide shadow-neon-sm"
                  >
                      <Plus size={16} /> Novo Professor
                  </button>
              </div>
              
              {isEditingProfessor ? (
                  <div className="bg-brand-surface border border-brand-border p-8 rounded-xl animate-in slide-in-from-right-4">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-white uppercase">{isCreatingProfessor ? 'Criar Professor' : 'Editar Professor'}</h3>
                          <button onClick={() => { setIsEditingProfessor(null); setIsCreatingProfessor(false); }} className="text-slate-500 hover:text-white">
                              <X size={24} />
                          </button>
                       </div>
                       <form onSubmit={handleSaveProfessor} className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Nome Completo</label>
                                <input 
                                    required
                                    value={isEditingProfessor.name}
                                    onChange={e => setIsEditingProfessor({...isEditingProfessor, name: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Cargo / Título</label>
                                <input 
                                    required
                                    value={isEditingProfessor.role}
                                    onChange={e => setIsEditingProfessor({...isEditingProfessor, role: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Biografia</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={isEditingProfessor.bio}
                                    onChange={e => setIsEditingProfessor({...isEditingProfessor, bio: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Foto de Perfil</label>
                                <div className="flex gap-2 items-center">
                                    <div className="relative overflow-hidden w-full">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, (base64) => setIsEditingProfessor({...isEditingProfessor, imageUrl: base64}))}
                                            className="w-full bg-brand-dark border border-brand-border p-2 rounded text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-brand-dark hover:file:bg-brand-neon"
                                        />
                                    </div>
                                    {isEditingProfessor.imageUrl && <img src={isEditingProfessor.imageUrl} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-brand-500" />}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Link Lattes</label>
                                <input 
                                    value={isEditingProfessor.lattesUrl || ''}
                                    onChange={e => setIsEditingProfessor({...isEditingProfessor, lattesUrl: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-4 border-t border-brand-border pt-4">
                                <button type="button" onClick={() => setIsEditingProfessor(null)} className="px-6 py-2 text-slate-400 hover:text-white text-sm font-bold uppercase">Cancelar</button>
                                <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                <Save size={16} /> Salvar Professor
                                </button>
                            </div>
                       </form>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {professors.map(prof => (
                          <div key={prof.id} className="bg-brand-surface border border-brand-border p-6 rounded-xl flex flex-col gap-4">
                              <div className="flex items-center gap-4">
                                  <img src={prof.imageUrl} alt={prof.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-500/30" />
                                  <div>
                                      <h4 className="font-bold text-white uppercase">{prof.name}</h4>
                                      <p className="text-xs text-brand-500 uppercase tracking-wider">{prof.role}</p>
                                  </div>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-3">{prof.bio}</p>
                              <div className="mt-auto pt-4 border-t border-brand-border flex justify-end gap-2">
                                  <button type="button" onClick={() => setIsEditingProfessor(prof)} className="p-2 text-brand-500 hover:bg-brand-neon/10 rounded"><Edit size={16}/></button>
                                  <button type="button" onClick={() => handleDeleteProfessor(prof.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={16}/></button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
           </div>
        )}

        {/* USERS VIEW */}
        {activeTab === 'users' && (
           <div>
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-wide">Gerenciar Alunos</h2>
                  <button 
                      onClick={() => { setIsCreatingUser(true); setIsEditingUser(createEmptyUser()); }}
                      className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase tracking-wide shadow-neon-sm"
                  >
                      <Plus size={16} /> Novo Aluno
                  </button>
              </div>

              {isEditingUser ? (
                  <div className="bg-brand-surface border border-brand-border p-8 rounded-xl animate-in slide-in-from-right-4">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-white uppercase">{isCreatingUser ? 'Criar Aluno' : 'Editar Aluno'}</h3>
                          <button onClick={() => { setIsEditingUser(null); setIsCreatingUser(false); }} className="text-slate-500 hover:text-white">
                              <X size={24} />
                          </button>
                       </div>
                       <form onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Nome Completo</label>
                                <input 
                                    required
                                    value={isEditingUser.name}
                                    onChange={e => setIsEditingUser({...isEditingUser, name: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Email</label>
                                <input 
                                    required
                                    type="email"
                                    value={isEditingUser.email}
                                    onChange={e => setIsEditingUser({...isEditingUser, email: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Telefone</label>
                                <input 
                                    value={isEditingUser.phone}
                                    onChange={e => setIsEditingUser({...isEditingUser, phone: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Idade</label>
                                <input 
                                    type="number"
                                    value={isEditingUser.age || ''}
                                    onChange={e => setIsEditingUser({...isEditingUser, age: parseInt(e.target.value)})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Escolaridade</label>
                                <select
                                    value={isEditingUser.education || ''}
                                    onChange={e => setIsEditingUser({...isEditingUser, education: e.target.value as EducationLevel})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                >
                                    {Object.values(EducationLevel).map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Endereço</label>
                                <input 
                                    value={isEditingUser.address || ''}
                                    onChange={e => setIsEditingUser({...isEditingUser, address: e.target.value})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Sexo</label>
                                <select
                                    value={isEditingUser.gender || 'M'}
                                    onChange={e => setIsEditingUser({...isEditingUser, gender: e.target.value as 'M' | 'F' | 'Outro'})}
                                    className="w-full bg-brand-dark border border-brand-border p-3 rounded text-white focus:border-brand-neon outline-none" 
                                >
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-brand-500 uppercase mb-2">Foto do Aluno (Max 2MB)</label>
                                <div className="flex gap-2 items-center">
                                    <div className="relative overflow-hidden w-full">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, (base64) => setIsEditingUser({...isEditingUser, imageUrl: base64}))}
                                            className="w-full bg-brand-dark border border-brand-border p-2 rounded text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-brand-dark hover:file:bg-brand-neon"
                                        />
                                    </div>
                                    {isEditingUser.imageUrl && <img src={isEditingUser.imageUrl} alt="Preview" className="w-10 h-10 object-cover rounded-full border border-brand-500" />}
                                </div>
                            </div>
                            
                            <div className="col-span-2 flex justify-end gap-4 mt-4 border-t border-brand-border pt-4">
                                <button type="button" onClick={() => setIsEditingUser(null)} className="px-6 py-2 text-slate-400 hover:text-white text-sm font-bold uppercase">Cancelar</button>
                                <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                <Save size={16} /> Salvar Aluno
                                </button>
                            </div>
                       </form>
                  </div>
              ) : (
                  <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-brand-900/30 text-brand-500 uppercase text-xs font-bold tracking-wider">
                              <tr>
                                  <th className="p-4">Aluno</th>
                                  <th className="p-4">Contato</th>
                                  <th className="p-4">Dados</th>
                                  <th className="p-4 text-right">Ações</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                              {users.map(user => (
                                  <tr key={user.id} className="hover:bg-brand-white/5 transition-colors">
                                      <td className="p-4 flex items-center gap-3">
                                          {user.imageUrl ? (
                                              <img src={user.imageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-brand-500/30" />
                                          ) : (
                                              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{user.name.charAt(0)}</div>
                                          )}
                                          <span className="font-bold text-white">{user.name}</span>
                                      </td>
                                      <td className="p-4 text-slate-400 text-xs">
                                          <div>{user.email}</div>
                                          <div className="font-mono">{user.phone}</div>
                                      </td>
                                      <td className="p-4 text-slate-400 text-xs">
                                          {user.age} anos, {user.education}
                                      </td>
                                      <td className="p-4 flex justify-end gap-2">
                                          <button type="button" onClick={() => setIsEditingUser(user)} className="text-brand-500 hover:text-white"><Edit size={16}/></button>
                                          <button type="button" onClick={() => handleDeleteUser(user.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                      {users.length === 0 && (
                          <div className="p-8 text-center text-slate-500">Nenhum aluno cadastrado.</div>
                      )}
                  </div>
              )}
           </div>
        )}

        {/* SELECTION TAB VIEW */}
        {activeTab === 'selection' && (
           <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-wide">Seleção Automática</h2>
                  <div className="flex gap-2">
                      <select 
                        value={selectionCourseId}
                        onChange={(e) => setSelectionCourseId(e.target.value)}
                        className="bg-brand-dark border border-brand-border text-white text-sm rounded-lg p-2.5 focus:border-brand-neon outline-none"
                      >
                          <option value="">Selecione um curso para filtrar...</option>
                          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                  </div>
                </div>

                {!selectionCourseId && (
                    <div className="text-center py-20 border border-dashed border-brand-border rounded-lg text-slate-500">
                        <Filter className="mx-auto mb-4 opacity-50" size={48} />
                        <p>Selecione um curso acima para iniciar o processo de seleção.</p>
                    </div>
                )}

                {selectionCourseId && (
                    <div className="animate-in fade-in">
                        <div className="bg-brand-surface border border-brand-border p-4 rounded-lg mb-6 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-brand-500 font-bold uppercase mb-1">Critério do Curso</p>
                                <p className="text-white font-bold flex items-center gap-2">
                                    <SortAsc size={18} /> {courses.find(c => c.id === selectionCourseId)?.criteria}
                                </p>
                            </div>
                            <div className="text-right flex items-center gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Candidatos Pendentes</p>
                                    <p className="text-white font-bold text-xl">{sortedEnrollmentsForSelection.length}</p>
                                </div>
                                <div className="h-8 w-px bg-brand-border mx-2"></div>
                                <button 
                                    onClick={downloadCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold uppercase text-xs tracking-widest shadow-neon-sm transition-all"
                                >
                                    <Download size={16} /> Exportar CSV (Aprovados)
                                </button>
                            </div>
                        </div>
                        
                        {sortedEnrollmentsForSelection.length > 0 && (
                             <div className="flex gap-4 mb-6">
                                <button onClick={() => handleBulkApprove(1)} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-xs font-bold uppercase shadow-neon-sm">
                                    Aprovar 1º Colocado
                                </button>
                                <button onClick={() => handleBulkApprove(2)} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-xs font-bold uppercase shadow-neon-sm">
                                    Aprovar Top 2
                                </button>
                                <button onClick={() => handleBulkApprove(5)} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-xs font-bold uppercase shadow-neon-sm">
                                    Aprovar Top 5
                                </button>
                             </div>
                        )}

                        <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-brand-900/30 text-brand-500 uppercase text-xs font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4">Rank</th>
                                        <th className="p-4">Candidato</th>
                                        <th className="p-4">Dados Relevantes</th>
                                        <th className="p-4">Data Inscrição</th>
                                        <th className="p-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border">
                                    {sortedEnrollmentsForSelection.map((enrollment, idx) => (
                                        <tr key={enrollment.id} className="hover:bg-brand-white/5 transition-colors">
                                            <td className="p-4 font-mono font-bold text-brand-neon">#{idx + 1}</td>
                                            <td className="p-4 flex items-center gap-3">
                                                {enrollment.user.imageUrl ? (
                                                  <img src={enrollment.user.imageUrl} className="w-8 h-8 rounded-full object-cover" alt="" />
                                                ) : (
                                                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs">{enrollment.user.name.charAt(0)}</div>
                                                )}
                                                <div>
                                                    <div className="text-white font-bold">{enrollment.user.name}</div>
                                                    <div className="text-xs text-slate-500">{enrollment.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-xs text-slate-300 space-y-1">
                                                <span className="block">Idade: {enrollment.user.age}</span>
                                                <span className="block">Escolaridade: {enrollment.user.education}</span>
                                                <span className="block text-slate-500">Endereço: {enrollment.user.address || 'N/A'}</span>
                                                <span className="block text-slate-500">Sexo: {enrollment.user.gender || 'N/A'}</span>
                                            </td>
                                            <td className="p-4 text-xs font-mono text-slate-500">
                                                {new Date(enrollment.timestamp).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-[10px] font-bold uppercase">
                                                    Pendente
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {sortedEnrollmentsForSelection.length === 0 && (
                                <div className="p-12 text-center text-slate-500">
                                    <CheckCircle className="mx-auto mb-2 opacity-50" />
                                    <p>Não há matrículas pendentes para este curso.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
           </div>
        )}

        {/* STUDENTS (Enrollments) VIEW */}
        {activeTab === 'students' && (
           <div>
              <h2 className="text-3xl font-bold text-white uppercase tracking-wide mb-8">Gestão de Matrículas</h2>
              {enrollments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-brand-border rounded-lg">
                  <p className="text-slate-500">Nenhuma matrícula registrada no sistema.</p>
                </div>
              ) : (
                <div className="space-y-4">
                   {enrollments.map((enrollment, idx) => {
                       const student = users.find(u => u.id === enrollment.userId);
                       const course = courses.find(c => c.id === enrollment.courseId);

                       return (
                          <div key={idx} className="bg-brand-surface border border-brand-border p-4 rounded-lg flex justify-between items-center">
                              <div>
                                 <p className="text-xs text-brand-500 font-bold uppercase mb-1">
                                     {student ? student.name : `User: ${enrollment.userId}`}
                                 </p>
                                 <p className="text-white font-bold">{course ? course.name : `Course: ${enrollment.courseId}`}</p>
                                 <div className="text-xs text-slate-500 mt-1">
                                    <span>{new Date(enrollment.timestamp).toLocaleDateString()}</span>
                                    {student && <span className="ml-2">| {student.email}</span>}
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  {enrollment.status === EnrollmentStatus.PENDING && (
                                    <>
                                      <button 
                                        onClick={() => handleUpdateEnrollmentStatus(enrollment.id, EnrollmentStatus.SELECTED)}
                                        className="p-2 text-green-500 hover:bg-green-500/10 rounded border border-transparent hover:border-green-500/50" 
                                        title="Aprovar"
                                      >
                                        <CheckCircle size={20}/>
                                      </button>
                                      <button 
                                        onClick={() => handleUpdateEnrollmentStatus(enrollment.id, EnrollmentStatus.REJECTED)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded border border-transparent hover:border-red-500/50" 
                                        title="Rejeitar"
                                      >
                                        <XCircle size={20}/>
                                      </button>
                                    </>
                                  )}
                                  {enrollment.status !== EnrollmentStatus.PENDING && (
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded border ${
                                        enrollment.status === EnrollmentStatus.SELECTED 
                                        ? 'border-green-500 text-green-500 bg-green-500/10' 
                                        : 'border-red-500 text-red-500 bg-red-500/10'
                                    }`}>
                                        {enrollment.status}
                                    </span>
                                  )}
                              </div>
                          </div>
                       )
                   })}
                </div>
              )}
           </div>
        )}
      </main>
    </div>
  );
};