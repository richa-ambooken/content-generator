export interface AgentMessage {
  id: string;
  agentId: string;
  agentName: string;
  type: 'thinking' | 'output' | 'feedback' | 'correction';
  content: string;
  timestamp: Date;
}

export interface FactSheet {
  features: string[];
  technicalSpecs: string[];
  targetAudience: string;
  valueProposition: string;
  ambiguities: string[];
  price?: string;
}

export interface ContentOutput {
  blogPost: string;
  socialThread: string[];
  emailTeaser: string;
}

export interface EditorFeedback {
  approved: boolean;
  contentType: 'blog' | 'social' | 'email';
  issues: string[];
  corrections: string;
}

// Simulate the Research Agent
export async function runResearchAgent(
  sourceText: string,
  onMessage: (msg: AgentMessage) => void
): Promise<FactSheet> {
  await delay(1000);
  onMessage({
    id: generateId(),
    agentId: 'research',
    agentName: 'Research Agent',
    type: 'thinking',
    content: 'Analyzing source material...',
    timestamp: new Date(),
  });

  await delay(2000);
  onMessage({
    id: generateId(),
    agentId: 'research',
    agentName: 'Research Agent',
    type: 'thinking',
    content: 'Extracting key features and technical specifications...',
    timestamp: new Date(),
  });

  await delay(2000);
  onMessage({
    id: generateId(),
    agentId: 'research',
    agentName: 'Research Agent',
    type: 'thinking',
    content: 'Identifying target audience and value proposition...',
    timestamp: new Date(),
  });

  const factSheet: FactSheet = {
    features: [
      'Real-time collaboration with AI agents',
      'Multi-format content generation',
      'Automated fact-checking and quality control',
      'Campaign management dashboard',
    ],
    technicalSpecs: [
      'Built with React and TypeScript',
      'Powered by advanced AI models',
      'Cloud-based processing',
      'Enterprise-grade security',
    ],
    targetAudience:
      'Marketing teams, content creators, and businesses looking to scale content production',
    valueProposition:
      'Transform raw product information into polished, multi-channel marketing content in minutes',
    ambiguities: [],
    price: '$99/month for teams',
  };

  await delay(1500);
  onMessage({
    id: generateId(),
    agentId: 'research',
    agentName: 'Research Agent',
    type: 'output',
    content: `✓ Fact-sheet created:\n\n**Key Features:**\n${factSheet.features.map((f) => `• ${f}`).join('\n')}\n\n**Target Audience:** ${factSheet.targetAudience}\n\n**Value Proposition:** ${factSheet.valueProposition}`,
    timestamp: new Date(),
  });

  return factSheet;
}

// Simulate the Copywriter Agent
export async function runCopywriterAgent(
  factSheet: FactSheet,
  onMessage: (msg: AgentMessage) => void,
  corrections?: string
): Promise<ContentOutput> {
  await delay(1000);
  onMessage({
    id: generateId(),
    agentId: 'copywriter',
    agentName: 'Copywriter Agent',
    type: 'thinking',
    content: corrections
      ? 'Applying editor corrections...'
      : 'Crafting engaging content from fact-sheet...',
    timestamp: new Date(),
  });

  await delay(2000);
  onMessage({
    id: generateId(),
    agentId: 'copywriter',
    agentName: 'Copywriter Agent',
    type: 'thinking',
    content: 'Generating blog post with professional tone...',
    timestamp: new Date(),
  });

  await delay(2500);
  onMessage({
    id: generateId(),
    agentId: 'copywriter',
    agentName: 'Copywriter Agent',
    type: 'thinking',
    content: 'Creating punchy social media thread...',
    timestamp: new Date(),
  });

  await delay(2000);
  onMessage({
    id: generateId(),
    agentId: 'copywriter',
    agentName: 'Copywriter Agent',
    type: 'thinking',
    content: 'Writing concise email teaser...',
    timestamp: new Date(),
  });

  const output: ContentOutput = {
    blogPost: `# ${factSheet.valueProposition}

In today's fast-paced digital landscape, content creation has become both essential and overwhelming. Marketing teams are expected to maintain a consistent presence across multiple channels while ensuring every piece of content is accurate, engaging, and on-brand.

Enter the future of content generation: AI-powered collaborative agents working in harmony to transform your raw product information into polished, ready-to-publish content.

## The Power of Multi-Agent Collaboration

Our platform brings together three specialized AI agents, each excelling in their domain:

${factSheet.features.map((f) => `**${f}**: Revolutionizing how teams work together to create compelling content that resonates with audiences.`).join('\n\n')}

## Built for ${factSheet.targetAudience}

Whether you're launching a new product or maintaining an ongoing content calendar, our platform ensures consistency, accuracy, and quality across all your marketing channels.

${factSheet.technicalSpecs.length > 0 ? `## Enterprise-Ready Technology\n\nPowered by ${factSheet.technicalSpecs[0].toLowerCase()}, our solution delivers reliability and performance at scale.` : ''}

Ready to transform your content workflow? Start your journey today at ${factSheet.price}.`,

    socialThread: [
      `🚀 Tired of spending hours creating content for every channel? There's a better way.\n\nIntroducing our AI-powered content platform—where three specialized agents work together to transform your ideas into polished, multi-channel campaigns.`,
      `🧠 Meet the team:\n\n1️⃣ Research Agent: Extracts the truth from your source material\n2️⃣ Copywriter Agent: Crafts engaging content for every channel\n3️⃣ Editor Agent: Ensures quality and accuracy\n\nAll working in perfect harmony.`,
      `✨ ${factSheet.valueProposition}\n\nPerfect for ${factSheet.targetAudience.toLowerCase()}.`,
      `💼 ${factSheet.features[0]}\n\nNo more context-switching. No more inconsistencies. Just seamless collaboration.`,
      `🎯 Ready to 10x your content output while maintaining quality?\n\nGet started at ${factSheet.price}.\n\nLink in bio! 🔗`,
    ],

    emailTeaser: `Hi there!\n\nImagine transforming hours of content creation into minutes. Our new AI-powered platform brings together specialized agents that collaborate to create blog posts, social content, and email campaigns—all from a single source document. ${factSheet.valueProposition}. ${factSheet.targetAudience} are already seeing incredible results. Ready to join them? Start your free trial today at ${factSheet.price}.\n\nBest regards,\nThe AgentHub Team`,
  };

  await delay(1500);
  onMessage({
    id: generateId(),
    agentId: 'copywriter',
    agentName: 'Copywriter Agent',
    type: 'output',
    content: `✓ Content generated:\n\n• Blog post: ${output.blogPost.split('\n')[0]}\n• Social thread: ${output.socialThread.length} posts\n• Email teaser: ${output.emailTeaser.substring(0, 100)}...`,
    timestamp: new Date(),
  });

  return output;
}

// Simulate the Editor Agent
export async function runEditorAgent(
  factSheet: FactSheet,
  content: ContentOutput,
  onMessage: (msg: AgentMessage) => void
): Promise<EditorFeedback[]> {
  await delay(1000);
  onMessage({
    id: generateId(),
    agentId: 'editor',
    agentName: 'Editor Agent',
    type: 'thinking',
    content: 'Comparing content against fact-sheet...',
    timestamp: new Date(),
  });

  await delay(2000);
  onMessage({
    id: generateId(),
    agentId: 'editor',
    agentName: 'Editor Agent',
    type: 'thinking',
    content: 'Checking for hallucinations and inaccuracies...',
    timestamp: new Date(),
  });

  await delay(2000);
  onMessage({
    id: generateId(),
    agentId: 'editor',
    agentName: 'Editor Agent',
    type: 'thinking',
    content: 'Auditing tone and style...',
    timestamp: new Date(),
  });

  // Simulate finding some issues
  const feedback: EditorFeedback[] = [
    {
      approved: true,
      contentType: 'blog',
      issues: [],
      corrections: '',
    },
    {
      approved: true,
      contentType: 'social',
      issues: [],
      corrections: '',
    },
    {
      approved: true,
      contentType: 'email',
      issues: [],
      corrections: '',
    },
  ];

  await delay(1500);
  onMessage({
    id: generateId(),
    agentId: 'editor',
    agentName: 'Editor Agent',
    type: 'output',
    content: `✓ Quality check complete:\n\n• Blog post: Approved ✓\n• Social thread: Approved ✓\n• Email teaser: Approved ✓\n\nAll content matches fact-sheet. Tone is appropriate for each channel.`,
    timestamp: new Date(),
  });

  return feedback;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
