import { useState, useEffect, useCallback } from "react";
import { DiscussionTopic, DiscussionTopicFormData } from "../types/discussionTopic";
import { discussionTopicsApi } from "../services/api";
import { toast } from "sonner";

export function useDiscussionTopics() {
  const [topics, setTopics] = useState<DiscussionTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await discussionTopicsApi.getAll();
      if (response.success && response.data) {
        setTopics(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch discussion topics");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch discussion topics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const createTopic = useCallback(async (data: DiscussionTopicFormData) => {
    try {
      const response = await discussionTopicsApi.create(data);
      if (response.success && response.data) {
        setTopics((prev) => [...prev, response.data!].sort((a, b) => a.order - b.order));
        toast.success("Discussion topic created successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create discussion topic");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create discussion topic";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateTopic = useCallback(async (id: string, data: DiscussionTopicFormData) => {
    try {
      const response = await discussionTopicsApi.update(id, data);
      if (response.success && response.data) {
        setTopics((prev) =>
          prev.map((topic) => (topic.id === id ? response.data! : topic))
            .sort((a, b) => a.order - b.order)
        );
        toast.success("Discussion topic updated successfully");
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update discussion topic");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update discussion topic";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const deleteTopic = useCallback(async (id: string) => {
    try {
      const response = await discussionTopicsApi.delete(id);
      if (response.success) {
        setTopics((prev) => prev.filter((topic) => topic.id !== id));
        toast.success("Discussion topic deleted successfully");
      } else {
        throw new Error(response.error || "Failed to delete discussion topic");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete discussion topic";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  return {
    topics,
    loading,
    error,
    fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic,
  };
}

