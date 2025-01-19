import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale/id";
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

interface CoverLetterGeneratorProps {
  bioContext: string;
  role: string;
  vibe: string;
  language: string;
  className?: string;
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
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
    positionApplying: role, // Default to role prop
    hiringManager: "",
    portfolio: "",
    linkedIn: "",
    additionalInfo: "",
    letterDate: selectedDate
      ? format(selectedDate, "dd MMMM yyyy", { locale: id })
      : "",
  });

  const [isMandatoryDialogOpen, setIsMandatoryDialogOpen] = useState(false);
  const [missingField, setMissingField] = useState("");

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
    setIsDatePickerOpen(false); // Close the date picker after selection
  };

  const areRequiredFieldsFilled = () => {
    const { fullName, email, address, city, companyName, positionApplying } =
      formData;
    return (
      fullName && email && address && city && companyName && positionApplying
    );
  };

  const hiringManagerGreeting = () => {
    if (!formData.hiringManager && language === "id") {
      return `Bpk/Ibu HR 
      </br> 
      ${formData.companyName} 
      </br> Di Tempat `;
    } else if (formData.hiringManager && language === "id") {
      return `Bpk/Ibu ${formData.hiringManager} <br/>
      ${formData.companyName}
      </br>
       Di Tempat`;
    } else {
      return `Dear HR at ${formData.companyName},`;
    }
  };

  const generateCoverLetter = async () => {
    const { fullName, email, address, city, companyName, positionApplying } =
      formData;

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

    setGeneratedCoverLetter(""); // Clear the generated letter
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

      setGeneratedCoverLetter(formattedLetter);
      toast.success("✨ Your professional cover letter is ready!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Add a useEffect to handle clicks outside the date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const datePicker = document.querySelector(".react-datepicker");
      if (datePicker && !datePicker.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="ml-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
      >
        <UserCircle size={20} />
        Create Cover Letter ✨
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
              <Label className="text-lg font-semibold text-violet-700 flex items-center gap-2">
                <Calendar size={20} />
                Letter Date
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.letterDate}
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  onBlur={() => setIsDatePickerOpen(false)}
                  placeholder="Select a date"
                  className="pl-10 pr-4 py-2 w-48 border-violet-300 focus:ring-violet-500 focus:border-violet-500 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                  readOnly
                />
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500"
                  size={20}
                />
              </div>

              {isDatePickerOpen && (
                <div className="absolute z-10 mt-2 bg-white border border-violet-200 rounded-lg shadow-lg">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    locale={id}
                    modifiersClassNames={{
                      selected: "bg-violet-500 text-white",
                      today: "font-bold text-violet-500",
                    }}
                    className="p-4"
                  />
                </div>
              )}
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
                  <Label>Phone Number</Label>
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

            {generatedCoverLetter ? (
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
            ) : (
              <div className="mt-6 space-y-4">
                <Label className="text-xl font-semibold text-green-700 flex items-center gap-2">
                  Your Professional Cover Letter
                </Label>
                <div className="mt-2 p-6 border rounded-lg bg-white shadow-lg">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-48">
                      <Loader2
                        className="animate-spin text-green-500"
                        size={48}
                      />
                      <span className="ml-4 text-lg text-green-700">
                        Crafting your cover letter...
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Your cover letter will appear here.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for missing mandatory fields */}
      <Dialog
        open={isMandatoryDialogOpen}
        onOpenChange={setIsMandatoryDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Missing Required Field</DialogTitle>
            <DialogDescription>
              Please fill in the <strong>{missingField}</strong> field to
              proceed.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setIsMandatoryDialogOpen(false)}
            className="mt-4"
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
