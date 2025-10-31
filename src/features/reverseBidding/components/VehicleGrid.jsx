import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import VehicleCard from './VehicleCard';
import FilterSidebar from './FilterSidebar';
import FilterContent from './FilterContent';
import { startReverseBiddingThunk, fetchMockCarsThunk, setPage } from '../redux/reverseBidSlice';
import { useNavigate } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from '../../../components/ui/drawer';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from '../../../components/ui/pagination';

export default function VehicleGrid({ cars }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, pagination, filters } = useSelector((s) => s.reverseBid);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleStart = async (car, criteria) => {
        const res = await dispatch(startReverseBiddingThunk({ carData: car, criteria }));
        const payload = res?.payload;
        if (payload?.sessionId) {
            navigate(`/reverse-bidding/session/${payload.sessionId}`);
        }
    };

    const handlePageChange = async (page) => {
        dispatch(setPage(page));
        await dispatch(fetchMockCarsThunk({ filters, page, perPage: pagination.per_page }));
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPaginationItems = () => {
        const items = [];
        const { current_page, total_pages } = pagination;
        const addedPages = new Set(); // Track which pages we've already added

        // Base button styling
        const baseButtonClass = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
        const pageButtonClass = "h-10 w-10 border border-neutral-200 bg-white text-neutral-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 cursor-pointer";
        const activeButtonClass = "h-10 w-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-600 shadow-md hover:from-orange-600 hover:to-orange-700 cursor-pointer";
        const navButtonClass = "h-10 px-4 py-2 gap-1.5 border border-neutral-200 bg-white text-neutral-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-neutral-200 disabled:hover:text-neutral-700";

        // Previous button
        items.push(
            <PaginationItem key="prev">
                <button
                    onClick={() => pagination.has_prev && handlePageChange(current_page - 1)}
                    disabled={!pagination.has_prev}
                    className={`${baseButtonClass} ${navButtonClass}`}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                </button>
            </PaginationItem>
        );

        // Always show page 1
        items.push(
            <PaginationItem key="1">
                <button
                    onClick={() => handlePageChange(1)}
                    className={`${baseButtonClass} ${current_page === 1 ? activeButtonClass : pageButtonClass}`}
                >
                    1
                </button>
            </PaginationItem>
        );
        addedPages.add(1);

        // Always show page 2
        items.push(
            <PaginationItem key="2">
                <button
                    onClick={() => handlePageChange(2)}
                    className={`${baseButtonClass} ${current_page === 2 ? activeButtonClass : pageButtonClass}`}
                >
                    2
                </button>
            </PaginationItem>
        );
        addedPages.add(2);

        // Show pages 3, 4, 5 if current page is 1 or 2
        if (current_page <= 2 && total_pages > 2) {
            for (let i = 3; i <= Math.min(5, total_pages - 1); i++) {
                items.push(
                    <PaginationItem key={i}>
                        <button
                            onClick={() => handlePageChange(i)}
                            className={`${baseButtonClass} ${current_page === i ? activeButtonClass : pageButtonClass}`}
                        >
                            {i}
                        </button>
                    </PaginationItem>
                );
                addedPages.add(i);
            }

            // Show ellipsis if there are more pages before the last
            if (total_pages > 6) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <span className="flex h-10 w-10 items-center justify-center text-neutral-500">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    </PaginationItem>
                );
            }
        } else if (current_page > 2 && current_page < total_pages - 3) {
            // Show ellipsis before current page area if needed
            if (current_page > 4) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <span className="flex h-10 w-10 items-center justify-center text-neutral-500">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    </PaginationItem>
                );
            }

            // Show pages around current (current-1, current, current+1)
            const startPage = Math.max(3, current_page - 1);
            const endPage = Math.min(total_pages - 2, current_page + 1);

            for (let i = startPage; i <= endPage; i++) {
                if (!addedPages.has(i)) {
                    items.push(
                        <PaginationItem key={i}>
                            <button
                                onClick={() => handlePageChange(i)}
                                className={`${baseButtonClass} ${current_page === i ? activeButtonClass : pageButtonClass}`}
                            >
                                {i}
                            </button>
                        </PaginationItem>
                    );
                    addedPages.add(i);
                }
            }

            // Show ellipsis after current page area if needed
            if (current_page < total_pages - 4) {
                items.push(
                    <PaginationItem key="ellipsis-end">
                        <span className="flex h-10 w-10 items-center justify-center text-neutral-500">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    </PaginationItem>
                );
            }
        } else if (current_page >= total_pages - 3) {
            // Show ellipsis before last pages
            if (current_page > 4) {
                items.push(
                    <PaginationItem key="ellipsis-start">
                        <span className="flex h-10 w-10 items-center justify-center text-neutral-500">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    </PaginationItem>
                );
            }

            // Show pages near the end
            const startPage = Math.max(3, total_pages - 4);
            for (let i = startPage; i < total_pages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <button
                            onClick={() => handlePageChange(i)}
                            className={`${baseButtonClass} ${current_page === i ? activeButtonClass : pageButtonClass}`}
                        >
                            {i}
                        </button>
                    </PaginationItem>
                );
            }
        }

        // Show last page if total pages > 2 and not already added
        if (total_pages > 2 && !addedPages.has(total_pages)) {
            items.push(
                <PaginationItem key={total_pages}>
                    <button
                        onClick={() => handlePageChange(total_pages)}
                        className={`${baseButtonClass} ${current_page === total_pages ? activeButtonClass : pageButtonClass}`}
                    >
                        {total_pages}
                    </button>
                </PaginationItem>
            );
        }

        // Next button
        items.push(
            <PaginationItem key="next">
                <button
                    onClick={() => pagination.has_next && handlePageChange(current_page + 1)}
                    disabled={!pagination.has_next}
                    className={`${baseButtonClass} ${navButtonClass}`}
                >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </PaginationItem>
        );

        return items;
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-0">
                {/* Filter Sidebar - Desktop */}
                <div className="hidden lg:block lg:flex-shrink-0">
                    <FilterSidebar cars={cars} />
                </div>

                {/* Vehicle Grid */}
                <div className="flex-1 lg:pl-6">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden mb-4 flex items-center justify-between">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {cars.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                                    {cars.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {!cars?.length ? (
                        <div className="text-center py-16">
                            <div className="text-2xl font-semibold text-neutral-700">No vehicles match your criteria</div>
                            <div className="text-neutral-500 mt-2">Adjust your filters and try again.</div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2 gap-6">
                                {cars.map((c) => (
                                    <VehicleCard key={c.id} car={c} onStart={handleStart} loading={loading.session} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.total_pages > 1 && (
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

                                    <Pagination>
                                        <PaginationContent>
                                            {renderPaginationItems()}
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="left">
                <DrawerContent className="h-full max-h-[100vh] w-full max-w-sm rounded-r-2xl rounded-l-none backdrop-blur-xl bg-white/95 border-l border-white/30">
                    <DrawerHeader className="flex-shrink-0 p-6 pb-4 border-b border-white/20 bg-gradient-to-b from-white/60 to-white/40 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                                <Filter className="w-4 h-4 text-orange-500" />
                                Filters
                            </DrawerTitle>
                            <DrawerClose className="cursor-pointer p-2 rounded-lg hover:bg-white/60 backdrop-blur-sm transition-colors border border-white/30 hover:border-orange-400/50">
                                <X className="w-4 h-4 text-neutral-600" />
                            </DrawerClose>
                        </div>
                        <div className="text-sm text-orange-600 font-semibold mt-1">{cars.length} matches</div>
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto">
                        <FilterContent cars={cars} />
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}


