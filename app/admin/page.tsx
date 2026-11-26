import { isAdmin, usingDefaultPassword } from "@/lib/auth";
import { getContent, getMessages, listUploads } from "@/lib/content";
import Login from "@/components/admin/Login"; import AdminApp from "@/components/admin/AdminApp";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  if (!await isAdmin()) return <Login defaultPw={await usingDefaultPassword()} />;
  const [initial, uploads, messages, defaultPw] = await Promise.all([getContent(), listUploads(), getMessages(), usingDefaultPassword()]);
  return <AdminApp initial={initial} uploads={uploads} messages={messages} defaultPw={defaultPw} />;
}
