import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/users/store/userSlice';
import authReducer from '../../features/auth/store/authSlice';
import notificationReducer from '../../features/notification/store/notificationSlice';
import profileReducer from '../../features/profile/store/profileSlice';
import mediaReducer from '../../features/media/store/mediaSlice';
import roleReducer from '../../features/role/store/roleSlice';
import permissionReducer from '../../features/permission/store/permissionSlice';
import classroomReducer from '../../features/classroom/store/classroomSlice';
import clrStudentReducer from '../../features/classroom/store/clrStudentSlice';
import classroomChatReducer from '../../features/classroom/store/classroomChatSlice';
import lessonReducer from '../../features/lesson/store/lessonSlice';
import lectureReducer from '../../features/lecture/store/lectureSlice';
import exerciseReducer from '../../features/exercise/store/exerciseSlice';
import quizReducer from '../../features/quiz/store/quizSlice';
import quizSectionReducer from '../../features/quiz/store/quizSectionSlice';
import qGroupReducer from '../../features/quiz/store/qGroupSlice';
import questionReducer from '../../features/quiz/store/questionSlice';
import optionReducer from '../../features/quiz/store/optionSlice';
import quizAttemptReducer from '../../features/quiz/store/quizAttemptSlice';
import quizAnswerReducer from '../../features/quiz/store/quizAnswerSlice';
import paymentReducer from '../../features/payment/store/paymentSlice';
import aiDocumentReducer from '../../features/ai/store/aiDocumentSlice';
import aiQuestionReducer from '../../features/ai/store/aiQuestionSlice';
import joinRequestReducer from '../../features/joinRequest/store/joinRequestSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    notification: notificationReducer,
    profile: profileReducer,
    media: mediaReducer,
    role: roleReducer,
    permission: permissionReducer,
    classroom: classroomReducer,
    clrStudent: clrStudentReducer,
    classroomChat: classroomChatReducer,
    lesson: lessonReducer,
    lecture: lectureReducer,
    exercise: exerciseReducer,
    quiz: quizReducer,
    quizSection: quizSectionReducer,
    qGroup: qGroupReducer,
    question: questionReducer,
    option: optionReducer,
    quizAttempt: quizAttemptReducer,
    quizAnswer: quizAnswerReducer,
    payment: paymentReducer,
    aiDocument: aiDocumentReducer,
    aiQuestion: aiQuestionReducer,
    joinRequest: joinRequestReducer,
  },
});
