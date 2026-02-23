import { useState, useEffect, useCallback } from "react";
import {
  getReadContract,
  getSignerContract,
  type ConfessionData,
  CONTRACT_ADDRESS,
} from "../utils/contract";

export function useConfessions(account: string | null) {
  const [confessions, setConfessions] = useState<ConfessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfessions = useCallback(async () => {
    if (!CONTRACT_ADDRESS) {
      setLoading(false);
      setError("Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const contract = getReadContract();
      const data = await contract.getConfessions();
      const parsed: ConfessionData[] = data.map(
        (c: { text: string; wallet: string; timestamp: bigint; votes: bigint }, i: number) => ({
          id: i,
          text: c.text,
          wallet: c.wallet,
          timestamp: Number(c.timestamp),
          votes: Number(c.votes),
        })
      );
      // Newest first
      setConfessions(parsed.reverse());
    } catch (err) {
      console.error("Error fetching confessions:", err);
      setError("Failed to load confessions. The contract may not be deployed yet.");
    } finally {
      setLoading(false);
    }
  }, []);

  const postConfession = useCallback(
    async (text: string) => {
      const contract = await getSignerContract();
      const tx = await contract.postConfession(text);
      await tx.wait();
      await fetchConfessions();
    },
    [fetchConfessions]
  );

  const upvote = useCallback(
    async (id: number) => {
      const contract = await getSignerContract();
      const tx = await contract.upvote(id);
      await tx.wait();
      await fetchConfessions();
    },
    [fetchConfessions]
  );

  const downvote = useCallback(
    async (id: number) => {
      const contract = await getSignerContract();
      const tx = await contract.downvote(id);
      await tx.wait();
      await fetchConfessions();
    },
    [fetchConfessions]
  );

  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions, account]);

  return { confessions, loading, error, fetchConfessions, postConfession, upvote, downvote };
}
