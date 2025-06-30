import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customSectionRequest, fetchCertifications } from "./profileServices";
import {
  CustomSectionRequest,
  CustomSectionResponse,
} from "@seenelm/train-core";

interface UseCertificationSearchProps {
  searchTerm: string;
  page: number;
  pageSize?: number;
  enabled?: boolean;
}

export const useAddCustomSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      request: CustomSectionRequest
    ): Promise<CustomSectionResponse> => customSectionRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Error adding custom section:", error);
    },
  });
};

export const useCertificationSearch = ({
  searchTerm,
  page,
  pageSize = 20,
  enabled = true,
}: UseCertificationSearchProps) => {
  return useQuery({
    queryKey: ["certifications", "search", searchTerm, page, pageSize],
    queryFn: () => fetchCertifications(searchTerm, page, pageSize),
    enabled: enabled && searchTerm.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry if it's a validation error
      if (
        error instanceof Error &&
        error.message.includes("Search term must be")
      ) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
