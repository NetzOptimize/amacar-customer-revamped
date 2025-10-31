import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function LeaderboardTable({ rows, onView, onAccept, timeRemaining = 0, vehicleImage = null }) {
    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    // Format time remaining
    const formatTimeRemaining = (seconds) => {
        if (seconds <= 0) return '00:00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const timeDisplay = formatTimeRemaining(timeRemaining);
    const isLowTime = timeRemaining < 3600; // Less than 1 hour
    const isCriticalTime = timeRemaining < 900; // Less than 15 minutes

    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-200/50 bg-white shadow-lg">
            {/* Header */}
            <div className="grid grid-cols-12 px-6 py-4 bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200">
                <div className="col-span-1 text-xs font-bold text-neutral-700 uppercase tracking-wider">Rank</div>
                <div className="col-span-2 text-xs font-bold text-neutral-700 uppercase tracking-wider">Vehicle</div>
                <div className="col-span-2 text-xs font-bold text-neutral-700 uppercase tracking-wider">Dealer</div>
                <div className="col-span-2 text-xs font-bold text-neutral-700 uppercase tracking-wider">Current Offer</div>
                <div className="col-span-2 text-xs font-bold text-neutral-700 uppercase tracking-wider">Savings</div>
                <div className="col-span-2 text-xs font-bold text-neutral-700 uppercase tracking-wider">Time Remaining</div>
                <div className="col-span-1 text-right text-xs font-bold text-neutral-700 uppercase tracking-wider">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-neutral-100">
                <AnimatePresence initial={false}>
                    {rows.map((r, index) => {
                        const isTopThree = r.rank <= 3;
                        const rankIcon = getRankIcon(r.rank);

                        return (
                            <motion.div
                                key={r.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`grid grid-cols-12 px-6 py-5 items-center transition-all duration-200 ${isTopThree
                                    ? 'bg-gradient-to-r from-orange-50/30 to-transparent hover:from-orange-50/50'
                                    : 'hover:bg-neutral-50/50'
                                    }`}
                            >
                                {/* Rank */}
                                <div className="col-span-1">
                                    {rankIcon ? (
                                        <span className="text-2xl" role="img" aria-label={`Rank ${r.rank}`}>{rankIcon}</span>
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isTopThree
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-neutral-100 text-neutral-600'
                                            }`}>
                                            {r.rank}
                                        </div>
                                    )}
                                </div>

                                {/* Vehicle Image */}
                                <div className="col-span-2">
                                    {vehicleImage ? (
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-neutral-200 bg-neutral-100 flex-shrink-0">
                                            <img
                                                src={vehicleImage}
                                                alt="Vehicle"
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center">
                                            <span className="text-neutral-400 text-xs">No Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Dealer */}
                                <div className="col-span-2">
                                    <div className="font-semibold text-neutral-900 text-base">{r.dealerName}</div>
                                    <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
                                        <span>{r.location}</span>
                                    </div>
                                </div>

                                {/* Current Offer */}
                                <div className="col-span-2">
                                    <div className="text-orange-600 font-bold text-xl">
                                        ${r.currentOffer.toLocaleString()}
                                    </div>
                                </div>

                                {/* Savings */}
                                <div className="col-span-2">
                                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 font-semibold text-sm">
                                        <span>${(r.savings || 0).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Time Remaining */}
                                <div className="col-span-2">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${isCriticalTime
                                        ? 'bg-red-50 text-red-700 animate-pulse'
                                        : isLowTime
                                            ? 'bg-orange-50 text-orange-700'
                                            : 'bg-blue-50 text-blue-700'
                                        }`}>
                                        <Clock className={`w-4 h-4 ${isCriticalTime ? 'animate-pulse' : ''}`} />
                                        <span>{timeDisplay}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-end gap-1.5">
                                    <button
                                        onClick={() => onView(r)}
                                        className="cursor-pointer px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-all duration-200 hover:shadow-sm"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => onAccept(r)}
                                        className="cursor-pointer px-3 py-1.5 rounded-lg bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white text-xs font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}


