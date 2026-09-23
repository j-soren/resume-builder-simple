import React, { useState } from 'react';
import { Download, Plus, Trash2, Upload, Camera, LayoutTemplate, Bold } from 'lucide-react';

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

  // Updated state structure: sections now hold an array of 'items'
  const [sections, setSections] = useState([
    {
      id: crypto.randomUUID(),
      heading: 'Professional Summary',
      items: [
        { id: crypto.randomUUID(), text: 'A highly motivated professional looking to leverage strong operational skills in a dynamic environment.', isBold: false }
      ]
    },
    {
      id: crypto.randomUUID(),
      heading: 'Experience',
      items: [
        { id: crypto.randomUUID(), text: 'Company Name - Role', isBold: true },
        { id: crypto.randomUUID(), text: '• Key achievement or responsibility...\n• Another key achievement...', isBold: false }
      ]
    }
  ]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionHeadingChange = (id, value) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, heading: value } : sec))
    );
  };

  const addSection = () => {
    setSections([...sections, { 
      id: crypto.randomUUID(), 
      heading: 'New Section', 
      items: [{ id: crypto.randomUUID(), text: '', isBold: false }] 
    }]);
  };

  const removeSection = (id) => {
    setSections(sections.filter((sec) => sec.id !== id));
  };

  // New item handlers
  const addSectionItem = (sectionId) => {
    setSections((prev) => prev.map((sec) => {
      if (sec.id === sectionId) {
        return { ...sec, items: [...sec.items, { id: crypto.randomUUID(), text: '', isBold: false }] };
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPersonalData((prev) => ({ ...prev, photo: imageUrl }));
    }
  };

  // --- Template Rendering Logic ---
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
              {sections.map((section) => (
                <section key={section.id}>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900 mb-2 border-b border-neutral-300 pb-1">
                    {section.heading || 'Untitled Section'}
                  </h3>
                  <div className="flex flex-col gap-2 mt-3">
                    {section.items.map(item => (
                      <div key={item.id} className={`text-sm leading-relaxed whitespace-pre-wrap ${item.isBold ? 'font-bold text-neutral-900' : 'text-neutral-800'}`}>
                        {item.text}
                      </div>
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
              {sections.map((section) => (
                <section key={section.id}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3 text-blue-900">
                    {section.heading || 'Untitled Section'}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {section.items.map(item => (
                      <div key={item.id} className={`text-sm leading-relaxed whitespace-pre-wrap ${item.isBold ? 'font-bold text-neutral-900' : 'text-neutral-700'}`}>
                        {item.text}
                      </div>
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
              {sections.map((section) => (
                <section key={section.id} className="flex gap-6">
                  <h3 className="w-1/4 text-xs font-bold uppercase tracking-widest text-neutral-400 pt-1 shrink-0">
                    {section.heading || 'Untitled'}
                  </h3>
                  <div className="w-3/4 flex flex-col gap-2">
                    {section.items.map(item => (
                      <div key={item.id} className={`text-sm leading-relaxed whitespace-pre-wrap ${item.isBold ? 'font-bold text-neutral-900' : 'text-neutral-700'}`}>
                        {item.text}
                      </div>
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
      {/* Left Sidebar - Hidden on Print */}
      <div className="w-[420px] bg-white border-r border-neutral-200 flex flex-col print:hidden shadow-xl z-10 shrink-0">
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
                  
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.id} className="relative flex gap-2 items-start group/item">
                        <div className="flex-1">
                          <textarea
                            value={item.text}
                            onChange={(e) => updateSectionItem(section.id, item.id, 'text', e.target.value)}
                            className={`w-full px-3 py-2 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm min-h-[60px] resize-y transition-all ${item.isBold ? 'font-bold' : ''}`}
                            placeholder="Add content..."
                          />
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => updateSectionItem(section.id, item.id, 'isBold', !item.isBold)}
                            className={`p-1.5 rounded-md border transition-colors ${item.isBold ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-100'}`}
                            title="Toggle Bold"
                          >
                            <Bold size={14} />
                          </button>
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
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium pt-2 w-fit"
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

      <div className="flex-1 overflow-y-auto bg-neutral-200 print:bg-white print:overflow-visible flex justify-center p-8 print:p-0">
        {renderTemplate()}
      </div>
    </div>
  );
}
