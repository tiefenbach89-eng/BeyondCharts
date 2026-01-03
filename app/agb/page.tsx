import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function Page() {
  return (
    <div className="ff-container py-6 md:py-10">
      <Badge>Legal</Badge>
      <h1 className="mt-3 text-2xl font-semibold md:text-3xl">AGB</h1>
      <div className="mt-6">
        <Card className="p-4 md:p-5">
          <p className="text-sm ff-muted">
            Platzhalter. Hier kommt der finale Text rein. (Demo-Projekt)
          </p>
        </Card>
      </div>
    </div>
  );
}
