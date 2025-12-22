using AutoMapper;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Helpers
{
    /// <summary>
    /// Helper class for generating media URLs from storage service
    /// </summary>
    public static class MediaUrlHelper
    {
        /// <summary>
        /// Get the full URL for a media object from storage service
        /// </summary>
        /// <param name="media">The media entity containing ObjectKey and Bucket</param>
        /// <param name="storageService">The storage service instance</param>
        /// <returns>The full URL to access the media file, or null if media is null</returns>
        public static string? GetMediaUrl(Medium? media, IStorageService storageService)
        {
            if (media == null)
            {
                return null;
            }

            return storageService.GetFileUrl(media.ObjectKey, media.Bucket);
        }

        /// <summary>
        /// Map entity to DTO and set media URL using the provided selector
        /// </summary>
        /// <typeparam name="TEntity">The entity type</typeparam>
        /// <typeparam name="TDto">The DTO type</typeparam>
        /// <param name="entity">The entity to map</param>
        /// <param name="mapper">AutoMapper instance</param>
        /// <param name="storageService">Storage service instance</param>
        /// <param name="mediaSelector">Function to get the media from entity</param>
        /// <param name="urlSetter">Action to set the URL on DTO</param>
        /// <returns>The mapped DTO with media URL set</returns>
        public static TDto MapWithMediaUrl<TEntity, TDto>(
            TEntity entity,
            IMapper mapper,
            IStorageService storageService,
            Func<TEntity, Medium?> mediaSelector,
            Action<TDto, string?> urlSetter)
        {
            var dto = mapper.Map<TDto>(entity);
            var media = mediaSelector(entity);
            var url = GetMediaUrl(media, storageService);
            urlSetter(dto, url);
            return dto;
        }
    }
}
