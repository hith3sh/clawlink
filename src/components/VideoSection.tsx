export default function VideoSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-3 tracking-tight">
        See it in action
      </h2>
      <p className="text-center text-gray-500 mb-12 text-lg">
        Watch ClawLink on the homepage demo
      </p>
      <div className="relative aspect-video rounded-3xl border border-gray-100 bg-gray-50/50 overflow-hidden shadow-xl shadow-gray-900/5">
        <iframe
          className="absolute inset-0 h-full w-full"
          src="https://player.vimeo.com/video/1191844124?badge=0&autopause=0&player_id=0&app_id=58479"
          title="ClawLink Demo"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
