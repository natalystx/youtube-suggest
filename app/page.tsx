import ChatInput from "~/components/ChatInput";
import DynamicCategorySections from "~/components/DynamicCategorySections";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 pb-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 -z-10"></div>

      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What videos are you looking for?
          </h1>

          <p className="text-xl mb-12 text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Find the perfect YouTube videos with AI assistance. Tell me what you
            want to watch!
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12">
            <ChatInput />
          </div>
        </div>

        {/* Dynamic video grid sections based on user preferences */}
        <DynamicCategorySections />

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by YouTube API and AI
          </p>
        </div>
      </div>
    </div>
  );
}
