import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ClipboardCopy,
  Download,
  UserCircle,
  Building2,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { generateSummary } from "@/utils/textUtils";
import { format } from "date-fns";

interface CoverLetterGeneratorProps {
  bioContext: string;
  role: string;
  vibe: string;
  language: string;
}

export function CoverLetterGenerator({
  bioContext,
  role,
  vibe,
  language,
}: CoverLetterGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "dd MMMM yyyy")
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    positionApplying: "",
    hiringManager: "",
    portfolio: "",
    linkedIn: "",
    additionalInfo: "",
    letterDate: currentDate,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { generateDOCX } = usePDFGeneration();

  async function generateCoverLetter() {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.companyName ||
      !formData.positionApplying
    ) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    setIsGenerating(true);
    const bioSummary = generateSummary(bioContext, 100);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL || "", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Write only the body content of a professional cover letter in ${
                language === "en" ? "English" : "Indonesian"
              } using the following information:
  
  Applicant Information:
  - Full Name: ${formData.fullName}
  - Email: ${formData.email}
  - Phone: ${formData.phone || "Not provided"}
  - Address: ${formData.address || "Not provided"}
  
  Company Information:
  - Company Name: ${formData.companyName}
  - Company Address: ${formData.companyAddress || "Not provided"}
  - Position Applying For: ${formData.positionApplying}
  - Hiring Manager: ${formData.hiringManager || "Not specified"}
  
  Professional Background Summary:
  ${bioSummary}
  
  Additional Information:
  ${formData.additionalInfo || "None"}
  
  Do not include the applicant's name, date, or closing remarks. Focus on:
  1. A strong introduction mentioning the position and source of information.
  2. Relevant experience, skills, and contributions.
  3. A closing paragraph expressing enthusiasm, requesting an interview, and showing gratitude.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const letterContent =
        data.response || "Failed to create the cover letter. Please try again.";
      const letterContentWithBreaks = letterContent.replace(/\n/g, "<br />");

      // Static modification of the generated content
      const formattedLetter = `
  <div style="text-align: right; font-weight: bold;">
    ${formData.letterDate}
  </div>
  
  <div style="margin-top: 40px;">
    <strong>${formData.fullName}</strong><br />
    ${formData.phone || ""}<br />
    ${formData.email || ""}<br />
    ${formData.address || ""}
  </div>
  
  <div style="margin-top: 40px;">
    <p>Dear HR at ${formData.companyName},</p>
    <p>${formData.companyAddress || ""}</p>
  </div>
  
  <div style="margin-top: 40px; white-space: pre-wrap;">
    ${letterContentWithBreaks}
  </div>
  
  <div style="margin-top: 40px;">
  ${language === "id" ? "Hormat Saya," : "Sincerely,"}<br />
  <br>
  <br>
  ${formData.fullName}
</div>
  
  <div style="margin-top: 40px;">
  ${
    language === "id"
      ? "<strong>Lampiran:</strong><br />"
      : "<strong>Attachments:</strong><br />"
  }
  - CV<br />
  - ${
    language === "id"
      ? "Salinan Ijazah dan Transkrip"
      : "Copy of diploma and transcript"
  }<br />
  - ${language === "id" ? "Portfolio " : "Portfolio "}<br />
</div>
  `;

      setGeneratedCoverLetter(formattedLetter);
      toast.success("✨ Your professional cover letter is ready!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="ml-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
      >
        <UserCircle size={20} />
        Create Professional Cover Letter ✨
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-violet-50 to-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-violet-700 flex items-center gap-2">
              <Building2 size={24} />
              Professional Cover Letter Generator
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Fill out the details below to generate a tailored and professional
              cover letter.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-violet-600" />
                <Label className="text-lg font-semibold text-violet-700">
                  Letter Date
                </Label>
              </div>
              <Input
                name="letterDate"
                value={formData.letterDate}
                onChange={handleInputChange}
                className="w-48"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-violet-700 flex items-center gap-2">
                <UserCircle size={20} />
                Your Information
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    name="fullName"
                    placeholder="John Doe"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    name="email"
                    placeholder="john@example.com"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    name="phone"
                    placeholder="+1 234 567 8900"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    name="address"
                    placeholder="123 Main St, City"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio URL</Label>
                  <Input
                    name="portfolio"
                    placeholder="portfolio.com"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    name="linkedIn"
                    placeholder="linkedin.com/in/johndoe"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-violet-700 flex items-center gap-2">
                <Building2 size={20} />
                Company Information
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    name="companyName"
                    placeholder="Company Name"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Address</Label>
                  <Input
                    name="companyAddress"
                    placeholder="Company Address"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Email</Label>
                  <Input
                    name="companyEmail"
                    placeholder="hr@company.com"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Phone</Label>
                  <Input
                    name="companyPhone"
                    placeholder="Company Phone"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position Applying For *</Label>
                  <Input
                    name="positionApplying"
                    placeholder="Position Title"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hiring Manager Name</Label>
                  <Input
                    name="hiringManager"
                    placeholder="Mr./Ms. Last Name"
                    onChange={handleInputChange}
                    className="border-violet-200 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Information (Optional)</Label>
              <Textarea
                name="additionalInfo"
                placeholder="Any specific points you'd like to mention..."
                onChange={handleInputChange}
                className="border-violet-200 focus:ring-violet-500 h-24"
              />
            </div>

            <Button
              onClick={generateCoverLetter}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-700 shadow-lg transition-all duration-300 hover:scale-105 py-6 text-lg font-semibold"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" size={24} />
                  Generating Your Cover Letter...
                </div>
              ) : (
                "Generate Cover Letter"
              )}
            </Button>

            {generatedCoverLetter && (
              <div className="mt-6 space-y-4">
                <Label className="text-xl font-semibold text-green-700 flex items-center gap-2">
                  Your Professional Cover Letter
                </Label>
                <div
                  className="mt-2 p-6 border rounded-lg bg-white shadow-lg"
                  dangerouslySetInnerHTML={{ __html: generatedCoverLetter }}
                />
                <div className="flex gap-4 mt-4 justify-end">
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        generatedCoverLetter.replace(/<[^>]+>/g, "")
                      )
                    }
                    className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2 transition-all hover:scale-105 px-6"
                  >
                    <ClipboardCopy size={18} /> Copy to Clipboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
