using System.Runtime.Serialization;

namespace TutorCenterBackend.Domain.Constants
{
    public enum QuestionTypeEnum
    {
        [EnumMember(Value = "single_choice")]
        SINGLE_CHOICE,
        
        [EnumMember(Value = "multiple_choice")]
        MULTIPLE_CHOICE
    }
}