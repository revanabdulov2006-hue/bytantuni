import { useCallback, useEffect, useState } from "react";
import * as campaignsService from "../services/campaigns.js";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await campaignsService.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.message || "Kampaniyalar yüklənmədi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addCampaign(data) {
    await campaignsService.createCampaign(data);
    await refresh();
  }

  async function editCampaign(id, patch) {
    await campaignsService.updateCampaign(id, patch);
    await refresh();
  }

  async function removeCampaign(id) {
    await campaignsService.deleteCampaign(id);
    await refresh();
  }

  return { campaigns, isLoading, error, addCampaign, editCampaign, removeCampaign, refresh };
}
