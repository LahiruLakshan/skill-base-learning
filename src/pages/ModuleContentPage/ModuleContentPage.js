import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const ModuleContentPage = () => {
  const location = useLocation();
  const { subModule } = location.state || {};
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { value: "option1", label: "English" },
    { value: "option2", label: "Tamil" },
    { value: "option3", label: "Sinhala" },
  ];
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
        <div className="text-center text-gray-500 text-xl">
          No sub-module data found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="relative max-w-[150px]" ref={dropdownRef}>
          <button
            type="button"
            className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="float-right">{isOpen ? "▲" : "▼"}</span>
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
              <ul className="py-1 overflow-auto text-base rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option) => (
                  <li
                    key={option.value}
                    className="px-4 py-2 text-gray-900 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
        <Link
          to={`/quiz/${subModule.id}`}
          state={{ subModule }}
          className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
        >
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition">
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
