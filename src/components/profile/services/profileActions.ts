import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customSectionRequest } from "./profileServices";
import { CustomSectionRequest, CustomSectionResponse } from '@seenelm/train-core';

export const useAddCustomSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CustomSectionRequest): Promise<CustomSectionResponse> => customSectionRequest(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
        onError: (error) => {
            console.error('Error adding custom section:', error);
        },
    });
}
