import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, Link as LinkIcon, ArrowRight, X } from 'lucide-react';

export function CreateCampaign() {
  const [campaignName, setCampaignName] = useState('');
  const [sourceType, setSourceType] = useState<'file' | 'url' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setSourceType('file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const campaign = {
      id: Math.random().toString(36).substr(2, 9),
      name: campaignName,
      status: 'processing' as const,
      createdAt: new Date(),
      sourceFile: file?.name || url || 'Text input',
      sourceContent: sourceType === 'text' ? text : undefined,
    };

    // Save to localStorage
    const existing = localStorage.getItem('campaigns');
    const campaigns = existing ? JSON.parse(existing) : [];
    campaigns.unshift(campaign);
    localStorage.setItem('campaigns', JSON.stringify(campaigns));

    // Navigate to agent room
    navigate(`/campaign/${campaign.id}/agents`);
  };

  const isValid =
    campaignName.trim() &&
    ((sourceType === 'file' && file) ||
      (sourceType === 'url' && url.trim()) ||
      (sourceType === 'text' && text.trim()));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
        <p className="text-gray-600 mt-1">
          Upload your source material and let AI agents create your content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Product Launch 2026"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Source Material
            </label>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setSourceType('file')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  sourceType === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                File
              </button>
              <button
                type="button"
                onClick={() => setSourceType('url')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  sourceType === 'url'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LinkIcon className="w-4 h-4 inline mr-2" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setSourceType('text')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  sourceType === 'text'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Text
              </button>
            </div>

            {sourceType === 'file' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {file ? (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-1">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF, TXT, DOCX, or Markdown files
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.txt,.docx,.md"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-all"
                    >
                      Select File
                    </label>
                  </>
                )}
              </div>
            )}

            {sourceType === 'url' && (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="https://example.com/product-info"
                required
              />
            )}

            {sourceType === 'text' && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Paste your product information, technical specs, or any source material here..."
                rows={10}
                required
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
          >
            Start Campaign
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
