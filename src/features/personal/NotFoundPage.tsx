import { Link } from "react-router-dom";
import { EmptyState, PageHeader } from "@/components/ui/primitives";

export default function NotFoundPage() {
  return (
    <div>
      <PageHeader title="Page not found" />
      <EmptyState title="This URL doesn't match any page" action={<Link to="/" className="text-sm text-primary">Back to the dashboard</Link>}>
        The catch-all <code>*</code> route rendered this component — exactly the not-found pattern taught in the React Router module.
      </EmptyState>
    </div>
  );
}
