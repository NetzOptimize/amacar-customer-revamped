import { useSelector } from 'react-redux';
import { Heart, Filter } from 'lucide-react';
import FilterContent from './FilterContent';

export default function FilterSidebar({ cars = [] }) {
    const { filters } = useSelector((s) => s.reverseBid);

    return (
        <div className="w-full lg:w-80 flex-shrink-0 backdrop-blur-xl bg-white/80 border-r border-white/20 lg:sticky lg:top-[calc(var(--header-height-desktop)+2rem)] lg:self-start lg:h-[calc(100vh-var(--header-height-desktop)-2rem)] flex flex-col shadow-lg">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-6 pb-4 border-b border-white/20 space-y-4 bg-gradient-to-b from-white/60 to-white/40 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Filter className="w-4 h-4 text-orange-500" />
                            <span className="text-lg font-bold text-neutral-900">Filters</span>
                        </div>
                        <span className="text-sm text-orange-600 font-semibold">{cars.length} matches</span>
                    </div>
                </div>
            </div>

            {/* Filter Content - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <FilterContent cars={cars} />
            </div>
        </div>
    );
}

