import { useState, useMemo, useEffect } from "react";

export const useTableFilters = (
  data = [],
  searchFields = [],
  initialItemsPerPage = 20
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = field.split(".").reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(lowerSearch);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((item) => {
          const itemValue = key.split(".").reduce((obj, k) => obj?.[k], item);
          return itemValue === value;
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, searchFields]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      console.log('[useTableFilters] useEffect: currentPage > totalPages, resetting to:', totalPages);
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value) => {
    console.log('[useTableFilters] handleSearchChange:', value, '-> resetting to page 1');
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      // Không làm gì nếu giá trị không thay đổi
      if (prev[key] === value) {
        console.log('[useTableFilters] handleFilterChange: no change', key, value);
        return prev;
      }

      // Reset về trang 1 khi filter thay đổi
      console.log('[useTableFilters] handleFilterChange:', key, value, '-> resetting to page 1');
      setCurrentPage(1);
      return { ...prev, [key]: value };
    });
  };

  const handlePageChange = (page) => {
    console.log('[useTableFilters] handlePageChange: from', currentPage, 'to', page);
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    console.log('[useTableFilters] handleItemsPerPageChange:', value, '-> resetting to page 1');
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    console.log('[useTableFilters] resetFilters -> resetting to page 1');
    setSearchTerm("");
    setFilters({});
    setCurrentPage(1);
  };

  return {
    // Data
    filteredData,
    paginatedData,

    // Search
    searchTerm,
    setSearchTerm: handleSearchChange,

    // Filters
    filters,
    setFilter: handleFilterChange,
    resetFilters,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage: handlePageChange,
    setItemsPerPage: handleItemsPerPageChange,

    // Stats
    totalItems: filteredData.length,
    totalOriginalItems: data.length,
  };
};
