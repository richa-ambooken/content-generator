import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  Download,
  Copy,
  Check,
  FileText,
  Twitter,
  Mail,
  Smartphone,
  Monitor,
  ChevronLeft,
  RefreshCw,
} from 'lucide-react';

interface Results {
  factSheet: {
    features: string[];
    technicalSpecs: string[];
    targetAudience: string;
    valueProposition: string;
    price?: string;
  };
  content: {
    blogPost: string;
    socialThread: string[];
    emailTeaser: string;
  };
}

export function Results() {
  const { id } = useParams();
  const [results, setResults] = useState<Results | null>(null);
  const [activeView, setActiveView] = useState<'blog' | 'social' | 'email'>('blog');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`campaign_${id}_results`);
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, [id]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    if (!results) return;

    const content = `
# Campaign Content Export

## Blog Post
${results.content.blogPost}

---

## Social Media Thread
${results.content.socialThread.map((post, idx) => `${idx + 1}. ${post}`).join('\n\n')}

---

## Email Teaser
${results.content.emailTeaser}

---

## Source Fact Sheet
**Target Audience:** ${results.factSheet.targetAudience}
**Value Proposition:** ${results.factSheet.valueProposition}
**Features:** ${results.factSheet.features.join(', ')}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const getCurrentContent = () => {
    switch (activeView) {
      case 'blog':
        return results.content.blogPost;
      case 'social':
        return results.content.socialThread.map((post, idx) => `${idx + 1}. ${post}`).join('\n\n');
      case 'email':
        return results.content.emailTeaser;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Campaign Results
            </h1>
            <p className="text-gray-600 mt-1">
              Review and export your generated content
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <Download className="w-5 h-5" />
            Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Material */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Source Fact Sheet
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Value Proposition
              </h3>
              <p className="text-gray-600">
                {results.factSheet.valueProposition}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Target Audience
              </h3>
              <p className="text-gray-600">
                {results.factSheet.targetAudience}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Key Features</h3>
              <ul className="space-y-1">
                {results.factSheet.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            {results.factSheet.price && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Pricing</h3>
                <p className="text-gray-600">{results.factSheet.price}</p>
              </div>
            )}
          </div>
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Content Type Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('blog')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === 'blog'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Blog Post
                </button>
                <button
                  onClick={() => setActiveView('social')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === 'social'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Twitter className="w-4 h-4" />
                  Social
                </button>
                <button
                  onClick={() => setActiveView('email')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeView === 'email'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'desktop'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Desktop view"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'mobile'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Mobile view"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="p-6 bg-gray-50 flex justify-center min-h-[600px]">
            <div
              className={`bg-white rounded-lg shadow-lg transition-all ${
                viewMode === 'mobile' ? 'max-w-sm w-full' : 'w-full'
              }`}
            >
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {activeView === 'blog' && (
                  <div className="prose prose-sm max-w-none">
                    {results.content.blogPost.split('\n').map((line, idx) => {
                      if (line.startsWith('# ')) {
                        return (
                          <h1 key={idx} className="text-2xl font-bold mb-4">
                            {line.substring(2)}
                          </h1>
                        );
                      }
                      if (line.startsWith('## ')) {
                        return (
                          <h2 key={idx} className="text-xl font-semibold mt-6 mb-3">
                            {line.substring(3)}
                          </h2>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <p key={idx} className="font-semibold mb-2">
                            {line.replace(/\*\*/g, '')}
                          </p>
                        );
                      }
                      if (line.trim()) {
                        return (
                          <p key={idx} className="mb-4 text-gray-700">
                            {line}
                          </p>
                        );
                      }
                      return <div key={idx} className="h-2" />;
                    })}
                  </div>
                )}

                {activeView === 'social' && (
                  <div className="space-y-4">
                    {results.content.socialThread.map((post, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-semibold">
                              {idx + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {post}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeView === 'email' && (
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-xs text-gray-500 mb-1">Subject</p>
                      <p className="font-semibold text-gray-900">
                        Transform Your Content Workflow
                      </p>
                    </div>
                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                      {results.content.emailTeaser}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-2">
                <button
                  onClick={() => handleCopy(getCurrentContent(), activeView)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copied === activeView ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regenerate Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Want to make changes?
            </h3>
            <p className="text-sm text-blue-700">
              You can regenerate specific content pieces or create a new campaign
              with updated source material.
            </p>
          </div>
          <Link
            to="/campaign/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            New Campaign
          </Link>
        </div>
      </div>
    </div>
  );
}
