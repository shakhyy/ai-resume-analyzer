import PDFDocument from 'pdfkit';
import OpenAI from 'openai';
import Resume from '../models/Resume.js';
import {
  analyzeResume,
  extractTextFromFile,
  getRoleSkills,
  parseResumeText
} from '../utils/resumeParser.js';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const jobRole = req.body.jobRole || '';
    const rawText = await extractTextFromFile(req.file.path, req.file.mimetype);
    const parsed = parseResumeText(rawText);
    let analysis = analyzeResume(parsed, rawText, jobRole);

    analysis = await enhanceAnalysisWithAI({ parsed, rawText, jobRole, analysis });

    const resume = await Resume.create({
      user: req.user.id,
      originalName: req.file.originalname,
      filePath: req.file.path,
      jobRole,
      rawText,
      parsed,
      analysis
    });

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
}

export async function getResumeHistory(req, res, next) {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('originalName jobRole parsed.name analysis.atsScore analysis.jobMatchPercentage createdAt');

    res.json(resumes);
  } catch (error) {
    next(error);
  }
}

export async function getResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    next(error);
  }
}

export async function generateImprovedResume(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const improvedResume =
      (await generateAIRewrite(resume)) || generateLocalRewrite(resume.parsed, resume.analysis, resume.jobRole);

    resume.analysis.improvedResume = improvedResume;
    await resume.save();

    res.json({ improvedResume });
  } catch (error) {
    next(error);
  }
}

export async function downloadReport(req, res, next) {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const doc = new PDFDocument({ margin: 48 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.parsed.name || 'resume'}-analysis.pdf"`);
    doc.pipe(res);

    doc.fontSize(22).text('AI Resume Analyzer Report');
    doc.moveDown();
    doc.fontSize(16).text(`ATS Score: ${resume.analysis.atsScore}/100`);
    doc.text(`Job Match: ${resume.analysis.jobMatchPercentage}%`);
    doc.moveDown();
    writeList(doc, 'Extracted Skills', resume.parsed.skills);
    writeList(doc, 'Missing Skills', resume.analysis.missingSkills);
    writeList(doc, 'Suggestions', resume.analysis.suggestions);
    writeList(doc, 'Weak Sections', resume.analysis.weakSections);
    doc.end();
  } catch (error) {
    next(error);
  }
}

async function enhanceAnalysisWithAI({ parsed, rawText, jobRole, analysis }) {
  if (!openai) return analysis;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an expert ATS resume reviewer. Return strict JSON with missingSkills, suggestions, weakSections, and improvedResume.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            jobRole,
            parsed,
            existingAnalysis: analysis,
            resumeText: rawText.slice(0, 12000),
            targetSkills: getRoleSkills(jobRole)
          })
        }
      ]
    });

    const ai = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      ...analysis,
      missingSkills: mergeUnique(analysis.missingSkills, ai.missingSkills),
      suggestions: mergeUnique(analysis.suggestions, ai.suggestions).slice(0, 8),
      weakSections: mergeUnique(analysis.weakSections, ai.weakSections),
      improvedResume: ai.improvedResume || analysis.improvedResume
    };
  } catch (error) {
    console.warn('AI enhancement skipped:', error.message);
    return analysis;
  }
}

async function generateAIRewrite(resume) {
  if (!openai) return '';

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Rewrite resume content to be ATS-friendly, concise, metric-oriented, and truthful. Do not invent employers or degrees.'
        },
        {
          role: 'user',
          content: `Job role: ${resume.jobRole}\nParsed resume: ${JSON.stringify(resume.parsed)}\nSuggestions: ${resume.analysis.suggestions.join('; ')}`
        }
      ]
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.warn('AI rewrite skipped:', error.message);
    return '';
  }
}

function generateLocalRewrite(parsed, analysis, jobRole) {
  return [
    `${parsed.name}`,
    '',
    `Professional Summary`,
    `Results-focused candidate targeting ${jobRole || 'a high-impact role'} with experience across ${parsed.skills
      .slice(0, 8)
      .join(', ')}. Brings a structured approach to problem solving, collaboration, and measurable delivery.`,
    '',
    'Core Skills',
    mergeUnique(parsed.skills, analysis.missingSkills).slice(0, 14).join(' | '),
    '',
    'Experience Improvements',
    ...analysis.suggestions.map((suggestion) => `- ${suggestion}`)
  ].join('\n');
}

function mergeUnique(first = [], second = []) {
  return [...new Set([...first, ...second].filter(Boolean))];
}

function writeList(doc, title, items = []) {
  doc.fontSize(14).text(title, { underline: true });
  if (!items.length) {
    doc.fontSize(11).text('None identified.');
  } else {
    items.forEach((item) => doc.fontSize(11).text(`- ${item}`));
  }
  doc.moveDown();
}
