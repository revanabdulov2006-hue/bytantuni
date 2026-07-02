import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="dark min-h-screen bg-bg font-(--font-body) text-text">
      <Outlet />
    </div>
  );
}
