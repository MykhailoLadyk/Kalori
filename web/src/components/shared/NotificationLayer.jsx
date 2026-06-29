import { Toast } from "./Toast";
export function NotificationLayer({ notifications }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 60,
        right: 16,
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
