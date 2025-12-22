using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace TutorCenterBackend.Presentation.Attributes
{
    public class ValidateIdAttribute : ActionFilterAttribute
    {
        private readonly string _parameterName;

        public ValidateIdAttribute(string parameterName = "id")
        {
            _parameterName = parameterName;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.ActionArguments.TryGetValue(_parameterName, out var value))
            {
                if (value is int id)
                {
                    if (id <= 0)
                    {
                        context.Result = new BadRequestObjectResult(new
                        {
                            error = "Id phải là số nguyên lớn hơn 0"
                        });
                        return;
                    }
                }
            }

            base.OnActionExecuting(context);
        }
    }
}
