import { motion, AnimatePresence } from 'framer-motion';

export default function LeaderboardTable({ rows, onView, onAccept }) {
    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-neutral-500 border-b">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Dealer</div>
                <div className="col-span-3">Current Offer</div>
                <div className="col-span-2">Savings</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>
            <AnimatePresence initial={false}>
                {rows.map((r) => (
                    <motion.div
                        key={r.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-12 px-4 py-4 items-center border-b last:border-b-0"
                    >
                        <div className="col-span-1 font-semibold text-lg">{r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}</div>
                        <div className="col-span-4">
                            <div className="font-semibold">{r.dealerName}</div>
                            <div className="text-xs text-neutral-500">{r.location}</div>
                        </div>
                        <div className="col-span-3 text-orange-600 font-bold text-lg">${r.currentOffer.toLocaleString()}</div>
                        <div className="col-span-2 text-green-600">${(r.savings || 0).toLocaleString()}</div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                            <button onClick={() => onView(r)} className="cursor-pointer px-3 py-1.5 rounded-lg border text-sm">View</button>
                            <button onClick={() => onAccept(r)} className="cursor-pointer px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-sm">Accept</button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}


