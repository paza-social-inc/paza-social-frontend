// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
//
// export default function FeedBackTab() {
//   return (
//     <div className="flex flex-col gap-4">
//
//           <h2 className="mb-2 text-sm font-semibold">Send us feedback</h2>
//           <form className="space-y-3">
//             <Textarea
//               id="feedback"
//               placeholder="Leave a feedback"
//               aria-label="Send feedback"
//             />
//             <div className="flex flex-col sm:flex-row sm:justify-end">
//               <Button size="sm">Send feedback</Button>
//             </div>
//           </form>      
//     </div>
//   )
// }

// feedBack.tsx (or whatever file contains FeedBackTab)
"use client"
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pazaApi } from "@/lib/axiosClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface FeedBackTabProps {
  campaignId: number;
}

export default function FeedBackTab({ campaignId }: FeedBackTabProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [desc, setDesc] = useState("");

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; feedback: string; desc: string }) => {
      const response = await pazaApi.post(`/api/campaign/${campaignId}/feedback`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      // Clear form
      setName("");
      setEmail("");
      setFeedback("");
      setDesc("");
      // Refresh campaign data
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    submitFeedbackMutation.mutate({ name, email, feedback, desc });
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold mb-3">Leave Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Your email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Textarea
          placeholder="Your feedback *"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          rows={4}
        />
        <Input
          placeholder="Additional description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={submitFeedbackMutation.isPending}
        >
          {submitFeedbackMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </form>
    </div>
  );
}
