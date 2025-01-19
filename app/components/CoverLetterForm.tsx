import { useState, useRef } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { toast } from "react-hot-toast";
import { generateSummary } from "@/utils/textUtils";
import { DatePicker } from "./DatePicker";
import { MissingFieldDialog } from "./MissingFieldDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CoverLetterFormProps {
  bioContext: string;
  role: string;
  language: string;
  onGenerate: (coverLetter: string) => Promise<void>;
  formState: any; // Replace 'any' with the actual type of your form state
  onFormStateChange: (state: any) => void; // Replace 'any' with the actual type of your form state
}

export function CoverLetterForm({
  bioContext,
  role,
  language,
  onGenerate,
}: CoverLetterFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isMandatoryDialogOpen, setIsMandatoryDialogOpen] = useState(false);
  const [missingField, setMissingField] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    positionApplying: role,
    hiringManager: "",
    portfolio: "",
    linkedIn: "",
    additionalInfo: "",
    letterDate: selectedDate
      ? format(selectedDate, "dd MMMM yyyy", { locale: id })
      : "",
  });

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const positionApplyingRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        letterDate: format(date, "dd MMMM yyyy", { locale: id }),
      }));
    }
  };

  const generateCoverLetter = async () => {
    const {
      fullName,
      email,
      address,
      phone,
      city,
      companyName,
      positionApplying,
    } = formData;

    // Check for missing mandatory fields
    if (!fullName) {
      setMissingField("Full Name");
      setIsMandatoryDialogOpen(true);
      fullNameRef.current?.focus();
      return;
    }
    if (!email) {
      setMissingField("Email");
      setIsMandatoryDialogOpen(true);
      emailRef.current?.focus();
      return;
    }
    if (!address) {
      setMissingField("Address");
      setIsMandatoryDialogOpen(true);
      addressRef.current?.focus();
      return;
    }
    if (!phone) {
      setMissingField("Phone Number");
      setIsMandatoryDialogOpen(true);
      addressRef.current?.focus();
      return;
    }
    if (!city) {
      setMissingField("City");
      setIsMandatoryDialogOpen(true);
      cityRef.current?.focus();
      return;
    }
    if (!companyName) {
      setMissingField("Company Name");
      setIsMandatoryDialogOpen(true);
      companyNameRef.current?.focus();
      return;
    }
    if (!positionApplying) {
      setMissingField("Position Applying For");
      setIsMandatoryDialogOpen(true);
      positionApplyingRef.current?.focus();
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
                language === "en"
                  ? "English"
                  : "Indonesian (please use proper and formal indonesian language referring to kamus besar bahasa indonesia)"
              } using the following information:

Applicant Information:
- Full Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone || "Not provided"}
- Address: ${formData.address || "Not provided"}
- City: ${formData.city || "Not provided"}

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
3. A closing paragraph expressing enthusiasm, requesting an interview, and showing gratitude.
4. Keep it brief, concise, and clear`,
            },
          ],
        }),
      });

      const data = await response.json();
      const letterContent =
        data.response || "Failed to create the cover letter. Please try again.";
      const letterContentWithBreaks = letterContent.replace(/\n/g, "<br />");

      const formattedLetter = `
<div style="text-align: right; font-weight: bold;">
  ${formData.city}, ${formData.letterDate}
</div>

<div style="margin-top: 40px;">
  <strong>${formData.fullName}</strong><br />
  ${formData.phone || ""}<br />
  ${formData.email || ""}<br />
  ${formData.address || ""}<br />
  ${formData.city || ""}
</div>

<div style="margin-top: 40px;">
  ${hiringManagerGreeting()}<br />
  <p>${formData.companyAddress || ""}</p>
</div>

<div style="margin-top: 30px; white-space: pre-wrap;">
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

      onGenerate(formattedLetter);
      toast.success("✨ Your professional cover letter is ready!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const hiringManagerGreeting = () => {
    if (!formData.hiringManager && language === "id") {
      return `Bpk/Ibu HR 
      </br> 
      <b>${formData.companyName}</b> 
      </br> Di Tempat `;
    } else if (formData.hiringManager && language === "id") {
      return `Bpk/Ibu ${formData.hiringManager} <br/>
      <b>${formData.companyName}</b>
      </br>
       Di Tempat`;
    } else {
      return `Dear HR at <b>${formData.companyName}</b>,`;
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-violet-700 flex items-center gap-2">
          Letter Date
        </Label>
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold text-violet-700 flex items-center gap-2">
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
              ref={fullNameRef}
            />
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              name="email"
              placeholder="john@example.com"
              onChange={handleInputChange}
              className="border-violet-200 focus:ring-violet-500"
              ref={emailRef}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number *</Label>
            <Input
              name="phone"
              placeholder="+1 234 567 8900"
              onChange={handleInputChange}
              className="border-violet-200 focus:ring-violet-500"
            />
          </div>
          <div className="space-y-2">
            <Label>Address *</Label>
            <Input
              name="address"
              placeholder="123 Main St"
              onChange={handleInputChange}
              className="border-violet-200 focus:ring-violet-500"
              ref={addressRef}
            />
          </div>
          <div className="space-y-2">
            <Label>City *</Label>
            <Input
              name="city"
              placeholder="City"
              onChange={handleInputChange}
              className="border-violet-200 focus:ring-violet-500"
              ref={cityRef}
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
              ref={companyNameRef}
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
              value={formData.positionApplying}
              onChange={handleInputChange}
              className="border-violet-200 focus:ring-violet-500"
              ref={positionApplyingRef}
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
        className="w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-700 shadow-lg transition-all duration-300 hover:scale-105 py-6 text-lg font-semibold"
      >
        {isGenerating ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" size={24} />
            Crafting your cover letter...
          </div>
        ) : (
          "Generate Cover Letter"
        )}
      </Button>

      <MissingFieldDialog
        isOpen={isMandatoryDialogOpen}
        onOpenChange={setIsMandatoryDialogOpen}
        missingField={missingField}
      />
    </>
  );
}
