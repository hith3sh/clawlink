export default function VideoSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3 tracking-tight">
        See it in action
      </h2>
      <p className="text-center text-gray-500 mb-12 text-lg">
        Watch how to connect Gmail to OpenClaw in under 30 seconds
      </p>
      {/* Replace the placeholder with a real YouTube embed */}
      <div className="relative aspect-video rounded-3xl border border-gray-100 bg-gray-50/50 overflow-hidden shadow-xl shadow-gray-900/5">
        {/* Uncomment and replace VIDEO_ID when ready:
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/VIDEO_ID"
          title="ClawLink Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg mb-4">
            <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-500">Demo video coming soon</span>
        </div>
      </div>
    </div>
  );
}
