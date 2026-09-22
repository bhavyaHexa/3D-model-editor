import React, { useState } from "react";

interface DialogueBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackText: string) => void;
  isSubmitting: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [feedbackText, setFeedbackText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (feedbackText.trim()) {
      onSubmit(feedbackText);
      setFeedbackText(""); // Clear on submit
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 w-80 shadow-2xl text-black border border-gray-200">
      <h2 className="text-lg font-bold mb-3">Provide Feedback</h2>
      <textarea
        className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3 text-sm"
        placeholder="Comment your Feedback"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-semibold"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors font-semibold disabled:bg-blue-400"
          onClick={handleSubmit}
          disabled={isSubmitting || !feedbackText.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};
