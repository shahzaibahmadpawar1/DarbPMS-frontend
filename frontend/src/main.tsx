
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { deeplService } from "./services/deepl";

  createRoot(document.getElementById("root")!).render(<App />);

  // Activate DeepL translation during idle time if Arabic is selected.
  const savedLang = localStorage.getItem("darb_lang") || "en";
  if (savedLang === "ar") {
      const activate = () => {
          deeplService.activate();
      };

      const requestIdle = (
          window as Window & {
              requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
          }
      ).requestIdleCallback;

      if (typeof requestIdle === "function") {
          requestIdle(activate, { timeout: 800 });
      } else {
          window.setTimeout(activate, 60);
      }
  }
  





