import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Brain, Pencil, Shield, MessageSquare, Send } from 'lucide-react';
import {
  runResearchAgent,
  runCopywriterAgent,
  runEditorAgent,
  AgentMessage,
  FactSheet,
  ContentOutput,
} from '../../utils/agents';

const agents = [
  {
    id: 'research',
    name: 'Research Agent',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    description: 'Analytical Brain',
  },
  {
    id: 'copywriter',
    name: 'Copywriter Agent',
    icon: Pencil,
    color: 'from-purple-500 to-pink-500',
    description: 'Creative Voice',
  },
  {
    id: 'editor',
    name: 'Editor Agent',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    description: 'Quality Gatekeeper',
  },
];

export function AgentRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [userMessages, setUserMessages] = useState<Array<{ text: string; timestamp: Date }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    runAgentWorkflow();
  }, []);

  const addMessage = (msg: AgentMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const runAgentWorkflow = async () => {
    // Simulate source text (in production, this would come from the uploaded file)
    const sourceText =
      'AgentHub is a revolutionary AI-powered content platform that enables teams to create multi-channel marketing campaigns efficiently...';

    // Research Agent
    setActiveAgents(['research']);
    const factSheet = await runResearchAgent(sourceText, addMessage);

    // Copywriter Agent
    setActiveAgents(['copywriter']);
    const content = await runCopywriterAgent(factSheet, addMessage);

    // Editor Agent
    setActiveAgents(['editor']);
    await runEditorAgent(factSheet, content, addMessage);

    setActiveAgents([]);
    setIsComplete(true);

    // Save results to localStorage
    const campaign = {
      id,
      factSheet,
      content,
    };
    localStorage.setItem(`campaign_${id}_results`, JSON.stringify(campaign));

    // Update campaign status
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updated = campaigns.map((c: any) =>
      c.id === id ? { ...c, status: 'completed' } : c
    );
    localStorage.setItem('campaigns', JSON.stringify(updated));

    // Auto-navigate to results after a delay
    setTimeout(() => {
      navigate(`/campaign/${id}/results`);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setUserMessages((prev) => [
      ...prev,
      { text: chatMessage, timestamp: new Date() },
    ]);

    // Simulate agent acknowledging the correction
    addMessage({
      id: Math.random().toString(36).substr(2, 9),
      agentId: 'editor',
      agentName: 'Editor Agent',
      type: 'feedback',
      content: `Noted: "${chatMessage}". I'll ensure this is addressed in the final output.`,
      timestamp: new Date(),
    });

    setChatMessage('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Agent Icons Section */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Agent Room
        </h2>
        <div className="space-y-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = activeAgents.includes(agent.id);
            const hasCompleted = messages.some(
              (m) => m.agentId === agent.id && m.type === 'output'
            );

            return (
              <div
                key={agent.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : hasCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center relative`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-gray-600">{agent.description}</p>
                  </div>
                </div>
                <div className="mt-3">
                  {isActive && (
                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                      Working...
                    </span>
                  )}
                  {hasCompleted && !isActive && (
                    <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isComplete && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded-xl">
            <p className="text-sm font-semibold text-green-900 mb-2">
              Campaign Complete!
            </p>
            <p className="text-xs text-green-700">
              Redirecting to results...
            </p>
          </div>
        )}
      </div>

      {/* Live Chat Feed */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Live Activity Feed</h2>
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            {showChat ? 'Hide Chat' : 'Send Corrections'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => {
            const agent = agents.find((a) => a.id === message.agentId);
            const Icon = agent?.icon || Brain;

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'thinking' ? 'opacity-70' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                    agent?.color || 'from-gray-400 to-gray-500'
                  } flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {message.agentName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'thinking'
                        ? 'bg-gray-100 text-gray-700 italic'
                        : message.type === 'feedback'
                        ? 'bg-yellow-50 text-yellow-900 border border-yellow-200'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {userMessages.map((msg, idx) => (
            <div key={idx} className="flex gap-3 justify-end">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-1 justify-end">
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="font-semibold text-sm text-gray-900">
                    You
                  </span>
                </div>
                <div className="rounded-lg p-3 bg-blue-600 text-white">
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {showChat && (
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Send corrections or feedback to agents..."
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
