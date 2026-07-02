import { useCallback, useEffect, useMemo, useState } from "react";
import * as contactMessagesService from "../services/contactMessages.js";

export function useContactMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contactMessagesService.getContactMessages();
      setMessages(data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message || "Mesajlar yüklənmədi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function markAsRead(id) {
    await contactMessagesService.markMessageAsRead(id);
    await refresh();
  }

  async function removeMessage(id) {
    await contactMessagesService.deleteContactMessage(id);
    await refresh();
  }

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  return { messages, isLoading, error, unreadCount, markAsRead, removeMessage, refresh };
}
