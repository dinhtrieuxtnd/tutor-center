using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Infrastructure.Helpers
{

    public static class QueryHelper
    {
        /// <summary>
        /// Apply search filter to query based on search term and specified properties
        /// </summary>
        public static IQueryable<T> ApplySearch<T>(
            this IQueryable<T> query,
            string? search,
            params Expression<Func<T, string>>[] properties) where T : class
        {
            if (string.IsNullOrWhiteSpace(search) || properties.Length == 0)
                return query;

            // Build OR condition for all properties
            Expression<Func<T, bool>>? combinedFilter = null;

            foreach (var property in properties)
            {
                var parameter = property.Parameters[0];
                var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) })!;
                var searchConstant = Expression.Constant(search);
                var containsCall = Expression.Call(property.Body, containsMethod, searchConstant);
                var lambda = Expression.Lambda<Func<T, bool>>(containsCall, parameter);

                combinedFilter = combinedFilter == null
                    ? lambda
                    : CombineOr(combinedFilter, lambda);
            }

            return combinedFilter != null ? query.Where(combinedFilter) : query;
        }

        /// <summary>
        /// Apply sorting to query based on sort field and order
        /// </summary>
        public static IQueryable<T> ApplySorting<T, TKey>(
            this IQueryable<T> query,
            Expression<Func<T, TKey>> keySelector,
            EnumOrder order) where T : class
        {
            return order == EnumOrder.ASC
                ? query.OrderBy(keySelector)
                : query.OrderByDescending(keySelector);
        }

        /// <summary>
        /// Calculate skip and take values for pagination
        /// </summary>
        public static (int Skip, int Take) CalculatePagination(int page, int limit)
        {
            var skip = (page - 1) * limit;
            return (skip, limit);
        }

        /// <summary>
        /// Apply pagination to query
        /// </summary>
        public static IQueryable<T> ApplyPagination<T>(
            this IQueryable<T> query,
            int page,
            int limit) where T : class
        {
            var (skip, take) = CalculatePagination(page, limit);
            return query.Skip(skip).Take(take);
        }

        /// <summary>
        /// Build paginated response
        /// </summary>
        public static PageResultDto<T> BuildPageResult<T>(
            int page,
            int limit,
            int total,
            IEnumerable<T> items)
        {
            return new PageResultDto<T>
            {
                Page = page,
                Limit = limit,
                Total = total,
                Items = items
            };
        }

        /// <summary>
        /// Execute query with pagination and return tuple of (items, total)
        /// </summary>
        public static async Task<(IEnumerable<T> Items, int Total)> ExecutePaginatedQueryAsync<T>(
            this IQueryable<T> query,
            int page,
            int limit,
            CancellationToken ct = default) where T : class
        {
            var total = await query.CountAsync(ct);
            var items = await query.ApplyPagination(page, limit).ToListAsync(ct);
            return (items, total);
        }

        /// <summary>
        /// Combine two expressions with OR operator
        /// </summary>
        private static Expression<Func<T, bool>> CombineOr<T>(
            Expression<Func<T, bool>> expr1,
            Expression<Func<T, bool>> expr2)
        {
            var parameter = expr1.Parameters[0];
            var body = Expression.OrElse(expr1.Body, Expression.Invoke(expr2, parameter));
            return Expression.Lambda<Func<T, bool>>(body, parameter);
        }
    }
}