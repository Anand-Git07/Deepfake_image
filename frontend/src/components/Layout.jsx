import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen overflow-hidden p-3 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-[1800px] overflow-hidden rounded-[28px] border border-white/10 bg-[#101018]/90 shadow-2xl">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-5 py-7 md:px-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
