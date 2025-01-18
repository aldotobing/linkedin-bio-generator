import { marked } from "marked";

const FormattedBio = ({ generatedBio }: { generatedBio: string }) => {
  const addLineBreaksToBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*:/g, "**$1**:<br>");
  };

  const formattedBio = marked(addLineBreaksToBold(generatedBio));

  return (
    <div
      className="mt-2 sm:mt-4 min-h-[150px] sm:min-h-[200px] prose prose-lg sm:prose-xl max-w-none antialiased text-gray-800 leading-relaxed font-sans"
      dangerouslySetInnerHTML={{ __html: formattedBio }}
    />
  );
};

export default FormattedBio;
