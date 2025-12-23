import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "../../lib/utils"

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = React.forwardRef(
  ({ className, isActive, size = "icon", ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "hover:bg-accent hover:text-accent-foreground",
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 rounded-md px-3",
        size === "lg" && "h-11 rounded-md px-8",
        size === "icon" && "h-10 w-10",
        className
      )}
      {...props}
    />
  )
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = React.forwardRef(
  ({ className, ...props }, ref) => (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      ref={ref}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  )
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef(
  ({ className, ...props }, ref) => (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      ref={ref}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}

// Default export wrapper for convenience
const PaginationWrapper = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}) => {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of pages to show
  const getPageNumbers = () => {
    const pages = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

    // Always show first page
    pages.push(1);

    // Add left ellipsis if needed
    if (shouldShowLeftEllipsis) {
      pages.push('ellipsis');
    }

    // Add pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Add right ellipsis if needed
    if (shouldShowRightEllipsis) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={cn('', className)}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              'h-10 px-4 py-2 gap-1.5 border border-neutral-200 bg-white text-neutral-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200 disabled:hover:text-neutral-700'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const isActive = page === currentPage;

          return (
            <PaginationItem key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={cn(
                  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2',
                  isActive
                    ? 'h-10 w-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-600 shadow-md hover:from-orange-600 hover:to-orange-700 cursor-pointer'
                    : 'h-10 w-10 border border-neutral-200 bg-white text-neutral-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 cursor-pointer'
                )}
              >
                {page}
              </button>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              'h-10 px-4 py-2 gap-1.5 border border-neutral-200 bg-white text-neutral-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200 disabled:hover:text-neutral-700'
            )}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationWrapper;
