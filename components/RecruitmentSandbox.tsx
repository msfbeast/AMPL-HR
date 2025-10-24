
import React, { useState, useCallback } from 'react';
import { generateHiringKit, generateOnboardingPlan, analyzeResume } from '../services/geminiService';
import type { HiringKit, OnboardingPlan, ResumeAnalysis } from '../types';
import { ClipboardIcon, ClipboardCheckIcon, SparklesIcon, BookUserIcon, MailIcon, FileTextIcon, CalendarCheckIcon, UserSearchIcon } from './icons';

type ActiveTab = 'jd' | 'scorecard' | 'emails' | 'onboarding' | 'screener';
type SeniorityLevel = 'Junior' | 'Mid-Level' | 'Senior';

const contentResearcherTemplate = `Role: Content Researcher for Trakin Tech

Responsibilities:
- Deeply research upcoming smartphones, gadgets, and tech trends, with a strong focus on the Indian market.
- Track tech news, product launches, and rumors to identify compelling video topics.
- Create detailed research documents and fact-sheets for the script writers and on-screen talent.
- Compare product specifications and market positioning to find unique angles for our videos.
- Monitor viewer comments and community forums to understand audience interest and questions.

Requirements:
- Proven experience as a tech researcher or journalist.
- Obsessive knowledge of the current tech landscape, especially mobile technology.
- Ability to synthesize large amounts of information into concise, accurate summaries.
- Excellent English writing skills.
- Familiarity with the YouTube tech community.`;

const videographerTemplate = `Role: Videographer for Trakin Tech

Responsibilities:
- Shoot high-quality product b-roll, unboxings, and presenter segments (A-roll) in our studio.
- Set up and manage lighting, audio, and camera equipment (e.g., Sony FX series, gimbals, sliders).
- Collaborate with the creative team to develop a visually engaging style for each video.
- Ensure all footage is captured in the correct format and is well-organized for the editing team.
- Occasionally shoot on-location for events or special segments.

Requirements:
- 3+ years of professional videography experience, preferably for digital content.
- Expertise with professional cinema cameras, lighting techniques, and audio recording.
- A strong portfolio showcasing clean, modern product videography.
- Ability to work efficiently in a fast-paced, deadline-driven environment.`;

const videoEditorTemplate = `Role: Video Editor for Trakin Tech

Responsibilities:
- Edit videos in a fast-paced style suitable for YouTube, focusing on high audience retention.
- Work with Adobe Premiere Pro and After Effects to assemble footage, add graphics, color grade, and mix audio.
- Incorporate motion graphics, text overlays, and sound effects to create dynamic and informative videos.
- Adhere to the Trakin Tech brand style and tight deadlines.
- Collaborate with researchers and scriptwriters to ensure the final video is accurate and tells a compelling story.

Requirements:
- 4+ years of experience editing for YouTube or other digital platforms.
- Advanced proficiency in Adobe Premiere Pro and After Effects.
- A strong understanding of pacing, storytelling, and what makes a tech video successful on YouTube.
- Portfolio demonstrating high-quality, fast-paced edits.`;

const scriptWriterTemplate = `Role: Script Writer for Trakin Tech

Responsibilities:
- Write clear, concise, and engaging video scripts based on research documents.
- Translate complex technical information into easy-to-understand language for a broad audience.
- Write in a conversational style that matches our on-screen talent's voice (primarily in a mix of Hindi and English - "Hinglish").
- Collaborate with the research team to ensure technical accuracy.
- Structure scripts for optimal viewer engagement and retention on YouTube.

Requirements:
- Proven experience in scriptwriting for video content, preferably in the tech niche.
- Fluent in both Hindi and English, with an exceptional ability to write in conversational Hinglish.
- Ability to simplify complex topics without losing important details.
- A portfolio of written scripts or links to published videos.`;


const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <ClipboardCheckIcon className="h-5 w-5 text-green-400" />
      ) : (
        <ClipboardIcon className="h-5 w-5 text-zinc-400" />
      )}
    </button>
  );
};

const RecruitmentSandbox: React.FC = () => {
  const [companyContext, setCompanyContext] = useState(
    'We are Trakin Tech, a leading Indian YouTube channel focused on technology. We create high-quality, engaging videos including reviews, comparisons, and news about the latest gadgets, especially for the Indian market. Our tone is energetic, informative, and authentic. Our culture is fast-paced, creative, and collaborative, with a strong emphasis on staying ahead of tech trends.'
  );
  const [notes, setNotes] = useState('');
  const [seniority, setSeniority] = useState<SeniorityLevel>('Mid-Level');
  const [loading, setLoading] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [result, setResult] = useState<HiringKit | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('jd');

  const [resumeText, setResumeText] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);

  const handleGenerateKit = async () => {
    if (!notes.trim() || !companyContext.trim()) {
      setError('Please ensure both Company Context and Job Notes are filled out.');
      return;
    }
    setLoading(true);
    setError(null);
    setOnboardingError(null);
    setResult(null);
    setAnalysisResult(null);
    setResumeText('');
    setAnalysisError(null);


    try {
      const generatedKit = await generateHiringKit(notes, companyContext, seniority);
      setResult(generatedKit);
      setActiveTab('jd');
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOnboarding = async () => {
    if (!result || !result.jobDescription) return;

    setOnboardingLoading(true);
    setOnboardingError(null);
    try {
        const plan = await generateOnboardingPlan(result.jobDescription, companyContext);
        setResult(prev => prev ? { ...prev, onboardingPlan: plan } : null);
        setActiveTab('onboarding');
    } catch (e: any) {
        setOnboardingError(e.message || 'An unknown error occurred.');
    } finally {
        setOnboardingLoading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim() || !result) {
      setAnalysisError('Please paste the resume text to analyze.');
      return;
    }
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const generatedAnalysis = await analyzeResume(
        resumeText,
        result.jobDescription,
        result.interviewScorecard
      );
      setAnalysisResult(generatedAnalysis);
    } catch (e: any) {
      setAnalysisError(e.message || 'An unknown error occurred during analysis.');
    } finally {
      setAnalysisLoading(false);
    }
  };


  const TabButton: React.FC<{
    tabId: ActiveTab;
    currentTab: ActiveTab;
    onClick: (tabId: ActiveTab) => void;
    children: React.ReactNode;
  }> = ({ tabId, currentTab, onClick, children }) => (
    <button
      onClick={() => onClick(tabId)}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md ${
        currentTab === tabId
          ? 'text-white'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
      }`}
    >
      {children}
    </button>
  );
  
  const SeniorityButton: React.FC<{
    level: SeniorityLevel;
    currentLevel: SeniorityLevel;
    onClick: (level: SeniorityLevel) => void;
    disabled: boolean;
  }> = ({ level, currentLevel, onClick, disabled }) => (
    <button
      type="button"
      onClick={() => onClick(level)}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
        currentLevel === level
          ? 'bg-blue-600 text-white'
          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
      }`}
    >
      {level}
    </button>
  );

  const QuickStartButton: React.FC<{ onClick: () => void; children: React.ReactNode; }> = ({ onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-full hover:bg-zinc-700 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
      disabled={loading || onboardingLoading || analysisLoading}
    >
      {children}
    </button>
  );

  const renderOnboardingPlan = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
        const cleanLine = line.trim().startsWith('- ') ? line.trim().substring(2) : line.trim();
        const html = cleanLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <li key={index} dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  const processSimpleMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-6">
        <div>
            <h2 className="text-xl font-bold mb-2 text-blue-400">1. Company Context</h2>
            <p className="text-zinc-400 mb-4 text-sm">
              This context is used to tailor all generated content. It's pre-filled for Trakin Tech, but you can edit it.
            </p>
            <textarea
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              placeholder="e.g., We are a media house focused on..."
              className="w-full h-24 p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-shadow text-zinc-200 resize-y"
              disabled={loading || onboardingLoading || analysisLoading}
            />
        </div>
        <div>
            <h2 className="text-xl font-bold mb-2 text-blue-400">2. Quick Start</h2>
            <p className="text-zinc-400 mb-4 text-sm">
              Select a common role to populate the notes with a detailed template for Trakin Tech.
            </p>
            <div className="flex flex-wrap gap-3">
                <QuickStartButton onClick={() => setNotes(contentResearcherTemplate)}>Content Researcher</QuickStartButton>
                <QuickStartButton onClick={() => setNotes(videographerTemplate)}>Videographer</QuickStartButton>
                <QuickStartButton onClick={() => setNotes(videoEditorTemplate)}>Video Editor</QuickStartButton>
                <QuickStartButton onClick={() => setNotes(scriptWriterTemplate)}>Script Writer (Hindi/English)</QuickStartButton>
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold mb-2 text-blue-400">3. Select Seniority Level</h2>
            <p className="text-zinc-400 mb-4 text-sm">
                Choose the experience level for the role. This will adjust the requirements, responsibilities, and interview questions.
            </p>
            <div className="flex items-center gap-2 p-1 bg-zinc-950 rounded-lg w-fit">
                <SeniorityButton level="Junior" currentLevel={seniority} onClick={setSeniority} disabled={loading || onboardingLoading || analysisLoading} />
                <SeniorityButton level="Mid-Level" currentLevel={seniority} onClick={setSeniority} disabled={loading || onboardingLoading || analysisLoading} />
                <SeniorityButton level="Senior" currentLevel={seniority} onClick={setSeniority} disabled={loading || onboardingLoading || analysisLoading} />
            </div>
        </div>
         <div>
            <h2 className="text-xl font-bold mb-2 text-blue-400">4. Input Job Notes</h2>
            <p className="text-zinc-400 mb-4 text-sm">
              Use a quick start template above, or enter raw notes, keywords, or a rough draft of the job role below.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Social Media Manager, focus on YouTube community, shorts, and Instagram reels..."
              className="w-full h-40 p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-shadow text-zinc-200 resize-y"
              disabled={loading || onboardingLoading || analysisLoading}
            />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start pt-2">
            <button
            onClick={handleGenerateKit}
            disabled={loading || onboardingLoading || analysisLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-blue-500"
            >
            {loading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Hiring Kit...
                </>
            ) : (
                <>
                <SparklesIcon className="h-5 w-5" />
                Generate Hiring Kit
                </>
            )}
            </button>
            {result && !result.onboardingPlan && (
                <button
                onClick={handleGenerateOnboarding}
                disabled={onboardingLoading || loading || analysisLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-500/50 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-green-500"
                >
                {onboardingLoading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Plan...
                    </>
                ) : (
                    <>
                    <CalendarCheckIcon className="h-5 w-5" />
                    Generate Onboarding Plan
                    </>
                )}
                </button>
            )}
        </div>

        {error && <p className="mt-4 text-red-400 bg-red-950/50 p-3 rounded-md border border-red-500/20">{error}</p>}
        {onboardingError && <p className="mt-4 text-red-400 bg-red-950/50 p-3 rounded-md border border-red-500/20">{onboardingError}</p>}
      </div>

      {result && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="p-2 border-b border-zinc-800">
            <nav className="flex items-center space-x-2 overflow-x-auto">
                <div className="relative flex items-center space-x-2">
                    <TabButton tabId="jd" currentTab={activeTab} onClick={setActiveTab}>
                        <FileTextIcon className="h-5 w-5" />
                        <span>Job Description</span>
                    </TabButton>
                    <TabButton tabId="scorecard" currentTab={activeTab} onClick={setActiveTab}>
                        <BookUserIcon className="h-5 w-5" />
                        <span>Interview Scorecard</span>
                    </TabButton>
                    <TabButton tabId="emails" currentTab={activeTab} onClick={setActiveTab}>
                        <MailIcon className="h-5 w-5" />
                        <span>Email Templates</span>
                    </TabButton>
                    {result.onboardingPlan && (
                        <TabButton tabId="onboarding" currentTab={activeTab} onClick={setActiveTab}>
                            <CalendarCheckIcon className="h-5 w-5" />
                            <span>Onboarding Plan</span>
                        </TabButton>
                    )}
                    <TabButton tabId="screener" currentTab={activeTab} onClick={setActiveTab}>
                        <UserSearchIcon className="h-5 w-5" />
                        <span>Candidate Screener</span>
                    </TabButton>
                    <div
                        className="absolute bottom-[-9px] h-0.5 bg-blue-500 transition-all duration-300"
                        style={{
                            left: `${['jd', 'scorecard', 'emails', 'onboarding', 'screener'].indexOf(activeTab) * (180)}px`, // Approximate width
                            width: activeTab === 'jd' ? '150px' : activeTab === 'scorecard' ? '180px' : activeTab === 'emails' ? '160px' : activeTab === 'onboarding' ? '165px' : '180px' // Dynamic width based on tab
                        }}
                    />
                </div>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'jd' && (
              <div className="relative">
                <CopyButton textToCopy={result.jobDescription} />
                 <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-zinc-300" dangerouslySetInnerHTML={{ __html: result.jobDescription.replace(/#+\s*(.*)/g, '<h3 class="text-zinc-100">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/-\s*(.*)/g, '<li>$1</li>').replace(/\n/g, '<br/>') }}>
                </div>
              </div>
            )}
            {activeTab === 'scorecard' && (
              <div className="space-y-6 relative">
                 <CopyButton textToCopy={
                    result.interviewScorecard.map(item => 
                        `Competency: ${item.competency}\n\n` +
                        `Questions:\n${item.questions.map(q => `- ${q}`).join('\n')}\n\n` +
                        `Scoring Rubric:\n` +
                        `  - Weak: ${item.scoringRubric.weak}\n` +
                        `  - Average: ${item.scoringRubric.average}\n` +
                        `  - Strong: ${item.scoringRubric.strong}\n`
                    ).join('\n\n---\n\n')
                 } />
                 {result.interviewScorecard.map((item, index) => (
                    <div key={index} className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                        <h4 className="text-lg font-bold text-blue-400 mb-3">{item.competency}</h4>
                        <div className="space-y-4">
                            <div>
                                <h5 className="font-semibold text-zinc-200 mb-2">Questions:</h5>
                                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                    {item.questions.map((q, qIndex) => <li key={qIndex}>{q}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-semibold text-zinc-200 mb-2">Scoring Rubric:</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                    <div className="bg-red-950/30 p-3 rounded-lg border border-red-500/20"><strong className="text-red-400 block mb-1">Weak</strong><span className="text-zinc-400" dangerouslySetInnerHTML={{ __html: item.scoringRubric.weak.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>
                                    <div className="bg-yellow-950/30 p-3 rounded-lg border border-yellow-500/20"><strong className="text-yellow-400 block mb-1">Average</strong><span className="text-zinc-400" dangerouslySetInnerHTML={{ __html: item.scoringRubric.average.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>
                                    <div className="bg-green-950/30 p-3 rounded-lg border border-green-500/20"><strong className="text-green-400 block mb-1">Strong</strong><span className="text-zinc-400" dangerouslySetInnerHTML={{ __html: item.scoringRubric.strong.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                 ))}
              </div>
            )}
            {activeTab === 'emails' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 relative">
                        <CopyButton textToCopy={result.emailTemplates.nextSteps} />
                        <h4 className="text-lg font-bold text-green-400 mb-3">Next Steps Email</h4>
                        <p className="text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: processSimpleMarkdown(result.emailTemplates.nextSteps) }} />
                    </div>
                    <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 relative">
                        <CopyButton textToCopy={result.emailTemplates.rejection} />
                        <h4 className="text-lg font-bold text-red-400 mb-3">Rejection Email</h4>
                        <p className="text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: processSimpleMarkdown(result.emailTemplates.rejection) }} />
                    </div>
                </div>
            )}
{/* Fix: Corrected typo in variable name */}
             {activeTab === 'onboarding' && result.onboardingPlan && (
                <div className="space-y-6 relative">
                    <CopyButton textToCopy={
                        `First 30 Days:\n${result.onboardingPlan.day30}\n\n` +
                        `Days 31-60:\n${result.onboardingPlan.day60}\n\n` +
                        `Days 61-90:\n${result.onboardingPlan.day90}`
                    } />
                     <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                        <h4 className="text-lg font-bold text-blue-400 mb-3">First 30 Days (Learning)</h4>
                        <ul className="list-disc list-outside pl-5 space-y-2 text-zinc-300">{renderOnboardingPlan(result.onboardingPlan.day30)}</ul>
                    </div>
                    <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                        <h4 className="text-lg font-bold text-blue-400 mb-3">Days 31-60 (Contributing)</h4>
                        <ul className="list-disc list-outside pl-5 space-y-2 text-zinc-300">{renderOnboardingPlan(result.onboardingPlan.day60)}</ul>
                    </div>
                     <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                        <h4 className="text-lg font-bold text-blue-400 mb-3">Days 61-90 (Owning)</h4>
                        <ul className="list-disc list-outside pl-5 space-y-2 text-zinc-300">{renderOnboardingPlan(result.onboardingPlan.day90)}</ul>
                    </div>
                </div>
             )}
             {activeTab === 'screener' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-2">Analyze Candidate Resume</h3>
                        <p className="text-zinc-400 mb-4 text-sm">Paste the candidate's full resume text below to analyze it against the generated job description and scorecard.</p>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste resume text here..."
                            className="w-full h-48 p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-shadow text-zinc-200 resize-y"
                            disabled={analysisLoading}
                        />
                    </div>
                    <button
                        onClick={handleAnalyzeResume}
                        disabled={analysisLoading || !resumeText.trim()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-blue-500"
                        >
                        {analysisLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <UserSearchIcon className="h-5 w-5" />
                                Analyze Resume
                            </>
                        )}
                    </button>
                    {analysisError && <p className="mt-4 text-red-400 bg-red-950/50 p-3 rounded-md border border-red-500/20">{analysisError}</p>}
                    
                    {analysisResult && (
                        <div className="mt-6 pt-6 border-t border-zinc-800 space-y-6">
                            <div>
                                <h4 className="text-lg font-bold text-blue-400 mb-2">At-a-Glance Summary</h4>
                                <p className="text-zinc-300 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">{analysisResult.summary}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-blue-400 mb-3">Competency Match</h4>
                                <div className="space-y-4">
                                    {analysisResult.competencyMatches.map((item, index) => (
                                    <div key={index} className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                                        <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-semibold text-zinc-200">{item.competency}</h5>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                            item.match === 'Strong Match' ? 'bg-green-500/10 text-green-400' :
                                            item.match === 'Good Match' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                            {item.match}
                                        </span>
                                        </div>
                                        <p className="text-sm text-zinc-400 italic">"{item.evidence}"</p>
                                    </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-blue-400 mb-2">Suggested Interview Questions</h4>
                                <ul className="list-disc list-outside pl-5 space-y-2 text-zinc-300">
                                    {analysisResult.suggestedQuestions.map((q, index) => <li key={index}>{q}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentSandbox;
