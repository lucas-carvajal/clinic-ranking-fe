import { Button } from "@/components/ui/button";
import { adminLogoutAction } from "@/lib/admin/logout-action";

/**
 * Server-rendered form so the session cookie is cleared via `Set-Cookie` from a Server Action
 * (no client-side cookie access).
 */
export function AdminLogoutForm() {
  return (
    <form action={adminLogoutAction}>
      <Button type="submit" variant="outline" size="sm">
        Abmelden
      </Button>
    </form>
  );
}
