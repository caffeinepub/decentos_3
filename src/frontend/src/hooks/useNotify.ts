import { toast } from "sonner";
import { useNotifications } from "../context/NotificationContext";

type NotifyType = "success" | "error" | "info";

export function useNotify() {
  const { addNotification } = useNotifications();

  const notify = (
    message: string,
    type: NotifyType = "info",
    title?: string,
  ) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);
    addNotification(
      title ??
        (type === "success" ? "Success" : type === "error" ? "Error" : "Info"),
      message,
      type,
    );
  };

  return { notify };
}
