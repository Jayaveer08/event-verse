import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'vip';
  price: number;
  isAvailable: boolean;
}

interface SeatMapProps {
  basePrice: number;
  maxSeats?: number;
  selectedSeats: string[];
  onSeatsChange: (seats: string[]) => void;
  availableSeats?: number;
}

const seatTypes = {
  standard: { label: 'Standard', multiplier: 1, color: 'bg-blue-500' },
  premium: { label: 'Premium', multiplier: 1.5, color: 'bg-amber-500' },
  vip: { label: 'VIP', multiplier: 2, color: 'bg-purple-500' },
};

// Generate a realistic theater-style seating layout
const generateSeats = (basePrice: number): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const seats: Seat[] = [];
  
  rows.forEach((row, rowIndex) => {
    // Vary seats per row for a realistic curved theater feel
    const seatsInRow = rowIndex < 2 ? 8 : rowIndex < 5 ? 12 : rowIndex < 8 ? 14 : 16;
    const type: Seat['type'] = rowIndex < 2 ? 'vip' : rowIndex < 5 ? 'premium' : 'standard';
    
    for (let i = 1; i <= seatsInRow; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        price: Math.round(basePrice * seatTypes[type].multiplier),
        // Randomly mark some seats as unavailable (already booked)
        isAvailable: Math.random() > 0.25,
      });
    }
  });
  
  return seats;
};

export function SeatMap({ 
  basePrice, 
  maxSeats = 10, 
  selectedSeats, 
  onSeatsChange,
}: SeatMapProps) {
  const seats = useMemo(() => generateSeats(basePrice), [basePrice]);
  
  // Group seats by row
  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach(seat => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });
    return grouped;
  }, [seats]);

  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;
    
    if (selectedSeats.includes(seat.id)) {
      onSeatsChange(selectedSeats.filter(id => id !== seat.id));
    } else if (selectedSeats.length < maxSeats) {
      onSeatsChange([...selectedSeats, seat.id]);
    }
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  }, [selectedSeats, seats]);

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="relative">
        <div className="w-full h-2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full mb-2" />
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">Screen</p>
      </div>

      {/* Seating Area */}
      <div className="overflow-x-auto pb-4">
        <div className="flex flex-col items-center gap-2 min-w-[400px]">
          {Object.entries(seatsByRow).map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-1">
              <span className="w-6 text-xs font-medium text-muted-foreground text-right">
                {row}
              </span>
              <div className="flex gap-1 justify-center" style={{ width: `${rowSeats.length * 28}px` }}>
                {rowSeats.map((seat, idx) => {
                  // Add aisle gaps
                  const hasLeftGap = idx === Math.floor(rowSeats.length * 0.25);
                  const hasRightGap = idx === Math.floor(rowSeats.length * 0.75);
                  
                  return (
                    <div key={seat.id} className={cn("flex", hasLeftGap && "ml-4", hasRightGap && "mr-4")}>
                      <motion.button
                        whileHover={seat.isAvailable ? { scale: 1.15 } : {}}
                        whileTap={seat.isAvailable ? { scale: 0.95 } : {}}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!seat.isAvailable}
                        className={cn(
                          "w-6 h-6 rounded-t-lg text-[10px] font-medium transition-all duration-200 flex items-center justify-center",
                          seat.isAvailable && !selectedSeats.includes(seat.id) && [
                            seat.type === 'standard' && "bg-blue-500/20 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
                            seat.type === 'premium' && "bg-amber-500/20 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white",
                            seat.type === 'vip' && "bg-purple-500/20 border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
                          ],
                          selectedSeats.includes(seat.id) && "bg-accent text-accent-foreground border-accent",
                          !seat.isAvailable && "bg-muted text-muted-foreground/30 cursor-not-allowed border border-muted"
                        )}
                        title={seat.isAvailable ? `${seat.id} - ₹${seat.price}` : 'Sold'}
                      >
                        {seat.number}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
              <span className="w-6 text-xs font-medium text-muted-foreground">
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg bg-blue-500/20 border border-blue-500" />
          <span className="text-muted-foreground">Standard (₹{basePrice})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg bg-amber-500/20 border border-amber-500" />
          <span className="text-muted-foreground">Premium (₹{Math.round(basePrice * 1.5)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg bg-purple-500/20 border border-purple-500" />
          <span className="text-muted-foreground">VIP (₹{basePrice * 2})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg bg-accent" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-lg bg-muted border border-muted" />
          <span className="text-muted-foreground">Sold</span>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-lg p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Selected Seats</p>
              <div className="flex flex-wrap gap-1">
                {selectedSeats.sort().map(seatId => (
                  <span
                    key={seatId}
                    className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium"
                  >
                    {seatId}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground">₹{totalPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {selectedSeats.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Click on available seats to select (max {maxSeats} seats)
        </p>
      )}
    </div>
  );
}

export function useSelectedSeatsPrice(selectedSeats: string[], basePrice: number) {
  return useMemo(() => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
    
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.charAt(0);
      const rowIndex = rows.indexOf(row);
      const type: 'standard' | 'premium' | 'vip' = rowIndex < 2 ? 'vip' : rowIndex < 5 ? 'premium' : 'standard';
      const price = Math.round(basePrice * seatTypes[type].multiplier);
      return total + price;
    }, 0);
  }, [selectedSeats, basePrice]);
}
