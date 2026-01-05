import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const aiDocumentApi = {
    /**
     * Upload a document for AI question generation
     * @param {FormData} formData - Contains file and classroomId
     * @returns {Promise<Object>}
     */
    upload: (formData) => {
        // console.log('Uploading AI document with formData:', formData);
        return axiosClient.post(API_ENDPOINTS.AI_DOCUMENTS.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Get document by ID
     * @param {number} documentId
     * @returns {Promise<Object>}
     */
    getById: (documentId) => {
        return axiosClient.get(API_ENDPOINTS.AI_DOCUMENTS.GET_BY_ID(documentId));
    },

    /**
     * Get all documents for current user
     * @param {Object} params - { classroomId?: number }
     * @returns {Promise<Array>}
     */
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.AI_DOCUMENTS.GET_ALL, { params });
    },

    /**
     * Get extracted text from a document
     * @param {number} documentId
     * @returns {Promise<Object>}
     */
    getText: (documentId) => {
        return axiosClient.get(API_ENDPOINTS.AI_DOCUMENTS.GET_TEXT(documentId));
    },

    /**
     * Delete a document and all associated generated questions
     * @param {number} documentId
     * @returns {Promise<Object>}
     */
    delete: (documentId) => {
        return axiosClient.delete(API_ENDPOINTS.AI_DOCUMENTS.DELETE(documentId));
    },
};
