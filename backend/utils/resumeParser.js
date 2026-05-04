import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const SKILL_LIBRARY = [
  'javascript',
  'typescript',
  'react',
  'next.js',
  'node.js',
  'express',
  'mongodb',
  'sql',
  'python',
  'java',
  'c++',
  'aws',
  'azure',
  'docker',
  'kubernetes',
  'machine learning',
  'deep learning',
  'nlp',
  'data analysis',
  'pandas',
  'numpy',
  'tensorflow',
  'pytorch',
  'scikit-learn',
  'tableau',
  'power bi',
  'excel',
  'git',
  'rest api',
  'graphql',
  'tailwind',
  'figma',
  'leadership',
  'communication',
  'project management',
  'agile',
  'scrum'
];

export const ROLE_SKILLS = {
  'data scientist': [
    'python',
    'sql',
    'machine learning',
    'pandas',
    'numpy',
    'scikit-learn',
    'tensorflow',
    'statistics',
    'data analysis'
  ],
  'frontend developer': [
    'javascript',
    'typescript',
    'react',
    'next.js',
    'tailwind',
    'html',
    'css',
    'figma'
  ],
  'backend developer': [
    'node.js',
    'express',
    'mongodb',
    'sql',
    'rest api',
    'docker',
    'aws'
  ],
  'full stack developer': [
    'javascript',
    'typescript',
    'react',
    'next.js',
    'node.js',
    'express',
    'mongodb',
    'rest api'
  ],
  'product manager': [
    'project management',
    'agile',
    'scrum',
    'communication',
    'analytics',
    'leadership'
  ]
};

export async function extractTextFromFile(filePath, mimetype) {
  if (mimetype === 'application/pdf') {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

export function parseResumeText(text) {
  const normalized = text.replace(/\r/g, '').replace(/[ \t]+/g, ' ');
  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const email = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const phone =
    normalized.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/)?.[0] ||
    '';
  const name = lines.find((line) => !line.includes('@') && !/\d{3}/.test(line)) || 'Candidate';

  return {
    name,
    email,
    phone,
    skills: extractSkills(normalized),
    education: extractSection(lines, ['education', 'academic']),
    experience: extractSection(lines, ['experience', 'employment', 'work history'])
  };
}

export function analyzeResume(parsed, rawText, jobRole = '') {
  const targetSkills = getRoleSkills(jobRole);
  const lowerSkills = parsed.skills.map((skill) => skill.toLowerCase());
  const matchedTargetSkills = targetSkills.filter((skill) => lowerSkills.includes(skill));
  const missingSkills = targetSkills.filter((skill) => !lowerSkills.includes(skill));

  const keywordScore = targetSkills.length
    ? Math.round((matchedTargetSkills.length / targetSkills.length) * 30)
    : Math.min(30, parsed.skills.length * 3);
  const skillsScore = Math.min(25, parsed.skills.length * 2.5);
  const experienceScore = Math.min(25, parsed.experience.length * 7 + (/\d+\+?\s+years?/i.test(rawText) ? 6 : 0));
  const formattingScore = calculateFormattingScore(rawText);
  const atsScore = Math.min(100, Math.round(keywordScore + skillsScore + experienceScore + formattingScore));
  const jobMatchPercentage = targetSkills.length
    ? Math.round((matchedTargetSkills.length / targetSkills.length) * 100)
    : Math.round(atsScore * 0.82);

  return {
    atsScore,
    scoreBreakdown: {
      keywords: keywordScore,
      skills: Math.round(skillsScore),
      experience: Math.round(experienceScore),
      formatting: formattingScore
    },
    missingSkills,
    suggestions: buildSuggestions(parsed, missingSkills, rawText, formattingScore),
    weakSections: detectWeakSections(parsed, rawText, formattingScore),
    jobMatchPercentage,
    improvedResume: ''
  };
}

export function getRoleSkills(jobRole = '') {
  const role = jobRole.toLowerCase().trim();
  const direct = ROLE_SKILLS[role];
  if (direct) return direct;

  const matchingKey = Object.keys(ROLE_SKILLS).find((key) => role.includes(key) || key.includes(role));
  return matchingKey ? ROLE_SKILLS[matchingKey] : [];
}

function extractSkills(text) {
  const lowerText = text.toLowerCase();
  return SKILL_LIBRARY.filter((skill) => lowerText.includes(skill)).map(titleCase);
}

function extractSection(lines, headings) {
  const startIndex = lines.findIndex((line) =>
    headings.some((heading) => line.toLowerCase().includes(heading))
  );

  if (startIndex === -1) return [];

  const stopHeadings = ['skills', 'projects', 'certifications', 'summary', 'education', 'experience'];
  const section = [];

  for (const line of lines.slice(startIndex + 1)) {
    const lower = line.toLowerCase();
    if (section.length && stopHeadings.some((heading) => lower === heading || lower.startsWith(`${heading}:`))) {
      break;
    }
    if (line.length > 2) section.push(line);
    if (section.length >= 6) break;
  }

  return section;
}

function calculateFormattingScore(text) {
  let score = 8;
  if (/education/i.test(text)) score += 3;
  if (/experience|employment|work history/i.test(text)) score += 3;
  if (/skills/i.test(text)) score += 3;
  if (text.length >= 1200 && text.length <= 7000) score += 3;
  return Math.min(20, score);
}

function buildSuggestions(parsed, missingSkills, rawText, formattingScore) {
  const suggestions = [];

  if (missingSkills.length) {
    suggestions.push(`Add evidence for these role-critical skills: ${missingSkills.slice(0, 6).join(', ')}.`);
  }
  if (parsed.experience.length < 2) {
    suggestions.push('Expand work experience with measurable impact, tools used, and business outcomes.');
  }
  if (!/\d+%|\$\d+|\d+x|\d+\s*(users|customers|projects|hours)/i.test(rawText)) {
    suggestions.push('Add metrics such as percentage improvements, cost savings, users served, or revenue impact.');
  }
  if (formattingScore < 16) {
    suggestions.push('Use clear ATS-friendly headings: Summary, Skills, Experience, Education, and Projects.');
  }
  if (parsed.skills.length < 8) {
    suggestions.push('Create a concise skills section grouped by languages, frameworks, tools, and domain skills.');
  }

  return suggestions.length ? suggestions : ['Resume is well structured. Tailor the summary and keywords for each job post.'];
}

function detectWeakSections(parsed, rawText, formattingScore) {
  const weak = [];
  if (parsed.skills.length < 8) weak.push('Skills');
  if (parsed.experience.length < 2) weak.push('Experience');
  if (parsed.education.length < 1) weak.push('Education');
  if (formattingScore < 16) weak.push('Formatting');
  if (!/summary|profile|objective/i.test(rawText)) weak.push('Professional Summary');
  return weak;
}

function titleCase(value) {
  return value
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
