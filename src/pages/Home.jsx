import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  FiArrowUpRight,
  FiBox,
  FiCheck,
  FiChevronDown,
  FiCode,
  FiCopy,
  FiDownload,
  FiExternalLink,
  FiLayers,
  FiMaximize2,
  FiMonitor,
  FiMousePointer,
  FiPlus,
  FiRefreshCw,
  FiSliders,
  FiStar,
  FiZap,
  FiX,
} from "react-icons/fi";

const frameworkOptions = [
  "React + Tailwind",
  "HTML + CSS",
  "HTML + Tailwind",
  "Vue + Tailwind",
];

const componentOptions = [
  "Interactive component",
  "Hero section",
  "Dashboard widget",
  "Navigation system",
  "Form experience",
];

const styleOptions = [
  { name: "Aurora glow", color: "#8b5cf6" },
  { name: "Editorial", color: "#f59e0b" },
  { name: "Soft glass", color: "#22d3ee" },
  { name: "Neo brutalist", color: "#f472b6" },
];

const motionOptions = ["Micro-interactions", "Cinematic reveal", "Playful bounce", "Subtle only"];

const inspirationPrompts = [
  {
    title: "Orbit dashboard",
    description: "A futuristic analytics card with animated data rings",
  },
  {
    title: "Glass pricing",
    description: "A premium pricing switcher with a magnetic CTA",
  },
  {
    title: "Focus timer",
    description: "A calm productivity timer with ambient motion",
  },
];

const stripCodeFences = (value = "") =>
  value
    .replace(/^\s*```(?:html|jsx|tsx|javascript|js)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

const SelectField = ({ label, value, options, onChange, icon: Icon }) => (
  <label className="block">
    <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
      {Icon && <Icon className="text-violet-400" />}
      {label}
    </span>
    <span className="relative block">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-xl border border-white/[0.09] bg-white/[0.045] px-3.5 py-3 text-sm text-zinc-100 outline-none transition hover:border-white/[0.18] focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/10"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#17171f]">
            {option}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" />
    </span>
  </label>
);

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(frameworkOptions[0]);
  const [componentType, setComponentType] = useState(componentOptions[0]);
  const [visualStyle, setVisualStyle] = useState(styleOptions[0].name);
  const [motion, setMotion] = useState(motionOptions[0]);
  const [activeTab, setActiveTab] = useState("preview");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  const getResponse = async () => {
    if (!prompt.trim()) {
      toast.info("Describe the interface you want to create first.");
      return;
    }

    try {
      setLoading(true);
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `
You are GenUI, an expert creative UI component designer and frontend engineer.
Create one polished, production-quality UI component based on the user's brief below.

USER BRIEF:
${prompt}

COMPONENT TYPE: ${componentType}
IMPLEMENTATION: ${framework}
VISUAL DIRECTION: ${visualStyle}
MOTION DIRECTION: ${motion}

The output must be a single self-contained HTML document that can render inside an iframe.
Use inline CSS and vanilla JavaScript when needed. If the requested implementation is React,
write the component as a visual HTML preview while keeping the code structure easy to port to React.
Make the component feel inventive, intentional, responsive, accessible, and ready to ship.
Include a considered background treatment, depth, hover/focus states, and tasteful animations.
Do not use external image links. Use CSS gradients, SVG, shapes, and generated UI details instead.
Make every interactive control feel alive with JavaScript where appropriate.

STRICT OUTPUT RULES:
1. Return raw HTML only. Do not wrap the response in Markdown code fences.
2. Start directly with <!DOCTYPE html> and end with </html>.
3. Put all CSS in a <style> tag and all JavaScript in a <script> tag.
4. Do not include explanations, comments, or placeholder TODO text.
        `,
      });

      const generatedCode = stripCodeFences(response.text || "");
      if (!generatedCode) {
        throw new Error("The AI returned an empty component.");
      }

      setCode(generatedCode);
      setActiveTab("preview");
      toast.success("Your component is ready to explore.");
    } catch (error) {
      console.error("Error generating component:", error);
      toast.error("Could not generate the component. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Component code copied.");
    } catch (error) {
      console.error("Failed to copy component code:", error);
      toast.error("Could not copy the code.");
    }
  };

  const downloadFile = () => {
    if (!code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "genui-component.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Component downloaded.");
  };

  const handleInspiration = (description) => {
    setPrompt(description);
    toast.info("Prompt added. Make it yours and generate.");
  };

  const resetCanvas = () => {
    setPrompt("");
    setCode("");
    setActiveTab("preview");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#08090c] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 8% 0%, rgba(124, 58, 237, .16), transparent 27%), radial-gradient(circle at 90% 16%, rgba(14, 165, 233, .09), transparent 24%)" }} />

      <header className="relative z-10 border-b border-white/[0.07] bg-[#08090c]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 sm:px-8 xl:px-12">
          <button onClick={resetCanvas} className="group flex items-center gap-3 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 via-fuchsia-500 to-cyan-300 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition group-hover:rotate-6">
              G
            </span>
            <span>
              <span className="block text-[17px] font-bold tracking-tight text-white">GenUI</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Component studio</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-zinc-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
              AI workspace
            </div>
            <button onClick={resetCanvas} className="flex items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white">
              <FiPlus /> New canvas
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1500px] px-5 pb-12 pt-8 sm:px-8 sm:pt-12 xl:px-12">
        <section className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
              <FiStar /> AI-powered interface creation
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.05em] text-white sm:text-5xl lg:text-[58px]">
              Turn a thought into a <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">living interface.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-base">
              Describe a component, choose a visual world, and let GenUI shape the details — backgrounds, motion, interactions, and all.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-6 text-xs text-zinc-500 lg:pb-1">
            <div><span className="mb-1 block text-xl font-semibold text-zinc-200">01</span>Describe</div>
            <span className="h-px w-8 bg-white/10" />
            <div><span className="mb-1 block text-xl font-semibold text-zinc-200">02</span>Direct</div>
            <span className="h-px w-8 bg-white/10" />
            <div><span className="mb-1 block text-xl font-semibold text-zinc-200">03</span>Ship</div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(360px,0.82fr)_minmax(560px,1.38fr)]">
          <div className="rounded-2xl border border-white/[0.09] bg-[#101117]/90 p-5 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">Create a component</p>
                <h2 className="text-xl font-semibold tracking-tight text-white">Give it a point of view.</h2>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2 text-zinc-400"><FiSliders /></div>
            </div>

            <div className="mb-5 rounded-2xl border border-white/[0.08] bg-[#0a0b0f] p-3 transition focus-within:border-violet-400/40 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,.06)]">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-h-[150px] w-full resize-none bg-transparent px-1 py-1 text-[15px] leading-7 text-zinc-100 outline-none placeholder:text-zinc-600"
                placeholder="A floating music player for a late-night radio station with an animated equalizer..."
              />
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.07] pt-3">
                <span className="text-[11px] text-zinc-600">{prompt.length}/1000</span>
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-600"><FiMousePointer /> Be specific for better results</span>
              </div>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <SelectField label="Build for" value={framework} options={frameworkOptions} onChange={setFramework} icon={FiCode} />
              <SelectField label="Component type" value={componentType} options={componentOptions} onChange={setComponentType} icon={FiBox} />
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Visual direction</span>
                <span className="text-[11px] text-violet-300">{visualStyle}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => setVisualStyle(style.name)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs transition ${visualStyle === style.name ? "border-violet-400/60 bg-violet-400/10 text-white" : "border-white/[0.08] bg-white/[0.025] text-zinc-400 hover:border-white/20 hover:text-zinc-200"}`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: style.color, boxShadow: `0 0 12px ${style.color}` }} />
                    {style.name}
                    {visualStyle === style.name && <FiCheck className="ml-auto text-violet-300" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Motion language</span>
                <FiZap className="text-amber-300" />
              </div>
              <div className="flex flex-wrap gap-2">
                {motionOptions.map((option) => (
                  <button key={option} onClick={() => setMotion(option)} className={`rounded-full border px-3 py-2 text-xs transition ${motion === option ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100" : "border-white/[0.08] text-zinc-500 hover:border-white/20 hover:text-zinc-300"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={getResponse} disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70">
              {loading ? <ClipLoader color="white" size={18} /> : <FiStar className="transition group-hover:rotate-12" />}
              {loading ? "Composing your interface..." : "Generate component"}
              {!loading && <FiArrowUpRight className="ml-auto text-lg" />}
            </button>
            <p className="mt-3 text-center text-[11px] text-zinc-600">GenUI creates a self-contained, editable preview</p>
          </div>

          <div className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101117]/90 shadow-2xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-[#14151c] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400/80" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" /></div>
                <span className="h-4 w-px bg-white/10" />
                <span className="flex items-center gap-2 text-xs font-medium text-zinc-400"><FiMonitor /> Live canvas</span>
              </div>
              <div className="flex items-center gap-2">
                {code && <span className="hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Ready</span>}
                <button onClick={resetCanvas} className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200" title="Clear canvas"><FiRefreshCw /></button>
                <button onClick={() => setIsNewTabOpen(true)} disabled={!code} className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-30" title="Open fullscreen"><FiMaximize2 /></button>
              </div>
            </div>

            {code && (
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#111219] px-4 py-2">
                <div className="flex items-center gap-1 rounded-lg bg-black/20 p-1">
                  <button onClick={() => setActiveTab("preview")} className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition ${activeTab === "preview" ? "bg-white/[0.1] text-white" : "text-zinc-500 hover:text-zinc-300"}`}><FiMonitor /> Preview</button>
                  <button onClick={() => setActiveTab("code")} className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition ${activeTab === "code" ? "bg-white/[0.1] text-white" : "text-zinc-500 hover:text-zinc-300"}`}><FiCode /> Source</button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={copyCode} className="rounded-md p-2 text-zinc-500 transition hover:bg-white/[0.07] hover:text-zinc-200" title="Copy code"><FiCopy /></button>
                  <button onClick={downloadFile} className="rounded-md p-2 text-zinc-500 transition hover:bg-white/[0.07] hover:text-zinc-200" title="Download HTML"><FiDownload /></button>
                </div>
              </div>
            )}

            <div className="min-h-0 flex-1">
              {!code ? (
                <div className="relative flex h-full min-h-[520px] flex-col items-center justify-center overflow-hidden p-6 text-center">
                  <div className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
                  <div className="relative mb-7 h-48 w-72 rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.08] to-white/[0.015] p-4 text-left shadow-2xl shadow-violet-900/20 rotate-[-3deg]">
                    <div className="flex items-center justify-between"><div className="h-2 w-16 rounded-full bg-white/20" /><FiLayers className="text-violet-300" /></div>
                    <div className="mt-8 h-2 w-28 rounded-full bg-gradient-to-r from-violet-300/80 to-fuchsia-300/60" />
                    <div className="mt-2 h-2 w-40 rounded-full bg-white/10" />
                    <div className="mt-7 flex gap-2"><span className="h-10 flex-1 rounded-lg bg-cyan-300/10" /><span className="h-10 w-12 rounded-lg bg-violet-300/10" /><span className="h-10 w-12 rounded-lg bg-fuchsia-300/10" /></div>
                    <div className="absolute -bottom-5 -right-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-2xl text-cyan-200 shadow-xl shadow-cyan-500/10 rotate-[12deg]"><FiStar /></div>
                  </div>
                  <div className="relative">
                    <p className="mb-2 text-sm font-medium text-zinc-300">Your canvas is waiting.</p>
                    <p className="max-w-xs text-xs leading-5 text-zinc-600">Describe an idea on the left and watch the first version come to life here.</p>
                  </div>
                </div>
              ) : activeTab === "preview" ? (
                <iframe title="Generated UI component preview" srcDoc={code} sandbox="allow-scripts" className="h-full min-h-[520px] w-full bg-white" />
              ) : (
                <Editor height="100%" theme="vs-dark" language="html" value={code} onChange={(value) => setCode(value || "")} options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 } }} />
              )}
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.07] bg-[#0d0e13] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600 sm:px-5">
              <span>{code ? `${framework} · ${visualStyle}` : "Preview surface"}</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-violet-400" /> {code ? "Editable output" : "Waiting for input"}</span>
            </div>
          </div>
        </section>

        <section className="mt-8 border-t border-white/[0.07] pt-7">
          <div className="mb-4 flex items-center justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Need a starting point?</p><h3 className="mt-1 text-sm font-medium text-zinc-300">Try an idea from the studio</h3></div>
            <span className="hidden text-xs text-zinc-600 sm:block">Click a card to load its direction</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {inspirationPrompts.map((inspiration, index) => (
              <button key={inspiration.title} onClick={() => handleInspiration(inspiration.description)} className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-left transition hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-400/[0.05]">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${index === 0 ? "bg-violet-400/10 text-violet-300" : index === 1 ? "bg-amber-300/10 text-amber-200" : "bg-cyan-300/10 text-cyan-200"}`}><FiLayers /></span>
                <span className="min-w-0"><span className="block text-xs font-semibold text-zinc-300 group-hover:text-white">{inspiration.title}</span><span className="mt-1 block truncate text-[11px] text-zinc-600">{inspiration.description}</span></span>
                <FiArrowUpRight className="ml-auto shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300" />
              </button>
            ))}
          </div>
        </section>
      </main>

      {isNewTabOpen && code && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#08090c]">
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#111219] px-5 py-3">
            <div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300"><FiMonitor /></span><span className="text-sm font-medium text-zinc-200">Fullscreen preview</span></div>
            <div className="flex items-center gap-2"><button onClick={copyCode} className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:bg-white/5 hover:text-white sm:flex"><FiCopy /> Copy source</button><button onClick={() => setIsNewTabOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white" title="Close preview"><FiX /></button></div>
          </div>
          <iframe title="Fullscreen generated UI component" srcDoc={code} sandbox="allow-scripts" className="h-full w-full bg-white" />
        </div>
      )}
    </div>
  );
};

export default Home;
