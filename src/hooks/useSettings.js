import { useCallback, useEffect, useState } from "react";
import * as settingsService from "../services/settings.js";

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err.message || "Ayarlar yüklənmədi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function updateSection(section, values) {
    const next = await settingsService.updateSettingsSection(section, values);
    setSettings(next);
  }

  return { settings, isLoading, error, updateSection, refresh };
}
