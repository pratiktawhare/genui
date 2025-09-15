import React, { use, useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsListNested, BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { LuRefreshCw } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import Editor from "@monaco-editor/react";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners"
import { toast } from "react-toastify";
const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS"},
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap"}
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(2);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0])
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});
  async function getResponse() {
    if (!prompt.trim()) {
      toast.info("Please describe your component first.");
      return;
    }

    try {
      setLoading(true);
      setOutputScreen(false);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `
        You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI webpages. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.
  
        Now, generate a UI component for: ${prompt}  
        Framework to use: ${framework.value}  
        
        Requirements:  
        The code must be clean, well-structured, and easy to understand.  
        Optimize for SEO where applicable.  
        Focus on creating a modern, animated, and responsive UI design.
        Make webpage dynamic.
        Include high-quality hover effects, shadows, animations, colors, and typography.  
        Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
        Do NOT include explanations, text, comments, or anything else besides the code.  
        And give the whole code in a single HTML file.
        Make unique, fully responsive to all the devices webpages
        don't write comments in even start or last of code
        important: don't give any link the '/' route
        create the content of other pages in the same file also and conditionally render when the particular tab clicks
  
        ## STRICT OUTPUT RULES
  
        1.  **RAW CODE ONLY:** Your output MUST be the raw source code and nothing else. Do not include any explanations, introductory text, or concluding remarks.
        2.  **NO MARKDOWN WRAPPERS:** Crucially, DO NOT wrap the code in Markdown fenced code blocks (like backticks). The response must start directly with the first character of the code (e.g., "<!DOCTYPE html>" or "<div class="...">") and end with the last character of the code (e.g., "</html>" or </div>").
        3.  **SINGLE FILE:** All HTML, CSS (using framework classes or an internal "<style>" tag), and JavaScript (using an internal "<script>" tag) must be contained within a single file/response.
        4.  **NO CODE COMMENTS:** The code itself must not contain any comments
        `,
      });
      setCode(response.text);
      setOutputScreen(true);
    } catch (err) {
      console.error("Error generating code:", err);
      toast.error("Failed to generate code");
    } finally {
      setLoading(false);
    }

  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  }

  const downloadFile = () => {
    const filename = "GenUI-Code.html"
    const blob = new Blob([code], {type: 'text/plain'});
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  }

  return (
    <>
      <Navbar />
      {/* Responsive container */}
      <div className="flex flex-col lg:flex-row items-start justify-between px-5 md:px-10 lg:px-[100px] gap-6 lg:gap-[30px]">
        {/* Left Section */}
        <div className="left w-full lg:w-[46%] py-6 rounded-xl bg-[#141319] mt-5 p-5">
          <h3 className="text-2xl font-semibold bg-gradient-to-bl from-teal-500 via-purple-500 to-red-500 text-transparent bg-clip-text">
            AI Webpage Generator
          </h3>

          <p className="text-gray-400 mt-2 text-base">
            Describe your webpage and let AI code for you
          </p>

          <p className="text-sm font-bold mt-4">Framework</p>
          <Select
            className="mt-2"
            options={options}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#090908",
                border: "1px solid #333",
                boxShadow: "none",
                "&:hover": { border: "1px solid #555" },
              }),
              menu: (base) => ({ ...base, backgroundColor: "#141319" }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#17171c" : "#141319",
                color: state.isSelected ? "#4ade80" : "#fff",
              }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              input: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
            }}
            onChange={(e) => setFramework(e)}
          />

          <p className="text-sm font-bold mt-5">Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white text-sm"
            placeholder="Describe your webpage..."
          />

          <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
            <p className="text-gray-400 text-sm">
              Click on generate to create your code
            </p>
            <button
              onClick={getResponse}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 text-white text-sm transition-all hover:opacity-80"
            >
              {loading ? (
                <ClipLoader color="white" size={20} />
              ) : (
                <BsStars />
              )}
              Generate
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="right w-full lg:w-[46%] h-[70vh] md:h-[80vh] rounded-xl bg-[#141319] mt-5 relative">
          {!outputScreen ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
              <div className="p-5 w-[70px] h-[70px] rounded-full text-3xl flex items-center justify-center bg-gradient-to-r from-purple-400 to-purple-600">
                <HiOutlineCode />
              </div>
              <p className="text-gray-400 mt-3 text-sm">
                Your webpage & code will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex items-center w-full bg-[#17171c]">
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 py-2 text-sm rounded-xl ${
                    tab === 1 ? "bg-[#333]" : ""
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`w-1/2 py-2 text-sm rounded-xl ${
                    tab === 2 ? "bg-[#333]" : ""
                  }`}
                >
                  Preview
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#17171c]">
                <p className="font-bold text-sm">Code Editor</p>
                <div className="flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]"
                      >
                        <IoCopy />
                      </button>
                      <button
                        onClick={downloadFile}
                        className="w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]"
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsNewTabOpen(true)}
                        className="w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]"
                      >
                        <ImNewTab />
                      </button>
                      {/* <button className="w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-[#333]">
                        <LuRefreshCw />
                      </button> */}
                    </>
                  )}
                </div>
              </div>

              {/* Editor/Preview */}
              <div className="h-[calc(100%-100px)]">
                {tab === 1 ? (
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language="html"
                    value={code}
                  />
                ) : (
                  <iframe
                    srcDoc={code}
                    className="w-full h-full bg-white"
                  ></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Preview */}
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <button
            onClick={() => setIsNewTabOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#333] text-white"
          >
            <MdClose />
          </button>
          <iframe srcDoc={code} className="w-full h-full"></iframe>
        </div>
      )}
    </>
  );
};

export default Home;



