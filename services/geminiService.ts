
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { HiringKit, OnboardingPlan, ResumeAnalysis, ScorecardItem } from '../types';

// Get API key from environment with fallbacks
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || (window as any).GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("API_KEY or GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const hiringKitSchema = {
  type: Type.OBJECT,
  properties: {
    jobDescription: {
      type: Type.STRING,
      description: "A complete, candidate-friendly job description for LinkedIn. Use markdown for headings and bullets. Include sections like 'What You'll Do', 'What We're Looking For', and 'Why You'll Love Trakin Tech'."
    },
    interviewScorecard: {
      type: Type.ARRAY,
      description: "An array of 3-5 core competencies for the role. Each competency should have 2-3 tailored behavioral interview questions and a scoring rubric.",
      items: {
        type: Type.OBJECT,
        properties: {
          competency: {
            type: Type.STRING,
            description: "A core competency required for the role (e.g., 'Video Editing Mastery', 'Creative Storytelling')."
          },
          questions: {
            type: Type.ARRAY,
            description: "An array of 2-3 behavioral questions to assess this competency.",
            items: { type: Type.STRING }
          },
          scoringRubric: {
            type: Type.OBJECT,
            description: "Criteria for evaluating a candidate's response.",
            properties: {
              weak: {
                type: Type.STRING,
                description: "Description of a weak or unsatisfactory answer."
              },
              average: {
                type: Type.STRING,
                description: "Description of an average or satisfactory answer."
              },
              strong: {
                type: Type.STRING,
                description: "Description of a strong or excellent answer."
              }
            },
            required: ['weak', 'average', 'strong']
          }
        },
        required: ['competency', 'questions', 'scoringRubric']
      }
    },
    emailTemplates: {
      type: Type.OBJECT,
      description: "Professional and candidate-friendly email templates.",
      properties: {
        nextSteps: {
          type: Type.STRING,
          description: "An email template for candidates who are moving on to the next stage. It should be encouraging and clearly state the next steps."
        },
        rejection: {
          type: Type.STRING,
          description: "A respectful and constructive rejection email template for unsuccessful candidates. It should thank them for their time and offer encouragement."
        }
      },
      required: ['nextSteps', 'rejection']
    }
  },
  required: ['jobDescription', 'interviewScorecard', 'emailTemplates']
};


export const generateHiringKit = async (rawNotes: string, companyContext: string, seniority: string): Promise<HiringKit> => {
  try {
    const prompt = `
      You are an expert recruitment strategist for a leading Indian tech YouTube channel, Trakin Tech.
      Here is some context about the company:
      ---
      ${companyContext}
      ---

      Your task is to generate a complete "Hiring Kit" in JSON format based on the company context, raw job notes, and the specified seniority level. The tone should be energetic, authentic, and appealing to an audience passionate about technology.

      **Seniority Level:** ${seniority}

      **Raw Notes:**
      ---
      ${rawNotes}
      ---

      **Instructions:**
      Based on all the provided information, create a Hiring Kit with three components. The seniority level MUST significantly influence the final output:
      1.  **Job Description**: A polished, engaging job description for LinkedIn.
          - For a **'Junior'** role, focus on foundational skills, learning opportunities, and assisting senior members. Requirements should be for ~1-2 years of experience or strong portfolio projects.
          - For a **'Mid-Level'** role, expect solid proficiency, autonomy on tasks, and ~3-5 years of relevant experience.
          - For a **'Senior'** role, emphasize leadership, mentorship, strategic thinking, and complex problem-solving. Require 5+ years of experience and a track record of significant impact.
          - Use markdown headings (e.g., #, ##) and bullet points (-). Include sections like "What You'll Do", "What We're Looking For", and "Why You'll Love Trakin Tech".

      2.  **Interview Scorecard**: Identify 3-5 core competencies. For each competency, create:
          a. 2-3 insightful behavioral interview questions. These questions should vary in complexity based on seniority. Senior-level questions should probe more into strategy, leadership, and handling ambiguity.
          b. A scoring rubric ("Weak", "Average", "Strong"). The expectations for a "Strong" answer must be higher for a senior role.

      3.  **Email Templates**:
          a. **Next Steps Email**: A friendly and professional email for successful candidates.
          b. **Rejection Email**: A respectful, empathetic rejection email for unsuccessful candidates.

      Return the entire Hiring Kit in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: hiringKitSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString) as HiringKit;

    if (!parsed.jobDescription || !Array.isArray(parsed.interviewScorecard) || !parsed.emailTemplates) {
        throw new Error("Invalid response format from API.");
    }
    
    return parsed;

  } catch (error) {
    console.error("Error generating hiring kit:", error);
    throw new Error("Failed to generate content from Gemini API. Please check your input and try again.");
  }
};

const onboardingPlanSchema = {
    type: Type.OBJECT,
    properties: {
        day30: {
            type: Type.STRING,
            description: "A detailed plan for the new hire's first 30 days, focused on learning and integration. Use markdown bullet points."
        },
        day60: {
            type: Type.STRING,
            description: "A detailed plan for the new hire's next 30 days (days 31-60), focused on contribution and taking on initial responsibilities. Use markdown bullet points."
        },
        day90: {
            type: Type.STRING,
            description: "A detailed plan for the new hire's following 30 days (days 61-90), focused on owning projects and demonstrating initiative. Use markdown bullet points."
        },
    },
    required: ['day30', 'day60', 'day90']
};


export const generateOnboardingPlan = async (jobDescription: string, companyContext: string): Promise<OnboardingPlan> => {
    try {
        const prompt = `
        You are an expert HR and Talent Development strategist at Trakin Tech, a leading tech YouTube channel.
        Company Context:
        ---
        ${companyContext}
        ---

        Based on the company context and the detailed job description below, create a comprehensive 30-60-90 day onboarding plan for the new hire. The plan should be structured to set them up for success in a fast-paced content creation environment.

        - **First 30 Days (Focus on Learning):** Goals should revolve around understanding the Trakin Tech brand voice, content workflow, tools, and audience. Include tasks like reviewing top-performing videos, meeting key team members, understanding the style guide, and shadowing a video project from concept to publish.
        - **First 60 Days (Focus on Contributing):** Goals should transition to active participation and contribution. Include tasks like taking on smaller assignments (e.g., editing a segment, researching a topic), collaborating on a full video project, and presenting initial work for feedback.
        - **First 90 Days (Focus on Owning):** Goals should focus on autonomy and initiative. Include tasks like leading a small project (e.g., scripting or editing a video solo), proposing new video ideas or format improvements, and demonstrating mastery of their core responsibilities.

        Use clear markdown bullet points for each section to outline specific, actionable goals.

        Job Description:
        ---
        ${jobDescription}
        ---

        Return the onboarding plan in the specified JSON format.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
                responseMimeType: "application/json",
                responseSchema: onboardingPlanSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString) as OnboardingPlan;
        
        if (!parsed.day30 || !parsed.day60 || !parsed.day90) {
            throw new Error("Invalid response format for onboarding plan from API.");
        }
        
        return parsed;
    } catch (error) {
        console.error("Error generating onboarding plan:", error);
        throw new Error("Failed to generate onboarding plan from Gemini API.");
    }
};

const resumeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "A concise 2-3 sentence summary of the candidate's suitability for the role, based on their resume and the job description."
      },
      competencyMatches: {
        type: Type.ARRAY,
        description: "An array analyzing the candidate's alignment with each core competency from the interview scorecard.",
        items: {
          type: Type.OBJECT,
          properties: {
            competency: {
              type: Type.STRING,
              description: "The core competency being assessed."
            },
            match: {
              type: Type.STRING,
              description: "A rating of the candidate's alignment (e.g., 'Strong Match', 'Good Match', 'Potential Gap')."
            },
            evidence: {
              type: Type.STRING,
              description: "Specific evidence or keywords from the resume that support this rating. Mention missing evidence if it's a gap."
            }
          },
          required: ['competency', 'match', 'evidence']
        }
      },
      suggestedQuestions: {
        type: Type.ARRAY,
        description: "An array of 2-3 tailored interview questions to ask the candidate. These should probe into areas of strength or potential gaps identified in the resume.",
        items: { type: Type.STRING }
      }
    },
    required: ['summary', 'competencyMatches', 'suggestedQuestions']
  };

  export const analyzeResume = async (
    resumeText: string, 
    jobDescription: string, 
    interviewScorecard: ScorecardItem[]
): Promise<ResumeAnalysis> => {
  try {
    const competencies = interviewScorecard.map(item => item.competency).join(', ');
    const prompt = `
      You are an expert HR analyst and recruiter for Trakin Tech, a leading tech YouTube channel. Your task is to analyze a candidate's resume against a specific job description and a set of core competencies. Provide a structured, unbiased analysis in JSON format.

      **Job Description:**
      ---
      ${jobDescription}
      ---

      **Core Competencies for the Role:**
      ---
      ${competencies}
      ---

      **Candidate's Resume:**
      ---
      ${resumeText}
      ---

      **Analysis Instructions:**
      1.  **Summary:** Write a concise 2-3 sentence summary of the candidate's overall fit for the role.
      2.  **Competency Matches:** For each of the core competencies, provide a match rating ('Strong Match', 'Good Match', 'Potential Gap') and cite specific evidence (or lack thereof) from the resume.
      3.  **Suggested Questions:** Generate 2-3 specific, insightful interview questions based on the resume. These questions should be designed to probe deeper into their stated experience or explore potential gaps you've identified.

      Return the complete analysis in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: resumeAnalysisSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString) as ResumeAnalysis;

    if (!parsed.summary || !Array.isArray(parsed.competencyMatches) || !Array.isArray(parsed.suggestedQuestions)) {
        throw new Error("Invalid response format for resume analysis from API.");
    }
    
    return parsed;

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw new Error("Failed to analyze resume with Gemini API. Please check your input and try again.");
  }
};

export const startChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful assistant for Trakin Tech, a leading Indian tech YouTube channel. Your role is to assist with recruitment and content strategy queries.'
        }
    });
}
