import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    uploadDocumentAsync,
    getAllDocumentsAsync,
    getDocumentTextAsync,
    deleteDocumentAsync,
    clearCurrentDocument,
} from '../store/aiDocumentSlice';
import { Upload, FileText, Eye, Trash2, X } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { Button } from '../../../shared/components';
import { ConfirmModal } from '../../../shared/components/ui';

export const AIDocumentsTab = ({ classroomId }) => {
    const dispatch = useAppDispatch();
    const { documents, documentText, loading, uploadLoading, deleteLoading, textLoading } = useAppSelector(
        (state) => state.aiDocument
    );
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewTextModalOpen, setViewTextModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    useEffect(() => {
        if (classroomId) {
            dispatch(getAllDocumentsAsync({ classroomId }));
        }
    }, [classroomId, dispatch]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !classroomId) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('classroomId', classroomId);
        // console.log('Uploading file for classroomId:', classroomId, 'with file:', selectedFile);
        const result = await dispatch(uploadDocumentAsync(formData));
        if (result.type.endsWith('/fulfilled')) {
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.getElementById('file-input');
            if (fileInput) fileInput.value = '';
            // Refresh list
            dispatch(getAllDocumentsAsync({ classroomId }));
        }
    };

    const handleViewText = async (document) => {
        setSelectedDocument(document);
        await dispatch(getDocumentTextAsync(document.id));
        setViewTextModalOpen(true);
    };

    const handleCloseViewText = () => {
        setViewTextModalOpen(false);
        setSelectedDocument(null);
        dispatch(clearCurrentDocument());
    };

    const handleDeleteClick = (document) => {
        setDocumentToDelete(document);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!documentToDelete) return;

        const result = await dispatch(deleteDocumentAsync(documentToDelete.id));
        if (result.type.endsWith('/fulfilled')) {
            setDeleteModalOpen(false);
            setDocumentToDelete(null);
            // Refresh list
            dispatch(getAllDocumentsAsync({ classroomId }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            Extracted: { label: 'Đã trích xuất', color: 'bg-green-100 text-green-700' },
            Failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700' },
            Processing: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700' },
        };

        const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };

        return (
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-sm ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-primary border border-border rounded-sm p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Tải tài liệu lên</h3>
                    <p className="text-sm text-foreground-light">
                        Tài liệu dùng để AI sinh câu hỏi. Hỗ trợ định dạng: PDF, DOCX, TXT
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <input
                            id="file-input"
                            type="file"
                            accept=".pdf,.docx,.doc,.txt"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-foreground-light
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-sm file:border file:border-border
                                file:text-sm file:font-medium
                                file:bg-secondary file:text-foreground
                                hover:file:bg-secondary/80
                                file:cursor-pointer cursor-pointer"
                        />
                    </div>
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploadLoading}
                        className="gap-2"
                    >
                        {uploadLoading ? (
                            <>
                                <Spinner size="sm" />
                                Đang tải...
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Tải lên
                            </>
                        )}
                    </Button>
                </div>

                {selectedFile && (
                    <div className="mt-3 text-sm text-foreground-light">
                        File đã chọn: <span className="font-medium text-foreground">{selectedFile.name}</span>
                    </div>
                )}
            </div>

            {/* Documents List */}
            <div className="bg-primary border border-border rounded-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">Danh sách tài liệu</h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Spinner size="lg" className="mx-auto mb-2" />
                            <p className="text-sm text-foreground-light">Đang tải danh sách tài liệu...</p>
                        </div>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText size={48} className="text-gray-300 mb-3" />
                        <p className="text-sm text-foreground-light">Chưa có tài liệu nào</p>
                        <p className="text-xs text-foreground-light mt-1">
                            Tải lên tài liệu để AI có thể sinh câu hỏi
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-secondary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                                        Tên file
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                                        Ngày tải lên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-light uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-primary divide-y divide-border">
                                {documents.map((document) => (
                                    <tr key={document.id} className="hover:bg-secondary/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <FileText size={16} className="text-foreground-light" />
                                                <span className="text-sm font-medium text-foreground">
                                                    {document.fileName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-light">
                                            {formatDate(document.uploadedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(document.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewText(document)}
                                                    className="text-foreground-light hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-sm"
                                                    title="Xem nội dung"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(document)}
                                                    disabled={deleteLoading}
                                                    className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-sm disabled:opacity-50"
                                                    title="Xóa tài liệu"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Text Modal */}
            {viewTextModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-primary border border-border rounded-sm shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Nội dung tài liệu</h3>
                                {selectedDocument && (
                                    <p className="text-sm text-foreground-light mt-1">
                                        {selectedDocument.fileName}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleCloseViewText}
                                className="text-foreground-light hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {textLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Spinner size="lg" className="mx-auto mb-2" />
                                        <p className="text-sm text-foreground-light">Đang tải nội dung...</p>
                                    </div>
                                </div>
                            ) : documentText ? (
                                <div className="prose max-w-none">
                                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono bg-secondary p-4 rounded-sm">
                                        {documentText}
                                    </pre>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-foreground-light">Không có nội dung</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-border flex justify-end">
                            <Button onClick={handleCloseViewText} variant="outline">
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDocumentToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa tài liệu"
                message={
                    documentToDelete
                        ? `Bạn có chắc chắn muốn xóa tài liệu "${documentToDelete.fileName}"? Các câu hỏi AI liên quan cũng sẽ bị xóa.`
                        : ''
                }
                confirmText="Xóa"
                cancelText="Hủy"
                isLoading={deleteLoading}
            />
        </div>
    );
};
