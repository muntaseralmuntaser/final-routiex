
import React, { useState } from 'react';
import { LanguageCode, Course } from '../types';
import { getTranslation } from '../utils/translations';
import { GraduationCap, PlayCircle, Award, BookOpen, Clock, Users, PenTool, Video, FileText, Glasses, Calculator, Calendar, BarChart, ExternalLink, Box } from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

const MOCK_COURSES: Course[] = [
    { id: '1', title: 'Forex Mastery: Zero to Hero', level: 'Beginner', duration: '12h 30m', students: 1540, progress: 45, image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=300&q=80', instructor: 'Dr. Ahmed', lessons: 24, isEnrolled: true },
    { id: '2', title: 'SMC Institutional Concepts', level: 'Expert', duration: '8h 45m', students: 890, progress: 0, image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=300&q=80', instructor: 'Sarah J.', lessons: 12, isEnrolled: false, price: 199 },
];

export const EducationHub: React.FC<Props> = ({ lang }) => {
    const [activeTab, setActiveTab] = useState<'courses' | 'vr' | 'tools'>('courses');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    return (
        <div className="flex flex-col h-full bg-[#050508] p-6 space-y-6 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-end bg-[#0f111a] p-8 rounded-2xl border border-[#1e2235] shadow-lg">
                <div>
                    <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                        <GraduationCap size={32} className="text-terminal-accent" />
                        Routiex Academy
                    </h2>
                    <p className="text-sm text-gray-400 max-w-lg">Advanced institutional trading education with VR simulation and pro tools.</p>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => setActiveTab('courses')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-terminal-accent text-black shadow-lg shadow-terminal-accent/20' : 'bg-[#1e2235] text-gray-400 hover:text-white'}`}>Courses</button>
                     <button onClick={() => setActiveTab('vr')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'vr' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-[#1e2235] text-gray-400 hover:text-white'}`}>VR Room</button>
                     <button onClick={() => setActiveTab('tools')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'tools' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-[#1e2235] text-gray-400 hover:text-white'}`}>Tools</button>
                </div>
            </div>

            {/* --- COURSES TAB --- */}
            {activeTab === 'courses' && (
                selectedCourse ? (
                    <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right">
                        <button onClick={() => setSelectedCourse(null)} className="text-gray-400 hover:text-white text-sm font-bold w-fit">&larr; Back to Library</button>
                        <div className="aspect-video w-full bg-black rounded-xl border border-[#1e2235] relative flex items-center justify-center">
                            <PlayCircle size={64} className="text-white opacity-50" />
                            <div className="absolute bottom-4 left-4 right-4 bg-black/80 p-4 rounded-lg">
                                <h3 className="font-bold text-white text-lg">{selectedCourse.title} - Lesson 1</h3>
                                <div className="w-full bg-[#333] h-1 rounded-full mt-2"><div className="w-[10%] h-full bg-terminal-accent rounded-full"></div></div>
                            </div>
                        </div>
                        <div className="bg-[#0f111a] p-6 rounded-xl border border-[#1e2235]">
                             <h3 className="font-bold text-white text-lg mb-4">Course Content</h3>
                             {[1,2,3,4,5].map(i => (
                                 <div key={i} className="flex items-center justify-between p-3 border-b border-[#1e2235] hover:bg-[#1e2235] cursor-pointer rounded">
                                     <div className="flex items-center gap-3">
                                         <div className="w-6 h-6 rounded-full bg-[#1e2235] flex items-center justify-center text-xs text-gray-500">{i}</div>
                                         <span className="text-sm text-gray-300">Introduction to Market Structure</span>
                                     </div>
                                     <span className="text-xs text-gray-500">15:00</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
                        {MOCK_COURSES.map(course => (
                            <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden group hover:border-terminal-accent transition-all cursor-pointer">
                                <div className="aspect-video relative overflow-hidden">
                                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle size={48} className="text-white" />
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-white text-lg mb-2">{course.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                                        <span className="flex items-center gap-1"><Users size={12} /> {course.students}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e2235]">
                                        <div className="flex items-center gap-2 text-xs text-terminal-accent">
                                            <Award size={14} /> Certified
                                        </div>
                                        {course.isEnrolled ? (
                                            <span className="text-xs font-bold text-green-500">Continue</span>
                                        ) : (
                                            <span className="text-xs font-bold text-white bg-terminal-accent/10 px-2 py-1 rounded">${course.price}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* --- VR TAB --- */}
            {activeTab === 'vr' && (
                <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in">
                    <div className="w-full max-w-4xl aspect-[21/9] bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center mb-8 group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=1600')] bg-cover opacity-50 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative z-10 p-8 bg-black/60 backdrop-blur-sm rounded-2xl border border-white/10">
                            <Glasses size={64} className="text-white mx-auto mb-4" />
                            <h2 className="text-4xl font-black text-white mb-2">METAVERSE TRADING FLOOR</h2>
                            <p className="text-gray-300 mb-6">Connect your Oculus or Vision Pro to trade in a virtual Wall Street environment.</p>
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                                Launch VR Experience
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
                        <div className="bg-[#0f111a] p-4 rounded-xl border border-[#1e2235] text-left">
                            <h3 className="font-bold text-white">3D Charts</h3>
                            <p className="text-xs text-gray-500 mt-1">Manipulate price action in 3D space.</p>
                        </div>
                        <div className="bg-[#0f111a] p-4 rounded-xl border border-[#1e2235] text-left">
                            <h3 className="font-bold text-white">Voice Trading</h3>
                            <p className="text-xs text-gray-500 mt-1">Execute orders with voice commands.</p>
                        </div>
                        <div className="bg-[#0f111a] p-4 rounded-xl border border-[#1e2235] text-left">
                            <h3 className="font-bold text-white">Avatar Social</h3>
                            <p className="text-xs text-gray-500 mt-1">Meet other traders in the virtual lobby.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TOOLS TAB --- */}
            {activeTab === 'tools' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in">
                    {[
                        { name: 'Position Calculator', icon: Calculator, color: 'text-blue-500' },
                        { name: 'Economic Calendar', icon: Calendar, color: 'text-green-500' },
                        { name: 'Correlation Matrix', icon: BarChart, color: 'text-purple-500' },
                        { name: 'Fibonacci Tool', icon: Box, color: 'text-yellow-500' },
                        { name: 'Trading Plan PDF', icon: FileText, color: 'text-red-500' },
                    ].map((tool, i) => (
                        <div key={i} className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-terminal-accent transition-all cursor-pointer group">
                            <div className={`p-4 bg-[#1a1a1a] rounded-full group-hover:scale-110 transition-transform ${tool.color}`}>
                                <tool.icon size={32} />
                            </div>
                            <h3 className="font-bold text-white text-sm">{tool.name}</h3>
                            <div className="text-xs text-terminal-accent flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Open Tool <ExternalLink size={10} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
