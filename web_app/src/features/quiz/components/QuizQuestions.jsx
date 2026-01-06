import React, { useState } from 'react';
import { Plus, Trash2, FileQuestion, FolderOpen, Users, CheckCircle, Edit2, Shuffle } from 'lucide-react';
import { useAppDispatch } from '../../../core/store/hooks';
import { Button } from '../../../shared/components/ui';
import { MarkdownRenderer } from '../../../shared/components/markdown/MarkdownRenderer';
import { AddSectionPanel } from './AddSectionPanel';
import { AddQGroupPanel } from './AddQGroupPanel';
import { AddQuestionPanel } from './AddQuestionPanel';
import { AddOptionPanel } from './AddOptionPanel';
import { EditSectionPanel } from './EditSectionPanel';
import { EditQGroupPanel } from './EditQGroupPanel';
import { EditQuestionPanel } from './EditQuestionPanel';
import { EditOptionPanel } from './EditOptionPanel';
import {
    createQuizSectionAsync,
    updateQuizSectionAsync,
    deleteQuizSectionAsync,
} from '../store/quizSectionSlice';
import { createQGroupAsync, updateQGroupAsync, deleteQGroupAsync } from '../store/qGroupSlice';
import { createQuestionAsync, updateQuestionAsync, deleteQuestionAsync } from '../store/questionSlice';
import { createOptionAsync, updateOptionAsync, deleteOptionAsync } from '../store/optionSlice';

const QuizQuestions = ({ quiz, onUpdate }) => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    // Panel visibility states
    const [showAddSection, setShowAddSection] = useState(false);
    const [showAddQGroup, setShowAddQGroup] = useState(false);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [showAddOption, setShowAddOption] = useState(false);
    const [showEditSection, setShowEditSection] = useState(false);
    const [showEditQGroup, setShowEditQGroup] = useState(false);
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [showEditOption, setShowEditOption] = useState(false);

    // Entities being edited
    const [editingSection, setEditingSection] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editingOption, setEditingOption] = useState(null);

    // Context tracking for nested creation
    const [contextSectionId, setContextSectionId] = useState(null);
    const [contextGroupId, setContextGroupId] = useState(null);
    const [contextQuestionId, setContextQuestionId] = useState(null);

    const sections = quiz?.sections || [];
    const groupsWithoutSection = (quiz?.groups || []).filter((g) => !g.sectionId);
    const questionsWithoutSectionOrGroup = (quiz?.questions || []).filter(
        (q) => !q.sectionId && !q.groupId
    );

    // Count total questions
    const totalQuestions = (quiz?.questions || []).length;

    // Section handlers
    const handleAddSection = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(createQuizSectionAsync(data)).unwrap();
            setShowAddSection(false);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm('Xóa phần thi này? Tất cả câu hỏi trong phần sẽ bị xóa.')) return;
        setIsLoading(true);
        try {
            await dispatch(deleteQuizSectionAsync(sectionId)).unwrap();
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditSection = (section) => {
        setEditingSection(section);
        setShowEditSection(true);
    };

    const handleUpdateSection = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(updateQuizSectionAsync({ quizSectionId: editingSection.id, data })).unwrap();
            setShowEditSection(false);
            setEditingSection(null);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    // QGroup handlers
    const handleAddQGroup = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(createQGroupAsync(data)).unwrap();
            setShowAddQGroup(false);
            setContextSectionId(null);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteQGroup = async (groupId) => {
        if (!window.confirm('Xóa nhóm câu hỏi này? Tất cả câu hỏi trong nhóm sẽ bị xóa.')) return;
        setIsLoading(true);
        try {
            await dispatch(deleteQGroupAsync(groupId)).unwrap();
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditQGroup = (group) => {
        setEditingGroup(group);
        setShowEditQGroup(true);
    };

    const handleUpdateQGroup = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(updateQGroupAsync({ qGroupId: editingGroup.id, data })).unwrap();
            setShowEditQGroup(false);
            setEditingGroup(null);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    // Question handlers
    const handleAddQuestion = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(createQuestionAsync(data)).unwrap();
            setShowAddQuestion(false);
            setContextSectionId(null);
            setContextGroupId(null);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Xóa câu hỏi này?')) return;
        setIsLoading(true);
        try {
            await dispatch(deleteQuestionAsync(questionId)).unwrap();
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setShowEditQuestion(true);
    };

    const handleUpdateQuestion = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(updateQuestionAsync({ questionId: editingQuestion.id, data })).unwrap();
            setShowEditQuestion(false);
            setEditingQuestion(null);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    // Option handlers
    const handleAddOption = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(createOptionAsync(data)).unwrap();
            setShowAddOption(false);
            setContextQuestionId(null);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteOption = async (optionId) => {
        if (!window.confirm('Xóa đáp án này?')) return;
        setIsLoading(true);
        try {
            await dispatch(deleteOptionAsync(optionId)).unwrap();
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditOption = (option) => {
        setEditingOption(option);
        setShowEditOption(true);
    };

    const handleUpdateOption = async (data) => {
        setIsLoading(true);
        try {
            await dispatch(updateOptionAsync({ optionId: editingOption.id, data })).unwrap();
            setShowEditOption(false);
            setEditingOption(null);
            if (onUpdate) await onUpdate();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Empty state */}
            {totalQuestions === 0 ? (
                <div className="text-center py-12">
                    <FileQuestion size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light mb-4">Chưa có câu hỏi nào</p>
                    <Button onClick={() => setShowAddSection(true)}>
                        <Plus size={16} />
                        Thêm phần thi đầu tiên
                    </Button>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">
                            Cấu trúc bài kiểm tra ({totalQuestions} câu hỏi)
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => setShowAddSection(true)} size="sm" variant="outline">
                                <FolderOpen size={16} />
                                Thêm phần thi
                            </Button>
                            <Button
                                onClick={() => {
                                    setContextSectionId(null);
                                    setContextGroupId(null);
                                    setShowAddQGroup(true);
                                }}
                                size="sm"
                                variant="outline"
                            >
                                <Users size={16} />
                                Thêm nhóm
                            </Button>
                            <Button
                                onClick={() => {
                                    setContextSectionId(null);
                                    setContextGroupId(null);
                                    setShowAddQuestion(true);
                                }}
                                size="sm"
                            >
                                <Plus size={16} />
                                Thêm câu hỏi
                            </Button>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="space-y-6">
                {sections.map((section, sIdx) => (
                    <div key={section.id} className="border border-border rounded-sm">
                        {/* Section Header */}
                        <div className="bg-gray-50 p-4 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FolderOpen size={20} className="text-info" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground">{section.title}</h3>
                                        <span className="text-xs text-foreground-lighter">#{section.orderIndex}</span>
                                    </div>
                                    {section.description && (
                                        <p className="text-xs text-foreground-light mt-1">{section.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setContextSectionId(section.id);
                                        setContextGroupId(null);
                                        setShowAddQGroup(true);
                                    }}
                                >
                                    <Users size={14} />
                                    Thêm nhóm
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setContextSectionId(section.id);
                                        setContextGroupId(null);
                                        setShowAddQuestion(true);
                                    }}
                                >
                                    <Plus size={14} />
                                    Thêm câu hỏi
                                </Button>
                                <button
                                    onClick={() => handleEditSection(section)}
                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-sm"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteSection(section.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Section Content */}
                        <div className="p-4 space-y-4">
                            {/* Groups in Section */}
                            {(section.groups || []).map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    sectionId={section.id}
                                    onEditGroup={handleEditQGroup}
                                    onDeleteGroup={handleDeleteQGroup}
                                    onAddQuestion={() => {
                                        setContextSectionId(section.id);
                                        setContextGroupId(group.id);
                                        setShowAddQuestion(true);
                                    }}
                                    onEditQuestion={handleEditQuestion}
                                    onDeleteQuestion={handleDeleteQuestion}
                                    onAddOption={(questionId) => {
                                        setContextQuestionId(questionId);
                                        setShowAddOption(true);
                                    }}
                                    onEditOption={handleEditOption}
                                    onDeleteOption={handleDeleteOption}
                                />
                            ))}

                            {/* Direct Questions in Section (no group) */}
                            {(section.questions || []).map((question, qIdx) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    index={qIdx}
                                    onEdit={handleEditQuestion}
                                    onDelete={handleDeleteQuestion}
                                    onAddOption={() => {
                                        setContextQuestionId(question.id);
                                        setShowAddOption(true);
                                    }}
                                    onEditOption={handleEditOption}
                                    onDeleteOption={handleDeleteOption}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Groups without section */}
                {groupsWithoutSection.map((group) => (
                    <GroupCard
                        key={group.id}
                        group={group}
                        sectionId={null}
                        onEditGroup={handleEditQGroup}
                        onDeleteGroup={handleDeleteQGroup}
                        onAddQuestion={() => {
                            setContextSectionId(null);
                            setContextGroupId(group.id);
                            setShowAddQuestion(true);
                        }}
                        onEditQuestion={handleEditQuestion}
                        onDeleteQuestion={handleDeleteQuestion}
                        onAddOption={(questionId) => {
                            setContextQuestionId(questionId);
                            setShowAddOption(true);
                        }}
                        onEditOption={handleEditOption}
                        onDeleteOption={handleDeleteOption}
                    />
                ))}

                {/* Questions without section or group */}
                {questionsWithoutSectionOrGroup.length > 0 && (
                    <div className="border border-border rounded-sm">
                        <div className="bg-gray-50 p-4 border-b border-border">
                            <h3 className="font-semibold text-foreground">Câu hỏi chưa phân loại</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {questionsWithoutSectionOrGroup.map((question, qIdx) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    index={qIdx}
                                    onEdit={handleEditQuestion}
                                    onDelete={handleDeleteQuestion}
                                    onAddOption={() => {
                                        setContextQuestionId(question.id);
                                        setShowAddOption(true);
                                    }}
                                    onEditOption={handleEditOption}
                                    onDeleteOption={handleDeleteOption}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
                </>
            )}

            {/* Panels */}
            <AddSectionPanel
                isOpen={showAddSection}
                onClose={() => setShowAddSection(false)}
                onSubmit={handleAddSection}
                isLoading={isLoading}
                quizId={quiz.id}
            />
            <AddQGroupPanel
                isOpen={showAddQGroup}
                onClose={() => {
                    setShowAddQGroup(false);
                    setContextSectionId(null);
                }}
                onSubmit={handleAddQGroup}
                isLoading={isLoading}
                quizId={quiz.id}
                sectionId={contextSectionId}
            />
            <AddQuestionPanel
                isOpen={showAddQuestion}
                onClose={() => {
                    setShowAddQuestion(false);
                    setContextSectionId(null);
                    setContextGroupId(null);
                }}
                onSubmit={handleAddQuestion}
                isLoading={isLoading}
                quizId={quiz.id}
                sectionId={contextSectionId}
                groupId={contextGroupId}
            />
            <AddOptionPanel
                isOpen={showAddOption}
                onClose={() => {
                    setShowAddOption(false);
                    setContextQuestionId(null);
                }}
                onSubmit={handleAddOption}
                isLoading={isLoading}
                questionId={contextQuestionId}
            />
            <EditSectionPanel
                isOpen={showEditSection}
                onClose={() => {
                    setShowEditSection(false);
                    setEditingSection(null);
                }}
                onSubmit={handleUpdateSection}
                isLoading={isLoading}
                section={editingSection}
            />
            <EditQGroupPanel
                isOpen={showEditQGroup}
                onClose={() => {
                    setShowEditQGroup(false);
                    setEditingGroup(null);
                }}
                onSubmit={handleUpdateQGroup}
                isLoading={isLoading}
                group={editingGroup}
            />
            <EditQuestionPanel
                isOpen={showEditQuestion}
                onClose={() => {
                    setShowEditQuestion(false);
                    setEditingQuestion(null);
                }}
                onSubmit={handleUpdateQuestion}
                isLoading={isLoading}
                question={editingQuestion}
            />
            <EditOptionPanel
                isOpen={showEditOption}
                onClose={() => {
                    setShowEditOption(false);
                    setEditingOption(null);
                }}
                onSubmit={handleUpdateOption}
                isLoading={isLoading}
                option={editingOption}
            />
        </div>
    );
};

// Group Card Component
const GroupCard = ({ group, sectionId, onEditGroup, onDeleteGroup, onAddQuestion, onEditQuestion, onDeleteQuestion, onAddOption, onEditOption, onDeleteOption }) => {
    return (
        <div className="border border-border rounded-sm bg-blue-50/30">
            {/* Group Header */}
            <div className="bg-blue-100/50 p-3 border-b border-border flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={18} className="text-blue-600" />
                        <h4 className="font-medium text-sm text-foreground">{group.title}</h4>
                        <span className="text-xs text-foreground-lighter">#{group.orderIndex}</span>
                        {group.shuffleInside && (
                            <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-sm flex items-center gap-1">
                                <Shuffle size={12} />
                                Xáo trộn
                            </span>
                        )}
                    </div>
                    {group.introText && (
                        <MarkdownRenderer text={group.introText} className="text-xs text-foreground-light mb-2" />
                    )}
                    {/* Group Media */}
                    {group.media && group.media.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {group.media.map((m) => (
                                <img
                                    key={m.questionGroupMediaId || m.mediaId}
                                    src={m.mediaUrl}
                                    alt="Group media"
                                    className="w-20 h-20 object-cover rounded border border-border"
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onAddQuestion}
                    >
                        <Plus size={14} />
                        Thêm câu hỏi
                    </Button>
                    <button
                        onClick={() => onEditGroup(group)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-sm"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDeleteGroup(group.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Questions in Group */}
            <div className="p-3 space-y-3">
                {(group.questions || []).length > 0 ? (
                    group.questions.map((question, qIdx) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            index={qIdx}
                            onEdit={onEditQuestion}
                            onDelete={onDeleteQuestion}
                            onAddOption={() => onAddOption(question.id)}
                            onEditOption={onEditOption}
                            onDeleteOption={onDeleteOption}
                        />
                    ))
                ) : (
                    <p className="text-xs text-foreground-lighter italic text-center py-2">Chưa có câu hỏi trong nhóm</p>
                )}
            </div>
        </div>
    );
};

// Question Card Component
const QuestionCard = ({ question, index, onEdit, onDelete, onAddOption, onEditOption, onDeleteOption }) => {
    return (
        <div className="bg-white border border-border rounded-sm p-4">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-info-bg text-info rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">Câu hỏi {index + 1}</span>
                            <span className="text-xs text-foreground-lighter">#{question.orderIndex}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground-light bg-gray-100 px-2 py-1 rounded-sm border border-border">
                        {question.questionType === 0 ? 'Chọn 1' : 'Chọn nhiều'}
                    </span>
                    <span className="text-xs font-medium text-foreground bg-success-bg px-2 py-1 rounded-sm border border-success">
                        {question.points || 1} điểm
                    </span>
                    <button
                        onClick={() => onEdit(question)}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded-sm"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(question.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Question Content */}
            <div className="mb-3 pl-11">
                <MarkdownRenderer text={question.content} className="text-sm text-foreground mb-2" />
                {question.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 border-l-2 border-blue-300 rounded">
                        <p className="text-xs text-blue-700 font-medium mb-1">Giải thích:</p>
                        <MarkdownRenderer text={question.explanation} className="text-xs text-blue-700" />
                    </div>
                )}
                {/* Question Media */}
                {question.media && question.media.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {question.media.map((m) => (
                            <img
                                key={m.questionMediaId || m.mediaId}
                                src={m.mediaUrl}
                                alt="Question media"
                                className="w-24 h-24 object-cover rounded border border-border"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Options */}
            <div className="pl-11 space-y-2">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-foreground-light">Các đáp án:</p>
                    <Button size="sm" variant="outline" onClick={onAddOption}>
                        <Plus size={12} />
                        Thêm đáp án
                    </Button>
                </div>
                {question.options && question.options.length > 0 ? (
                    question.options.map((option, oIdx) => (
                        <div
                            key={option.id || oIdx}
                            className={`flex items-start gap-3 p-3 rounded-sm text-sm transition-colors ${option.isCorrect
                                ? 'bg-success-bg border border-success'
                                : 'bg-gray-50 border border-border hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                {option.isCorrect ? (
                                    <CheckCircle size={18} className="text-success" />
                                ) : (
                                    <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                        <MarkdownRenderer 
                                            text={option.content} 
                                            className={option.isCorrect ? 'text-success font-medium' : 'text-foreground'}
                                        />
                                        {/* Option Media */}
                                        {option.media && option.media.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {option.media.map((m) => (
                                                    <img
                                                        key={m.optionMediaId || m.mediaId}
                                                        src={m.mediaUrl}
                                                        alt="Option media"
                                                        className="w-20 h-20 object-cover rounded border border-border"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {option.isCorrect && (
                                        <span className="text-xs text-success whitespace-nowrap">(Đáp án đúng)</span>
                                    )}
                                    <span className="text-xs text-foreground-lighter whitespace-nowrap">#{option.orderIndex}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onEditOption(option)}
                                    className="p-1 text-blue-500 hover:bg-blue-50 rounded-sm"
                                >
                                    <Edit2 size={12} />
                                </button>
                                <button
                                    onClick={() => onDeleteOption(option.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-sm"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-foreground-lighter italic py-2">Chưa có đáp án</p>
                )}
            </div>
        </div>
    );
};

export default QuizQuestions;
