import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const ModuleContentPage = () => {
  const location = useLocation();
  const { subModule } = location.state || {};

  useEffect(() => {
    console.log("subModule:", subModule);
  }, [subModule]);

  const stripHtmlTags = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

  if (!subModule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500 text-xl">No sub-module data found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
          {subModule.title}
        </h1>

        {/* Sub-module content (HTML rendering) */}
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: subModule.sub_module_content }}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          {subModule.watch_videos && (
            <button
              onClick={() => window.open(subModule.watch_videos, "_blank")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
            >
              Watch on YouTube
            </button>
          )}
          {subModule.pdf_note && (
            <button
              onClick={() => window.open(subModule.pdf_note, "_blank")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition"
            >
              View PDF Note
            </button>
          )}
        </div>
        <Link to={`/quiz/${subModule.id}`} state={{ subModule }}  className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          
            <button
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
            >
              Go To Quiz
            </button>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {/* {stripHtmlTags(subModule.sub_module_content)} */}
        </div>
        </Link>
      </div>
    </div>
  );
};

export default ModuleContentPage;
