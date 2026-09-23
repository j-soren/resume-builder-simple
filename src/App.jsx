import React, { useState, useRef, useEffect } from 'react';
import { Download, Plus, Trash2, Upload, Camera, LayoutTemplate, Bold, Italic, GraduationCap } from 'lucide-react';

// --- Custom Minimalist Rich Text Editor ---
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  // Sync external changes (like initial load) without resetting cursor while typing
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  const executeCommand = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="border border-neutral-200 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all flex flex-col w-full">
      {/* Formatting Toolbar */}
      <div className="flex border-b border-neutral-100 bg-neutral-50 px-2 py-1 gap-1 shrink-0">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
          className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
          title="Bold (Highlight text first)"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
          className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded transition-colors cursor-pointer"
          title="Italic (Highlight text first)"
        >
          <Italic size={14} />
        </button>
      </div>
      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full px-3 py-2 text-sm min-h-[70px] outline-none"
        placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default function App() {
  const [template, setTemplate] = useState('minimal');
  
  const [personalData, setPersonalData] = useState({
    fullName: 'Rajveer Soren',
    jobTitle: 'Professional Title',
    email: 'rajveer@example.com',
    phone: '+91 9876543210',
    location: 'Patna, Bihar',
    photo: null,
  });

  const [education, setEducation] = useState([
    {
      id: crypto.randomUUID(),
      degree: 'Bachelor of Technology',
      college: 'University of Technology',
      year: '2018 - 2022'
    }
  ]);

  // Notice: The text field now supports HTML tags like <b> and <i>
  const [sections, setSections] = useState([
    {
      id: crypto.randomUUID(),
      heading: 'Professional Summary',
      items: [
        { id: crypto.randomUUID(), text: 'A highly motivated professional looking to leverage <b>strong operational skills</b> in a dynamic environment.' }
      ]
    },
    {
      id: crypto.randomUUID(),
      heading: 'Experience',
      items: [
        { id: crypto.randomUUID(), text: '<b>Company Name</b> - <i>Role</i>' },
        { id: crypto.randomUUID(), text: '• Key achievement or responsibility...<br>• Another key achievement...' }
      ]
    }
  ]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPersonalData((prev) => ({ ...prev, photo: imageUrl }));
    }
  };

  // Education Handlers
  const addEducation = () => {
    setEducation([...education, { id: crypto.randomUUID(), degree: '', college: '', year: '' }]);
  };

  const updateEducation = (id, field, value) => {
    setEducation((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id) => {
    setEducation(education.filter((edu) => edu.id !== id));
  };

  // Section Handlers
  const handleSectionHeadingChange = (id, value) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, heading: value } : sec))
    );
  };

  const addSection = () => {
    setSections([...sections, { 
      id: crypto.randomUUID(), 
      heading: 'New Section', 
      items: [{ id: crypto.randomUUID(), text: '' }] 
    }]);
  };

  const removeSection = (id) => {
    setSections(sections.filter((sec) => sec.id !== id));
  };

  const addSectionItem = (sectionId) => {
    setSections((prev) => prev.map((sec) => {
      if (sec.id === sectionId) {
        return { ...sec, items: [...sec.items, { id: crypto.randomUUID(), text: '' }] };
      }
      return sec;
    }));
  };

  const updateSectionItem = (sectionId, itemId, field, value) => {
    setSections((prev) => prev.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.map((item) => item.id === itemId ? { ...item, [field]: value } : item)
        };
      }
      return sec;
    }));
  };

  const removeSectionItem = (sectionId, itemId) => {
    setSections((prev) => prev.map((sec) => {
      if (sec.id === sectionId) {
        return { ...sec, items: sec.items.filter((item) => item.id !== itemId) };
      }
      return sec;
    }));
  };

  // --- Template Rendering Logic ---
  // Using dangerouslySetInnerHTML allows the newly formatted HTML (b, i tags) to render correctly.
  const renderTemplate = () => {
    switch (template) {
      case 'classic':
        return (
          <div className="font-serif w-full max-w-[210mm] min-h-[297mm] bg-white p-12 mx-auto box-border flex flex-col text-neutral-900 shadow-2xl print:shadow-none print:w-[210mm] print:h-[297mm] print:p-0">
            <header className="flex flex-col items-center text-center border-b-2 border-neutral-900 pb-6 mb-8">
              {personalData.photo && (
                <img src={personalData.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4 border border-neutral-200 print:border-none" />
              )}
              <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">{personalData.fullName || 'Your Name'}</h1>
              <h2 className="text-lg text-neutral-600 italic mb-4">{personalData.jobTitle}</h2>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-700">
                {personalData.email && <span>{personalData.email}</span>}
                {personalData.phone && <span>• {personalData.phone}</span>}
                {personalData.location && <span>• {personalData.location}</span>}
              </div>
            </header>
            
            <div className="flex-1 flex flex-col gap-6">
              {education.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-4 border-b border-neutral-300 pb-1">
                    Education
                  </h3>
                  <div className="flex flex-col gap-4">
                    {education.map(edu => (
                      <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                          <div className="font-bold text-neutral-900">{edu.degree}</div>
                          <div className="italic text-neutral-700 text-sm">{edu.college}</div>
                        </div>
                        <div className="text-sm text-neutral-500 font-medium whitespace-nowrap ml-4">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {sections.map((section) => (
                <section key={section.id}>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-2 border-b border-neutral-300 pb-1">
                    {section.heading || 'Untitled Section'}
                  </h3>
                  <div className="flex flex-col gap-2 mt-3">
                    {section.items.map(item => (
                      <div 
                        key={item.id} 
                        className="text-sm leading-relaxed text-neutral-800"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className="font-sans w-full max-w-[210mm] min-h-[297mm] bg-white mx-auto box-border flex text-neutral-900 shadow-2xl print:shadow-none print:w-[210mm] print:h-[297mm] print:p-0 overflow-hidden">
            <div className="w-1/3 bg-neutral-100 p-8 flex flex-col gap-8 print:bg-neutral-100 print:color-adjust-exact" style={{ WebkitPrintColorAdjust: 'exact' }}>
              <div className="flex flex-col items-center text-center mt-4">
                {personalData.photo && (
                  <img src={personalData.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm mb-4" />
                )}
                <h1 className="text-2xl font-bold tracking-tight mb-1 leading-tight">{personalData.fullName || 'Your Name'}</h1>
                <h2 className="text-sm text-neutral-500 font-medium">{personalData.jobTitle}</h2>
              </div>
              <div className="flex flex-col gap-3 text-sm text-neutral-600">
                {personalData.email && <div><strong className="block text-xs uppercase text-neutral-400">Email</strong>{personalData.email}</div>}
                {personalData.phone && <div><strong className="block text-xs uppercase text-neutral-400">Phone</strong>{personalData.phone}</div>}
                {personalData.location && <div><strong className="block text-xs uppercase text-neutral-400">Location</strong>{personalData.location}</div>}
              </div>
            </div>
            
            <div className="w-2/3 p-8 pt-12 flex flex-col gap-8 bg-white">
              {education.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 text-blue-900">
                    Education
                  </h3>
                  <div className="flex flex-col gap-5">
                    {education.map(edu => (
                      <div key={edu.id} className="relative pl-4 border-l-2 border-neutral-200">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-900"></div>
                        <div className="font-bold text-neutral-900">{edu.degree}</div>
                        <div className="text-neutral-700 text-sm mt-0.5">{edu.college}</div>
                        <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {sections.map((section) => (
                <section key={section.id}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3 text-blue-900">
                    {section.heading || 'Untitled Section'}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {section.items.map(item => (
                      <div 
                        key={item.id} 
                        className="text-sm leading-relaxed text-neutral-700"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        );

      case 'minimal':
      default:
        return (
          <div className="font-sans w-full max-w-[210mm] min-h-[297mm] bg-white p-12 mx-auto box-border flex flex-col text-neutral-900 shadow-2xl print:shadow-none print:w-[210mm] print:h-[297mm] print:p-0">
            <header className="flex items-center gap-6 border-b-[1px] border-neutral-200 pb-8 mb-8">
              {personalData.photo && (
                <img src={personalData.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-neutral-100 print:border-none" />
              )}
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 mb-1">{personalData.fullName || 'Your Name'}</h1>
                <h2 className="text-lg text-neutral-500 font-medium tracking-wide mb-3">{personalData.jobTitle}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                  {personalData.email && <span>{personalData.email}</span>}
                  {personalData.phone && <span>• {personalData.phone}</span>}
                  {personalData.location && <span>• {personalData.location}</span>}
                </div>
              </div>
            </header>
            
            <div className="flex-1 flex flex-col gap-8">
              {education.length > 0 && (
                <section className="flex gap-6">
                  <h3 className="w-1/4 text-xs font-bold uppercase tracking-widest text-neutral-400 pt-1 shrink-0">
                    Education
                  </h3>
                  <div className="w-3/4 flex flex-col gap-5">
                    {education.map(edu => (
                      <div key={edu.id} className="flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-neutral-900">{edu.degree}</span>
                          <span className="text-xs text-neutral-400 font-medium">{edu.year}</span>
                        </div>
                        <span className="text-sm text-neutral-600">{edu.college}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {sections.map((section) => (
                <section key={section.id} className="flex gap-6">
                  <h3 className="w-1/4 text-xs font-bold uppercase tracking-widest text-neutral-400 pt-1 shrink-0">
                    {section.heading || 'Untitled'}
                  </h3>
                  <div className="w-3/4 flex flex-col gap-2">
                    {section.items.map(item => (
                      <div 
                        key={item.id} 
                        className="text-sm leading-relaxed text-neutral-700"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-neutral-100 font-sans print:h-auto print:bg-white text-neutral-900">
      {/* Left Sidebar */}
      <div className="w-[440px] bg-white border-r border-neutral-200 flex flex-col print:hidden shadow-xl z-10 shrink-0">
        <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <h1 className="text-lg font-semibold tracking-tight">Resume Builder</h1>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium cursor-pointer"
          >
            <Download size={16} />
            PDF
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <LayoutTemplate size={16} className="text-neutral-400" />
                <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Choose Design</h2>
             </div>
             <div className="grid grid-cols-3 gap-2">
               {['minimal', 'classic', 'modern'].map((t) => (
                 <button
                   key={t}
                   onClick={() => setTemplate(t)}
                   className={`px-2 py-3 text-xs font-medium rounded-md capitalize transition-all border ${
                     template === t 
                       ? 'bg-neutral-900 text-white border-neutral-900 shadow-md' 
                       : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                   }`}
                 >
                   {t}
                 </button>
               ))}
             </div>
          </section>

          <hr className="border-neutral-100" />

          {/* Personal Details */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Personal Details</h2>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-dashed border-neutral-300 hover:border-neutral-500 cursor-pointer bg-neutral-50 overflow-hidden group relative">
                {personalData.photo ? (
                  <>
                     <img src={personalData.photo} alt="Profile" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={16} className="text-white" />
                     </div>
                  </>
                ) : (
                  <Camera size={20} className="text-neutral-400" />
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              <div className="text-sm text-neutral-500">Upload Photo</div>
            </div>

            {['fullName', 'jobTitle', 'email', 'phone', 'location'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-medium text-neutral-500 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  name={field}
                  value={personalData[field]}
                  onChange={handlePersonalChange}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm transition-all"
                />
              </div>
            ))}
          </section>

          <hr className="border-neutral-100" />

          {/* Education Form */}
          <section>
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-neutral-400" />
                  <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Education</h2>
                </div>
                <button onClick={addEducation} className="text-neutral-500 hover:text-neutral-900 transition-colors p-1 cursor-pointer">
                  <Plus size={16} />
                </button>
             </div>
            
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg relative group/edu shadow-sm space-y-3">
                  <button 
                    onClick={() => removeEducation(edu.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white border border-neutral-200 rounded-full text-red-500 opacity-0 group-hover/edu:opacity-100 transition-opacity shadow-sm hover:bg-red-50 cursor-pointer z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <div>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-semibold"
                      placeholder="Degree or Course"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={edu.college}
                      onChange={(e) => updateEducation(edu.id, 'college', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                      placeholder="College or University"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                      placeholder="Year (e.g. 2018 - 2022)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-neutral-100" />

          {/* Dynamic Content Sections Form */}
          <section>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Content Sections</h2>
                <button onClick={addSection} className="text-neutral-500 hover:text-neutral-900 transition-colors p-1 cursor-pointer">
                  <Plus size={16} />
                </button>
             </div>
            
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.id} className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg relative group/section shadow-sm">
                  <button 
                    onClick={() => removeSection(section.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-white border border-neutral-200 rounded-full text-red-500 opacity-0 group-hover/section:opacity-100 transition-opacity shadow-sm hover:bg-red-50 cursor-pointer z-10"
                    title="Delete entire section"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => handleSectionHeadingChange(section.id, e.target.value)}
                    className="w-full px-0 py-1 bg-transparent border-b border-neutral-300 focus:border-neutral-900 focus:outline-none text-sm font-bold mb-4 transition-colors"
                    placeholder="Section Heading"
                  />
                  
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div key={item.id} className="relative flex gap-2 items-start group/item">
                        <div className="flex-1">
                          <RichTextEditor 
                            value={item.text} 
                            onChange={(html) => updateSectionItem(section.id, item.id, 'text', html)} 
                            placeholder="Add content... Highlight text to format."
                          />
                        </div>
                        <div className="flex flex-col shrink-0 mt-1">
                          <button
                            onClick={() => removeSectionItem(section.id, item.id)}
                            className="p-1.5 bg-white border border-neutral-200 rounded-md text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-50"
                            title="Remove Block"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => addSectionItem(section.id)} 
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium pt-1 w-fit"
                    >
                      <Plus size={14} /> Add Content Block
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Right Canvas */}
      <div className="flex-1 overflow-y-auto bg-neutral-200 print:bg-white print:overflow-visible flex justify-center p-8 print:p-0">
        {renderTemplate()}
      </div>
    </div>
  );
}
