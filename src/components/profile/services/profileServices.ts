import api from "../../../services/apiClient";
import { CustomSectionRequest, CustomSectionResponse } from "@seenelm/train-core";
import { tokenService } from "../../../services/tokenService";

export const customSectionRequest = async (customSectionRequest: CustomSectionRequest): Promise<CustomSectionResponse> => {
    try {
        // Get the user data from localStorage
        const userDataString = tokenService.getUser();
        if (!userDataString) {
            throw new Error("User not authenticated");
        }
        
        const userData = JSON.parse(userDataString);
        const userId = userData.userId;
        
        if (!userId) {
            throw new Error("User ID not found");
        }
        
        // Ensure the request data is properly formatted
        if (!customSectionRequest.details || !Array.isArray(customSectionRequest.details) || customSectionRequest.details.length === 0) {
            throw new Error("Custom section details must be a non-empty array");
        }
        
        // Log the request for debugging
        console.log('Sending request to API:', {
            userId,
            endpoint: `/user-profile/${userId}/custom-section`,
            data: {
                title: customSectionRequest.title,
                details: customSectionRequest.details
            }
        });
        
        // Include userId in the API endpoint path and ensure we're sending the correct data structure
        const response = await api.post<CustomSectionResponse>(
            `/user-profile/${userId}/custom-section`, 
            {
                title: customSectionRequest.title,
                details: customSectionRequest.details
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding custom section:", error);
        throw error;
    }
}