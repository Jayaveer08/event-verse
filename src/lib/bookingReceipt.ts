import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export function generateBookingReceiptPDF(booking: any): jsPDF {
  const doc = new jsPDF();
  const bookingId = booking.id.slice(0, 8).toUpperCase();

  // Header band
  doc.setFillColor(13, 71, 79);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('EventVerse India', 14, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Booking Receipt', 14, 23);

  doc.setTextColor(0, 0, 0);
  let y = 45;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.event?.title || 'Event', 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`Booking ID: ${bookingId}`, 14, y);
  y += 10;

  doc.setTextColor(0);
  const rows: [string, string][] = [
    ['Status', String(booking.status || '').toUpperCase()],
    ['Event Date', booking.event?.start_date ? format(new Date(booking.event.start_date), 'PPP p') : '—'],
    ['Venue', `${booking.event?.venue?.name || '—'}`],
    ['Address', `${booking.event?.venue?.address || ''}, ${booking.event?.venue?.city || ''}`],
    ['Tickets', String(booking.num_tickets)],
    ['Seats', booking.seat_numbers?.length ? booking.seat_numbers.join(', ') : '—'],
    ['Payment Method', String(booking.payment_method || '—').toUpperCase()],
    ['Payment ID', booking.payment_id || '—'],
    ['Booked On', format(new Date(booking.created_at), 'PPP')],
  ];

  doc.setFontSize(11);
  rows.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(k, 14, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(v, 130);
    doc.text(lines, 70, y);
    y += 7 * lines.length;
  });

  y += 5;
  doc.setDrawColor(200);
  doc.line(14, y, 196, y);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Total Paid', 14, y);
  doc.text(`INR ${Number(booking.total_amount).toLocaleString('en-IN')}`, 196, y, { align: 'right' });

  y += 20;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Thank you for booking with EventVerse India. Please carry this receipt to the venue.', 14, y);

  return doc;
}

export function downloadBookingReceipt(booking: any) {
  const doc = generateBookingReceiptPDF(booking);
  doc.save(`EventVerse-Receipt-${booking.id.slice(0, 8).toUpperCase()}.pdf`);
}

export function viewBookingReceipt(booking: any) {
  const doc = generateBookingReceiptPDF(booking);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

export function receiptStoragePath(userId: string, bookingId: string) {
  return `${userId}/${bookingId}.pdf`;
}

/**
 * Generate the PDF and upload it to the private `receipts` storage bucket
 * under `<user_id>/<booking_id>.pdf`. Safe to call on every confirmed booking.
 */
export async function uploadBookingReceipt(booking: any, userId: string) {
  try {
    const doc = generateBookingReceiptPDF(booking);
    const blob = doc.output('blob');
    const path = receiptStoragePath(userId, booking.id);
    const { error } = await supabase.storage
      .from('receipts')
      .upload(path, blob, {
        contentType: 'application/pdf',
        upsert: true,
      });
    if (error) throw error;
    return path;
  } catch (err) {
    console.error('Failed to upload booking receipt:', err);
    return null;
  }
}

/**
 * Download a stored receipt via short-lived signed URL.
 * Falls back to client-side regeneration if the stored file is missing.
 */
export async function downloadStoredReceipt(booking: any, userId: string) {
  const path = receiptStoragePath(userId, booking.id);
  const { data, error } = await supabase.storage
    .from('receipts')
    .createSignedUrl(path, 60, {
      download: `EventVerse-Receipt-${booking.id.slice(0, 8).toUpperCase()}.pdf`,
    });
  if (error || !data?.signedUrl) {
    // Fallback: regenerate locally and upload for next time
    downloadBookingReceipt(booking);
    uploadBookingReceipt(booking, userId);
    return;
  }
  window.location.href = data.signedUrl;
}
