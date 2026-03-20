// purpose: right sidebar with saved component variants as thumbnails

import { useState, useCallback, useMemo } from 'react';
import type { GalleryGridProps, ComponentDocument } from './types';
import { buildSrcdoc } from './preview-panel';

export const VariantsSidebar = ({ state, onRefresh }: GalleryGridProps) => {
  return (
    <aside className="w-48 bg-gray-900 border-l border-gray-800 flex flex-col h-screen sticky top-0">
      {/* header */}
      <div className="px-3 py-3 border-b border-gray-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-300">Variants</span>
        <button
          onClick={onRefresh}
          disabled={state.status === 'loading'}
          className="text-xs text-gray-500 hover:text-white disabled:opacity-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* variants list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {state.status === 'idle' || state.status === 'loading' ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-800 rounded-lg animate-pulse" />
          ))
        ) : state.status === 'error' ? (
          <div className="text-center py-4">
            <p className="text-xs text-red-400">{state.message}</p>
            <button
              onClick={onRefresh}
              className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : state.components.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-gray-500">No saved variants</p>
            <p className="text-xs text-gray-600 mt-1">Generate and save components</p>
          </div>
        ) : (
          state.components.map((component) => (
            <VariantCard key={component.id} component={component} />
          ))
        )}
      </div>
    </aside>
  );
};

const VariantCard = ({ component }: { component: ComponentDocument }) => {
  const [copied, setCopied] = useState(false);
  const srcdoc = useMemo(() => buildSrcdoc(component.code), [component.code]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(component.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [component.code]);

  return (
    <div className="group rounded-lg border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors cursor-pointer">
      {/* thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white">
        <div
          className="absolute inset-0 origin-top-left"
          style={{ transform: 'scale(0.25)', width: '400%', height: '400%' }}
        >
          <iframe
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title={component.title}
            className="w-full h-full pointer-events-none"
            tabIndex={-1}
          />
        </div>
        {/* copy overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 text-xs px-2.5 py-1 bg-white text-gray-900 rounded-md font-medium transition-opacity"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      {/* label */}
      <div className="px-2 py-1.5 bg-gray-900">
        <p className="text-xs text-gray-400 truncate">{component.title}</p>
      </div>
    </div>
  );
};
