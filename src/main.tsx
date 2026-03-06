
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { deeplService } from "./services/deepl";

  createRoot(document.getElementById("root")!).render(<App />);

  // Activate DeepL DOM translation after React renders if Arabic is selected
  const savedLang = localStorage.getItem("darb_lang") || "en";
  if (savedLang === "ar") {
      // Wait for React's initial render to complete
      setTimeout(() => {
          deeplService.activate();
      }, 600);
  }
  





