using Microsoft.AspNetCore.SignalR;
using TutorCenterBackend.Application.DTOs.ClassroomChat.Requests;
using TutorCenterBackend.Application.Interfaces;
using System.Security.Claims;

namespace TutorCenterBackend.Presentation.Hubs
{
    public class ClassroomChatHub(IClassroomChatService chatService) : Hub
    {
        private readonly IClassroomChatService _chatService = chatService;

        public override async Task OnConnectedAsync()
        {
            var classroomId = Context.GetHttpContext()?.Request.Query["classroomId"].ToString();
            
            if (!string.IsNullOrEmpty(classroomId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"classroom_{classroomId}");
            }
            
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var classroomId = Context.GetHttpContext()?.Request.Query["classroomId"].ToString();
            
            if (!string.IsNullOrEmpty(classroomId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"classroom_{classroomId}");
            }
            
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinClassroom(int classroomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"classroom_{classroomId}");
        }

        public async Task LeaveClassroom(int classroomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"classroom_{classroomId}");
        }

        public async Task SendMessage(SendMessageRequestDto dto)
        {
            try
            {
                var message = await _chatService.SendMessageAsync(dto, Context.ConnectionAborted);
                
                // Broadcast message to all users in the classroom group
                await Clients.Group($"classroom_{dto.ClassroomId}")
                    .SendAsync("ReceiveMessage", message);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task EditMessage(EditMessageRequestDto dto)
        {
            try
            {
                var message = await _chatService.EditMessageAsync(dto, Context.ConnectionAborted);
                
                // Broadcast edited message to all users in the classroom group
                await Clients.Group($"classroom_{message.ClassroomId}")
                    .SendAsync("MessageEdited", message);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task DeleteMessage(int messageId)
        {
            try
            {
                // First get the message to know which classroom it belongs to
                // (You may need to add a method to get message by ID in service)
                await _chatService.DeleteMessageAsync(messageId, Context.ConnectionAborted);
                
                // Broadcast deletion to all users
                // Note: You might need to include classroomId in the response
                await Clients.All.SendAsync("MessageDeleted", messageId);
            }
            catch (Exception ex)
            {
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task UserTyping(int classroomId, string userName)
        {
            await Clients.OthersInGroup($"classroom_{classroomId}")
                .SendAsync("UserTyping", userName);
        }

        public async Task UserStoppedTyping(int classroomId, string userName)
        {
            await Clients.OthersInGroup($"classroom_{classroomId}")
                .SendAsync("UserStoppedTyping", userName);
        }
    }
}
