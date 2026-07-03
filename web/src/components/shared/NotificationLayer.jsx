import { Toast } from "./Toast";
export function NotificationLayer({ notifications }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 60,
        right: "max(16px, calc(50vw - 240px + 16px))",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} />
      ))}
    </div>
  );
}
