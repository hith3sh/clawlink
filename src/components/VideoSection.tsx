export default function VideoSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
        See it in action
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Watch how to connect Gmail to OpenClaw in under 30 seconds
      </p>
      {/* Replace the placeholder with a real YouTube embed */}
      <div className="relative aspect-video rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-lg">
        {/* Uncomment and replace VIDEO_ID when ready:
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/VIDEO_ID"
          title="ClawLink Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-sm">Demo video coming soon</span>
        </div>
      </div>
    </div>
  );
}
