import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const ck = await cookies();
  const hdrs = await headers();
  const isLogin = hdrs.get("x-admin-login") === "1";
  const session = ck.get("admin_session")?.value;
  if (!isLogin && !session) redirect("/admin/login");
  return <>{children}</>;
}
