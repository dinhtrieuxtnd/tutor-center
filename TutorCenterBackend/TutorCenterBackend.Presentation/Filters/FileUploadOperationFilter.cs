using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TutorCenterBackend.Presentation.Filters;

/// <summary>
/// Operation filter to handle file upload operations in Swagger
/// </summary>
public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Check if any parameter has [FromForm] attribute or is IFormFile
        var hasFormFileParameters = context.ApiDescription.ParameterDescriptions
            .Any(p => p.Type == typeof(IFormFile) || 
                     p.Type == typeof(IFormFile[]) ||
                     p.Type == typeof(IEnumerable<IFormFile>));

        var hasFromFormAttribute = context.ApiDescription.ParameterDescriptions
            .Any(p => p.Source.Id == "Form");

        if (!hasFormFileParameters && !hasFromFormAttribute)
            return;

        // Clear existing parameters
        operation.Parameters.Clear();

        // Set request body to multipart/form-data
        operation.RequestBody = new OpenApiRequestBody
        {
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = new Dictionary<string, OpenApiSchema>(),
                        Required = new HashSet<string>()
                    }
                }
            }
        };

        var schema = operation.RequestBody.Content["multipart/form-data"].Schema;

        // Add all parameters from the action
        foreach (var param in context.ApiDescription.ParameterDescriptions)
        {
            if (param.Type == typeof(IFormFile))
            {
                // Handle single file upload
                schema.Properties[param.Name] = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                };
                
                if (param.IsRequired)
                {
                    schema.Required.Add(param.Name);
                }
            }
            else if (param.Type == typeof(IFormFile[]) || param.Type == typeof(IEnumerable<IFormFile>))
            {
                // Handle multiple file uploads
                schema.Properties[param.Name] = new OpenApiSchema
                {
                    Type = "array",
                    Items = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    }
                };

                if (param.IsRequired)
                {
                    schema.Required.Add(param.Name);
                }
            }
            else
            {
                // Handle other form parameters (like classroomId)
                var paramType = param.Type;
                var underlyingType = Nullable.GetUnderlyingType(paramType);
                var isNullable = underlyingType != null;
                var actualType = underlyingType ?? paramType;

                var propertySchema = new OpenApiSchema();

                if (actualType == typeof(int) || actualType == typeof(long))
                {
                    propertySchema.Type = "integer";
                }
                else if (actualType == typeof(bool))
                {
                    propertySchema.Type = "boolean";
                }
                else if (actualType == typeof(decimal) || actualType == typeof(double) || actualType == typeof(float))
                {
                    propertySchema.Type = "number";
                }
                else
                {
                    propertySchema.Type = "string";
                }

                propertySchema.Nullable = isNullable;

                schema.Properties[param.Name] = propertySchema;

                if (param.IsRequired && !isNullable)
                {
                    schema.Required.Add(param.Name);
                }
            }
        }
    }
}
