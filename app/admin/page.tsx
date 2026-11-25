import { isAdmin, usingDefaultPassword } from "@/lib/auth";
import { getContent, getMessages, listUploads } from "@/lib/content";
import Login from "@/components/admin/Login"; import AdminApp from "@/components/admin/AdminApp";
export const dynamic = "force-dynamic";
export default function AdminPage() {
  if (!isAdmin()) return <Login defaultPw={usingDefaultPassword()} />;
  return <AdminApp initial={getContent()} uploads={listUploads()} messages={getMessages()} defaultPw={usingDefaultPassword()} />;
}
