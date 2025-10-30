export async function generateCertificatePDF(session) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.setFontSize(24);
        doc.text('AMACAR', 105, 20, { align: 'center' });
        doc.setFontSize(18);
        doc.text('Reverse Bidding Certificate', 105, 40, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Session ID: ${session.id}`, 20, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
        if (session.acceptedBid) {
            doc.text(`Dealer: ${session.acceptedBid.dealerName}`, 20, 80);
            doc.text(`Final Price: $${(session.acceptedBid.currentOffer || 0).toLocaleString()}`, 20, 90);
        }
        if (session.car) {
            doc.text(`Vehicle: ${session.car.year} ${session.car.make} ${session.car.model}`, 20, 100);
        }
        doc.save(`ReverseBid_Certificate_${session.id}.pdf`);
        return true;
    } catch (e) {
        // jsPDF not installed or failed; silently no-op
        return false;
    }
}


