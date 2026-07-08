import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const prompts = [
  {
    title: "Should Schools Limit Smartphone Use?",
    category: "Argumentative Writing",
    difficulty: "Beginner",
    targetSkill: "thesis statement",
    wordLimit: 350,
    estimatedMinutes: 25,
    content:
      "Write an argumentative essay explaining whether schools should limit smartphone use during the school day. Take a clear position and support it with reasons.",
  },
  {
    title: "The Value of Learning a Second Language",
    category: "Opinion Essay",
    difficulty: "Beginner",
    targetSkill: "paragraph structure",
    wordLimit: 300,
    estimatedMinutes: 20,
    content:
      "Write an opinion essay about whether every student should learn a second language. Include an introduction, two body paragraphs, and a conclusion.",
  },
  {
    title: "A Strong Academic Paragraph About Online Learning",
    category: "Academic Paragraph",
    difficulty: "Beginner",
    targetSkill: "coherence",
    wordLimit: 180,
    estimatedMinutes: 15,
    content:
      "Write one academic paragraph explaining one advantage or disadvantage of online learning. Use a topic sentence, supporting details, and a concluding sentence.",
  },
  {
    title: "Reducing Food Waste in Cities",
    category: "Problem Solution",
    difficulty: "Intermediate",
    targetSkill: "evidence development",
    wordLimit: 450,
    estimatedMinutes: 35,
    content:
      "Write a problem-solution essay about food waste in cities. Explain the problem, describe at least two practical solutions, and discuss why they could work.",
  },
  {
    title: "Public Transportation and Private Cars",
    category: "Compare and Contrast",
    difficulty: "Intermediate",
    targetSkill: "coherence",
    wordLimit: 400,
    estimatedMinutes: 30,
    content:
      "Compare and contrast public transportation and private cars for daily commuting. Organize your ideas clearly and use transition language.",
  },
  {
    title: "Should Homework Be Optional?",
    category: "Argumentative Writing",
    difficulty: "Beginner",
    targetSkill: "evidence development",
    wordLimit: 350,
    estimatedMinutes: 25,
    content:
      "Write an argumentative essay about whether homework should be optional. Support your claim with examples from school or personal experience.",
  },
  {
    title: "The Best Way to Build a Reading Habit",
    category: "Opinion Essay",
    difficulty: "Beginner",
    targetSkill: "lexical variety",
    wordLimit: 300,
    estimatedMinutes: 20,
    content:
      "Write an opinion essay explaining the best way for students to build a regular reading habit. Use varied vocabulary and clear examples.",
  },
  {
    title: "Academic Paragraph About Group Projects",
    category: "Academic Paragraph",
    difficulty: "Beginner",
    targetSkill: "grammar accuracy",
    wordLimit: 180,
    estimatedMinutes: 15,
    content:
      "Write one academic paragraph about the benefits or challenges of group projects. Focus on accurate sentence structure and verb agreement.",
  },
  {
    title: "Improving Air Quality Near Schools",
    category: "Problem Solution",
    difficulty: "Intermediate",
    targetSkill: "paragraph structure",
    wordLimit: 450,
    estimatedMinutes: 35,
    content:
      "Write a problem-solution essay about poor air quality near schools. Describe causes, propose solutions, and explain the expected impact.",
  },
  {
    title: "Studying Alone and Studying With Others",
    category: "Compare and Contrast",
    difficulty: "Beginner",
    targetSkill: "coherence",
    wordLimit: 350,
    estimatedMinutes: 25,
    content:
      "Compare studying alone with studying in a group. Explain the strengths and weaknesses of each approach and state which you prefer.",
  },
  {
    title: "Should Universities Require Internships?",
    category: "Argumentative Writing",
    difficulty: "Advanced",
    targetSkill: "thesis statement",
    wordLimit: 550,
    estimatedMinutes: 45,
    content:
      "Write an argumentative essay about whether universities should require internships before graduation. Present a precise thesis and address a counterargument.",
  },
  {
    title: "Why Creativity Matters in Education",
    category: "Opinion Essay",
    difficulty: "Intermediate",
    targetSkill: "evidence development",
    wordLimit: 400,
    estimatedMinutes: 30,
    content:
      "Write an opinion essay about the role of creativity in education. Support your view with examples from classroom learning, projects, or future careers.",
  },
  {
    title: "Academic Paragraph About Time Management",
    category: "Academic Paragraph",
    difficulty: "Beginner",
    targetSkill: "paragraph structure",
    wordLimit: 180,
    estimatedMinutes: 15,
    content:
      "Write one academic paragraph explaining why time management is important for students. Include one clear controlling idea and supporting details.",
  },
  {
    title: "Solving Noise Pollution in Neighborhoods",
    category: "Problem Solution",
    difficulty: "Intermediate",
    targetSkill: "coherence",
    wordLimit: 450,
    estimatedMinutes: 35,
    content:
      "Write a problem-solution essay about noise pollution in residential neighborhoods. Explain who is affected and propose realistic community solutions.",
  },
  {
    title: "Printed Books and E-books",
    category: "Compare and Contrast",
    difficulty: "Beginner",
    targetSkill: "lexical variety",
    wordLimit: 350,
    estimatedMinutes: 25,
    content:
      "Compare and contrast printed books and e-books. Use varied vocabulary to describe convenience, cost, reading experience, and accessibility.",
  },
  {
    title: "Should Students Choose Their Own Courses?",
    category: "Argumentative Writing",
    difficulty: "Intermediate",
    targetSkill: "thesis statement",
    wordLimit: 450,
    estimatedMinutes: 35,
    content:
      "Write an argumentative essay about whether students should have more freedom to choose their own courses. State your position clearly and support it.",
  },
  {
    title: "The Importance of Sleep for Learning",
    category: "Opinion Essay",
    difficulty: "Beginner",
    targetSkill: "grammar accuracy",
    wordLimit: 300,
    estimatedMinutes: 20,
    content:
      "Write an opinion essay explaining why sleep is important for learning. Focus on clear grammar, complete sentences, and logical paragraphing.",
  },
  {
    title: "Academic Paragraph About Digital Privacy",
    category: "Academic Paragraph",
    difficulty: "Intermediate",
    targetSkill: "evidence development",
    wordLimit: 220,
    estimatedMinutes: 20,
    content:
      "Write one academic paragraph explaining why digital privacy matters. Include a topic sentence, a concrete example, and analysis.",
  },
  {
    title: "Helping New Students Adjust",
    category: "Problem Solution",
    difficulty: "Beginner",
    targetSkill: "paragraph structure",
    wordLimit: 350,
    estimatedMinutes: 25,
    content:
      "Write a problem-solution essay about how schools can help new students adjust. Describe common challenges and propose practical support.",
  },
  {
    title: "City Life and Small-Town Life",
    category: "Compare and Contrast",
    difficulty: "Intermediate",
    targetSkill: "coherence",
    wordLimit: 400,
    estimatedMinutes: 30,
    content:
      "Compare and contrast city life and small-town life. Organize your essay around clear points such as opportunities, cost, community, and pace.",
  },
];

async function main() {
  for (const prompt of prompts) {
    await prisma.writingPrompt.upsert({
      where: { title: prompt.title },
      update: prompt,
      create: prompt,
    });
  }

  console.log(`Seeded ${prompts.length} writing prompts.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
