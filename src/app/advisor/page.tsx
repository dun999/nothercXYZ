import { Advisor } from "@/components/Advisor";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdvisorPage() {
  return (
    <div className="px-4 pt-safe mb-nav py-4">
      <div className="flex justify-end mb-2">
        <ThemeToggle />
      </div>
      <Advisor />
    </div>
  );
}
