import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useMainContext } from "../../context/MainContext";
import { DialogueBox } from "./DialogueBox";

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbyTDq42voKquASHzVLQm4txCPmwfrLXwn5oEkzkirwcW4aGDFTcyUoJ12ENbiJPWKAj/exec";

export const FeedbackButtons = observer(() => {
  const stateManager = useMainContext();
  const { sideBarManager } = stateManager.designManager;

  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  
  // Initialize as empty so it always asks the live Google Sheet
  const [approvedModels, setApprovedModels] = useState<Set<string>>(new Set());

  // Fetch live approved models on mount to keep synced
  useEffect(() => {
    fetch(WEBHOOK_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Google Script returned " + res.status);
        return res.json();
      })
      .then((data) => {
        if (data.approvedModels) {
          const liveSet = new Set<string>(data.approvedModels);
          setApprovedModels(liveSet);
        }
      })
      .catch((err) => {
        console.error("Live Sync Failed. Is your Webhook URL correct and deployed?", err);
      })
      .finally(() => setIsCheckingStatus(false));
  }, []);

  const currentModelName = sideBarManager.selectedModel?.name;
  const hasApproved = currentModelName
    ? approvedModels.has(currentModelName)
    : false;

  // Helper to extract the current state data
  const getPayload = (status: string, feedback: string = "") => {
    const modelName = currentModelName || "Unknown Model";
    const materialName = sideBarManager.selectedMaterial?.name || "Default";
    const crimpName = sideBarManager.selectedCrimpColor?.name || "Default";

    return {
      modelName,
      materialName,
      crimpName,
      feedback,
      status,
    };
  };

  const submitData = (payload: any) => {
    // Fire and forget fetch to avoid long no-cors redirect waits
    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    }).catch(console.error);
  };

  const handleApprove = () => {
    const payload = getPayload("Approved");
    submitData(payload);

    if (currentModelName) {
      setApprovedModels((prev) => {
        const next = new Set(prev);
        next.add(currentModelName);
        return next;
      });
    }
  };

  const handleFeedbackSubmit = (feedbackText: string) => {
    setIsSubmitting(true);
    const payload = getPayload("Feedback", feedbackText);
    submitData(payload);

    // Simulate a short delay so the user feels the submission happened
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogueOpen(false);
      alert("Feedback sent successfully!");
    }, 500);
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end">
      <div className="flex gap-4">
        <button
          onClick={handleApprove}
          disabled={hasApproved || isCheckingStatus}
          className={`${
            hasApproved
              ? "bg-gray-500 cursor-not-allowed"
              : isCheckingStatus
              ? "bg-gray-400 cursor-wait"
              : "bg-green-600 hover:bg-green-700"
          } text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-colors`}
        >
          {isCheckingStatus && !hasApproved
            ? "Checking..."
            : hasApproved
            ? "✓ Approved"
            : "Approve"}
        </button>
        <button
          onClick={() => setIsDialogueOpen(true)}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-colors disabled:opacity-50"
        >
          Feedback
        </button>
      </div>

      <div className="relative mt-2 w-full flex justify-end">
        <DialogueBox
          isOpen={isDialogueOpen}
          onClose={() => setIsDialogueOpen(false)}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
});
