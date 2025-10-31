export async function generateCertificatePDF(session) {
    try {
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Brand colors from Amacar
        const primaryOrange = [255, 107, 44]; // #FF6B2C
        const darkNavy = [26, 35, 53]; // #1A2335
        const lightGray = [245, 245, 245];

        // Background - subtle gradient effect with rectangles
        doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Decorative top border
        doc.setFillColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.rect(0, 0, pageWidth, 8, 'F');

        // Decorative bottom border
        doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

        // Main content background (white card)
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, 25, pageWidth - 40, pageHeight - 50, 3, 3, 'F');

        // Add subtle shadow effect with gray border
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, 25, pageWidth - 40, pageHeight - 50, 3, 3, 'S');

        // AMACAR Logo/Brand (styled text)
        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('AMACAR', pageWidth / 2, 45, { align: 'center' });

        // Orange underline accent
        doc.setFillColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.rect(pageWidth / 2 - 25, 47, 50, 2, 'F');

        // Certificate Title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text('Reverse Bidding Certificate', pageWidth / 2, 60, { align: 'center' });

        // Subtitle
        doc.setFontSize(11);
        doc.setTextColor(120, 120, 120);
        doc.text('This certifies the successful completion of a reverse bidding session', pageWidth / 2, 68, { align: 'center' });

        // Decorative divider line
        doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.setLineWidth(0.5);
        doc.line(60, 75, pageWidth - 60, 75);

        // Session Details Section
        const leftCol = 45;
        const rightCol = pageWidth / 2 + 20;
        let yPos = 90;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);

        // Left Column
        doc.text('Session Details', leftCol, yPos);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);

        yPos += 8;
        doc.text(`Session ID:`, leftCol, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`${session.id}`, leftCol + 30, yPos);

        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.text(`Date:`, leftCol, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(`${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, leftCol + 30, yPos);

        // Vehicle Information
        if (session.car) {
            yPos += 10;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
            doc.text('Vehicle Information', leftCol, yPos);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);

            yPos += 8;
            doc.text(`Vehicle:`, leftCol, yPos);
            doc.setFont('helvetica', 'bold');
            doc.text(`${session.car.year} ${session.car.make} ${session.car.model}`, leftCol + 30, yPos);
        }

        // Right Column - Winning Bid Details
        yPos = 90;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
        doc.text('Winning Bid', rightCol, yPos);

        if (session.acceptedBid) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);

            yPos += 8;
            doc.text(`Dealer:`, rightCol, yPos);
            doc.setFont('helvetica', 'bold');
            doc.text(`${session.acceptedBid.dealerName}`, rightCol + 30, yPos);

            yPos += 7;
            doc.setFont('helvetica', 'normal');
            doc.text(`Final Price:`, rightCol, yPos);

            // Highlighted price in orange box
            const priceText = `$${(session.acceptedBid.currentOffer || 0).toLocaleString()}`;
            doc.setFillColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
            doc.roundedRect(rightCol + 28, yPos - 4, 40, 7, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text(priceText, rightCol + 30, yPos);
        }

        // Bottom congratulations section
        const bottomY = pageHeight - 45;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        doc.text('Congratulations on your successful car sale!', pageWidth / 2, bottomY, { align: 'center' });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for choosing Amacar - Driving the Future of Car Sales', pageWidth / 2, bottomY + 6, { align: 'center' });

        // Footer with trust indicators
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('✓ Secure   ✓ Fast   ✓ Transparent', pageWidth / 2, pageHeight - 25, { align: 'center' });

        // Decorative corner elements (optional)
        doc.setDrawColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
        doc.setLineWidth(1);
        // Top left corner
        doc.line(25, 30, 35, 30);
        doc.line(25, 30, 25, 40);
        // Top right corner
        doc.line(pageWidth - 25, 30, pageWidth - 35, 30);
        doc.line(pageWidth - 25, 30, pageWidth - 25, 40);
        // Bottom left corner
        doc.line(25, pageHeight - 30, 35, pageHeight - 30);
        doc.line(25, pageHeight - 30, 25, pageHeight - 40);
        // Bottom right corner
        doc.line(pageWidth - 25, pageHeight - 30, pageWidth - 35, pageHeight - 30);
        doc.line(pageWidth - 25, pageHeight - 30, pageWidth - 25, pageHeight - 40);

        // Save the PDF
        doc.save(`Amacar_Certificate_${session.id}.pdf`);
        return true;
    } catch (e) {
        console.error('Certificate generation failed:', e);
        return false;
    }
}