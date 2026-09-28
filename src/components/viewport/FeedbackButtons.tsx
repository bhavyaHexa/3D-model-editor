import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useMainContext } from "../../context/MainContext";
import { DialogueBox } from "./DialogueBox";
import { message } from "antd";

const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwJLhckcZcveIiRxTecnO6jTGewsGFE8VTO0k8szTVcBT2h2vLfVcjRpeE6nDMHvo1e/exec";

export const FeedbackButtons = observer(() => {
  const stateManager = useMainContext();
  const { sideBarManager } = stateManager.designManager;

  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Fetch live sync on mount
  useEffect(() => {
    fetch(WEBHOOK_URL)
      .then((res) => res.json())
      .then((data) => {
        sideBarManager.setInitialFeedbackState(
          data.approvedModels || [], 
          data.rejectedModels || []
        );
      })
      .catch((err) => {
        console.error(err);
        message.error("Live Sync Failed. Is your Webhook URL correct and deployed?");
      })
      .finally(() => setIsCheckingStatus(false));
  }, [sideBarManager]);

  const currentModelName = sideBarManager.selectedModel?.name;
  
  // Read from MobX Store
  const hasApproved = currentModelName ? sideBarManager.approvedModels.has(currentModelName) : false;
  const hasRejected = currentModelName ? sideBarManager.rejectedModels.has(currentModelName) : false;

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
    if (currentModelName) {
      sideBarManager.approveModel(currentModelName);
      submitData(getPayload("Approved"));
    }
  };

  const handleReject = () => {
    if (currentModelName) {
      sideBarManager.rejectModel(currentModelName);
      submitData(getPayload("Rejected"));
    }
  };

  const handleFeedbackSubmit = (feedbackText: string) => {
    setIsSubmitting(true);
    submitData(getPayload("Feedback", feedbackText));

    // Simulate a short delay so the user feels the submission happened
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogueOpen(false);
      message.success("Feedback sent successfully!");
    }, 500);
  };

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <div className="flex gap-4">
        {/* APPROVE BUTTON */}
        <button
          onClick={handleApprove}
          disabled={isCheckingStatus}
          className={`rounded-[20px] px-5 py-2 flex items-center gap-2 text-white text-sm font-semibold shadow-md transition-all duration-300 ${
            hasApproved 
              ? "bg-[#2e7d32] shadow-inner scale-[1.02]" 
              : hasRejected 
                ? "bg-gray-400 opacity-80 hover:bg-[#43a047] hover:opacity-100" 
                : "bg-[#4caf50] hover:bg-[#43a047]" 
          } disabled:opacity-50`}
        >
          <span className="text-lg leading-none mt-[-2px]">✓</span> {hasApproved ? "APPROVED" : "APPROVE MODEL"}
        </button>

        {/* REJECT BUTTON */}
        <button
          onClick={handleReject}
          disabled={isCheckingStatus}
          className={`rounded-[20px] px-5 py-2 flex items-center gap-2 text-white text-sm font-semibold shadow-md transition-all duration-300 ${
            hasRejected 
              ? "bg-[#c62828] shadow-inner scale-[1.02]" 
              : hasApproved 
                ? "bg-gray-400 opacity-80 hover:bg-[#e53935] hover:opacity-100" 
                : "bg-[#ef5350] hover:bg-[#e53935]" 
          } disabled:opacity-50`}
        >
          <span className="text-lg leading-none mt-[-2px]">✕</span> {hasRejected ? "REJECTED" : "REJECT MODEL"}
        </button>

        {/* FEEDBACK BUTTON */}
        <button
          onClick={() => setIsDialogueOpen(true)}
          disabled={isSubmitting}
          className="rounded-[20px] px-5 py-2 flex items-center gap-2 text-white text-sm font-semibold shadow-lg bg-gray-500 hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <span className="text-lg leading-none mt-[-2px]">💬</span> ADD FEEDBACK
        </button>
      </div>

      <div className="relative mt-2 w-full flex justify-center">
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
