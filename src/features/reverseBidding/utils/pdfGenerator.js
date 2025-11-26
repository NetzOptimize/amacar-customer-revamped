import jsPDF from 'jspdf';

/**
 * Generates a CarMax-style offer certificate PDF
 * @param {Object} data - Certificate data
 * @param {string} data.certificateType - 'online' or 'appraisal'
 * @param {string} data.verificationCode - Verification code
 * @param {string} data.vehicleYear - Vehicle year
 * @param {string} data.vehicleMake - Vehicle make
 * @param {string} data.vehicleModel - Vehicle model
 * @param {string} data.vehicleTrim - Vehicle trim
 * @param {string} data.vin - Vehicle VIN
 * @param {string} data.mileage - Vehicle mileage
 * @param {number} data.offerAmount - Offer amount
 * @param {string} data.validUntil - Offer valid until date
 * @param {string} data.storeName - Store name
 * @param {string} data.storeAddress - Store address
 * @param {string} data.storeCity - Store city
 * @param {string} data.storePhone - Store phone
 * @param {string} data.contactName - Contact name (appraisal only)
 * @param {string} data.appraisalDate - Appraisal date (appraisal only)
 * @param {string} data.appraisalNumber - Appraisal number (appraisal only)
 * @param {Array} data.features - Array of vehicle features (appraisal only)
 * @param {Object} data.conditions - Vehicle conditions (appraisal only)
 * @param {number} data.taxSavings - Potential tax savings (appraisal only)
 */
export function generateCertificatePDF(data) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Color definitions
  const darkNavy = [0, 40, 85];
  const carmaxYellow = [255, 204, 0];
  const lightGray = [240, 240, 240];
  const mediumGray = [180, 180, 180];
  const darkGray = [80, 80, 80];

  if (data.certificateType === 'online') {
    generateOnlineOffer(doc, data, pageWidth, pageHeight, darkNavy, carmaxYellow, lightGray, mediumGray, darkGray);
  } else {
    generateAppraisalOffer(doc, data, pageWidth, pageHeight, darkNavy, carmaxYellow, lightGray, mediumGray, darkGray);
  }

  return doc;
}

function generateOnlineOffer(doc, data, pageWidth, pageHeight, darkNavy, carmaxYellow, lightGray, mediumGray, darkGray) {
  // Header - Dark Navy background
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // CarMax logo area (simplified - you can add actual logo)
  doc.setFillColor(255, 255, 255);
  doc.circle(25, 22, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('CM', 25, 24, { align: 'center' });

  // "CarMax" text
  doc.setFontSize(16);
  doc.setTextColor(carmaxYellow[0], carmaxYellow[1], carmaxYellow[2]);
  doc.text('car', 37, 20);
  doc.setTextColor(255, 255, 255);
  doc.text('max', 50, 20);

  // "Online Offer" text
  doc.setFontSize(24);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Online Offer', 37, 32);

  // Verification Code section
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Verification Code', 20, 58);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(data.verificationCode || 'ED7B5W5T', 20, 66);

  // Offer Amount section
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Offer Amount*', 20, 78);

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 150, 0);
  doc.text(`$${data.offerAmount?.toLocaleString() || '13,000'}`, 20, 90);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('This offer is good for 7 days.', 20, 96);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Offer valid until: ${data.validUntil || 'Saturday, November 5th, 2022'}`, 20, 101);

  // Your Local CarMax section
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Local CarMax', 20, 112);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(data.storeName || 'LAX', 20, 118);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(data.storeAddress || '8811 La Cienega Boulevard', 20, 124);
  doc.text(`${data.storeCity || 'Los Angeles, CA 90301'}`, 20, 129);
  
  doc.setTextColor(0, 100, 200);
  doc.textWithLink(data.storePhone || '(310) 568-5272', 20, 134, { url: `tel:${data.storePhone || '3105685272'}` });
  
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.text('See carmax.com for store hours.', 20, 139);

  // Vehicle Information section (right side)
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('Vehicle Information', 110, 58);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const vehicleInfo = `${data.vehicleYear || '2015'} ${data.vehicleMake || 'Audi'} ${data.vehicleModel || 'A3'} ${data.vehicleTrim || 'Premium'}`;
  doc.text(vehicleInfo, 110, 65);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`VIN: ${data.vin || 'WAUAGCFF3F1008778'}`, 110, 71);
  doc.text(`Mileage: ${data.mileage || '58000'}`, 110, 76);

  // Vehicle condition table
  const conditions = [
    'Accidents',
    'Flood/Frame Damage',
    'Mechanical',
    'Exterior',
    'Interior',
    'Tires',
    'Keys',
    'Modifications',
    'Other',
    'Additional Equipment'
  ];

  const values = [
    'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A',
    data.keys || '2 or more',
    'N/A', 'N/A',
    data.additionalEquipment || '9 items noted'
  ];

  let yPos = 88;
  doc.setFontSize(8);
  conditions.forEach((condition, index) => {
    doc.setTextColor(100, 100, 100);
    doc.text(condition, 110, yPos);
    doc.setTextColor(80, 80, 80);
    doc.text(values[index], 160, yPos);
    yPos += 5;
  });

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 150, pageWidth - 20, 150);

  // Disclaimer text
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  const disclaimer = 'Print this certificate to redeem this offer at your local CarMax.';
  doc.text(disclaimer, pageWidth / 2, 158, { align: 'center' });

  const disclaimerText = '* The offer from CarMax is contingent on your providing accurate information. CarMax will conduct an in-person verification of your vehicle and evaluate other vehicle use and history information prior to finalizing the offer. Any differences between the information you provide about your vehicle and the vehicle\'s actual condition, use, and history may impact the offer you receive from CarMax.';
  
  doc.setFontSize(6.5);
  const lines = doc.splitTextToSize(disclaimerText, pageWidth - 40);
  doc.text(lines, 20, 165);

  // Yellow box at bottom
  doc.setFillColor(carmaxYellow[0], carmaxYellow[1], carmaxYellow[2]);
  doc.rect(20, 195, 115, 45, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Bring these items to sell us your vehicle', 25, 203);

  const items = [
    'Valid, state-issued ID for all titleholders',
    'Valid, current vehicle registration',
    'All keys, fobs and remotes',
    'Car title or payoff information (All titleholders should be present)',
    'Payoff information (if applicable):'
  ];

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  let itemY = 210;
  items.forEach(item => {
    doc.text('•', 27, itemY);
    doc.text(item, 32, itemY);
    itemY += 5;
  });

  doc.setFontSize(7);
  doc.text('Bring your account number and lender phone number.', 37, 233);
  doc.text('Have a co-signer? Their signature is needed to sell your car.', 37, 237);

  // QR code section (navy box)
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(140, 195, 50, 45, 'F');

  // QR code placeholder
  doc.setFillColor(255, 255, 255);
  doc.rect(145, 200, 35, 35, 'F');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('QR CODE', 162.5, 220, { align: 'center' });

  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text('Scan this QR code to', 162.5, 238, { align: 'center' });
  doc.text('start your 7-Day Money-', 162.5, 241, { align: 'center' });
  doc.text('Back Guarantee™.', 162.5, 244, { align: 'center' });
}

function generateAppraisalOffer(doc, data, pageWidth, pageHeight, darkNavy, carmaxYellow, lightGray, mediumGray, darkGray) {
  // Header - Dark Navy background
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // "APPRAISAL OFFER" text
  doc.setFontSize(32);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('APPRAISAL OFFER', 20, 32);

  // CarMax logo (right side)
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(carmaxYellow[0], carmaxYellow[1], carmaxYellow[2]);
  doc.text('car', pageWidth - 45, 28);
  doc.setTextColor(255, 255, 255);
  doc.text('max', pageWidth - 28, 28);

  // Light blue background section
  doc.setFillColor(200, 215, 230);
  doc.rect(0, 50, pageWidth, 50, 'F');

  // Personal information (left side)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Name:', 20, 60);
  doc.text('Address:', 20, 67);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(data.customerName || '[REDACTED]', 38, 60);
  doc.text(data.customerAddress || '[REDACTED]', 38, 67);

  // Contact information (right side)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Contact:', pageWidth - 70, 60);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(data.contactName || 'ADAM ELLINGTON', pageWidth - 70, 66);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(data.contactPhone || '7298 - [REDACTED]', pageWidth - 70, 72);
  doc.text('Date:', pageWidth - 70, 78);
  doc.text(data.appraisalDate || '09/15/2020', pageWidth - 70, 83);

  // Vehicle information
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Vehicle:', 20, 77);
  doc.text('Mileage:', 20, 84);
  doc.text('VIN:', 20, 91);
  doc.text('Color:', 20, 98);

  doc.setFont('helvetica', 'normal');
  const vehicleDesc = data.vehicleDescription || '2017 TOYOTA TACOMA 4D CREW CAB TRD OFF ROAD';
  doc.text(vehicleDesc, 38, 77);
  doc.text(data.mileage || '33,452', 38, 84);
  doc.text('Engine: 3.5L', 65, 84);
  doc.text(data.vin || '5TFCZ5[REDACTED]', 38, 91);
  doc.text(data.color || 'RED', 38, 98);

  // Features considered section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Features considered', 20, 115);

  const features = data.features || [
    'POWER LOCKS', 'POWER WINDOWS',
    'SUNROOF(S)', 'AM/FM STEREO',
    'CD AUDIO', 'AUXILIARY AUDIO INPUT',
    'AIR CONDITIONING', 'CRUISE CONTROL',
    'ABS BRAKES', 'CLOTH SEATS',
    'FRONT SEAT HEATERS', 'POWER MIRRORS',
    '4WD/AWD', 'FULL ROOF RACK',
    'BED LINER', 'RUNNING BOARDS',
    'NAVIGATION SYSTEM', 'ALLOY WHEELS',
    'TRACTION CONTROL', 'SATELLITE RADIO READY',
    'AUTOMATIC TRANSMISSION',
    'SIDE AIRBAGS, OVERHEAD AIRBAGS, REAR VIEW',
    'CAMERA, BLUETOOTH TECHNOLOGY, ENTUNE, BLIND',
    'SPOT MONITOR, SMART KEY'
  ];

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  let xPos = 20;
  let yPos = 122;
  const colWidth = 65;
  let col = 0;

  features.forEach((feature, index) => {
    if (col === 2) {
      col = 0;
      yPos += 5;
      xPos = 20;
    }
    doc.text(feature, xPos, yPos);
    xPos += colWidth;
    col++;
  });

  // Conditions assessed section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Conditions assessed', pageWidth - 70, 115);
  
  doc.setFontSize(7);
  doc.text(data.appraisalNumber || '229235', pageWidth - 20, 115);

  const conditions = data.conditions || {
    'Wheels:': 'Aftermarket',
    'Front Seats:': 'OK',
    'Carpet:': 'OK',
    'Engine:': 'OK',
    'Front Tires:': 'OK',
    'Frame:': 'Frame Damage',
    'Rear Seats:': 'OK',
    'Transmission:': 'OK',
    '4 x 4:': 'OK',
    'Rear Tires:': 'OK'
  };

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  yPos = 122;
  
  Object.entries(conditions).forEach(([key, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(key, pageWidth - 70, yPos);
    doc.text(value, pageWidth - 35, yPos);
    yPos += 5;
  });

  // Appraisal offer amount
  doc.setFontSize(24);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Appraisal offer', pageWidth / 2 - 35, 180);

  doc.setFontSize(42);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${data.offerAmount?.toLocaleString() || '32,000'}`, pageWidth / 2 + 20, 180);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`This offer is valid until the close of business on ${data.validUntil || '9/22/20'}.`, pageWidth / 2, 187, { align: 'center' });

  // Tax savings information
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(0, 0, 0);
  const taxText = `If you purchase a CarMax vehicle while selling us your vehicle,\nyou could be eligible for tax savings up to $${data.taxSavings?.toLocaleString() || '2,112.00'}`;
  doc.text(taxText, pageWidth / 2, 198, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('This offer is good for 7 days', pageWidth / 2, 210, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.text('and will be honored at all CarMax stores.', pageWidth / 2, 215, { align: 'center' });
  doc.text('After 7 days, your vehicle will need to be reappraised and the ', pageWidth / 2, 220, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  const changeText = 'offer may change.';
  doc.text(changeText, pageWidth / 2, 225, { align: 'center' });

  // Comments section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('Comments', 20, 238);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(data.comments || 'THANKS FOR HAVING YOUR VEHICLE APPRAISED', 20, 244);

  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('- CarMax Certified Appraiser', pageWidth - 20, 244, { align: 'right' });

  // Footer - Yellow section
  doc.setFillColor(carmaxYellow[0], carmaxYellow[1], carmaxYellow[2]);
  doc.rect(0, 255, pageWidth, 25, 'F');

  doc.setFontSize(28);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('SELL US YOUR CAR ', 40, 267);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(carmaxYellow[0] - 50, carmaxYellow[1] - 50, 0);
  doc.text('today', 145, 267);
}

// Helper function to map session data to certificate format
export function mapSessionToCertificateData(session, userData = null) {
  const vehicle = session.certificateData?.vehicle || session.car || {};
  const acceptedBid = session.acceptedBid || {};
  const dealer = session.certificateData?.dealer || {};
  
  // Get customer info
  const customer = session.certificateData?.customer || {};
  const customerName = customer.name || 
                      userData?.display_name ||
                      userData?.name ||
                      (customer.first_name && customer.last_name 
                        ? `${customer.first_name} ${customer.last_name}` 
                        : '') ||
                      (userData?.first_name && userData?.last_name
                        ? `${userData.first_name} ${userData.last_name}`
                        : '') ||
                      customer.display_name || 
                      userData?.user?.display_name ||
                      '';
  
  const customerAddress = customer.address || 
                         userData?.address ||
                         (customer.address_1 
                          ? `${customer.address_1}${customer.address_2 ? ', ' + customer.address_2 : ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.postcode || ''}`.trim()
                          : '') ||
                         (userData?.billing_address_1
                          ? `${userData.billing_address_1}${userData.billing_address_2 ? ', ' + userData.billing_address_2 : ''}, ${userData.billing_city || ''}, ${userData.billing_state || ''} ${userData.billing_postcode || ''}`.trim()
                          : '') ||
                         (userData?.address_1
                          ? `${userData.address_1}${userData.address_2 ? ', ' + userData.address_2 : ''}, ${userData.city || ''}, ${userData.state || ''} ${userData.postcode || ''}`.trim()
                          : '');

  // Calculate valid until date (7 days from now)
  const validUntilDate = new Date();
  validUntilDate.setDate(validUntilDate.getDate() + 7);
  const validUntil = validUntilDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Get market value and final price
  const marketValue = session.certificateData?.marketValue || 
                     session.certificateData?.onlineMarketValue ||
                     session.criteria?.price ||
                     session.car?.price ||
                     0;
  const finalPrice = session.certificateData?.bid_amount || 
                    acceptedBid.currentOffer || 
                    acceptedBid.amount || 
                    0;

  // Generate verification code from session ID
  const verificationCode = session.id ? `RB-${String(session.id).padStart(6, '0')}` : `AMC-${Date.now().toString().slice(-8)}`;

  return {
    certificateType: 'appraisal', // Use appraisal format for reverse bidding
    verificationCode: verificationCode,
    vehicleYear: vehicle.year || '',
    vehicleMake: vehicle.make || '',
    vehicleModel: vehicle.model || '',
    vehicleTrim: vehicle.trim || vehicle.title?.replace(`${vehicle.year} ${vehicle.make} ${vehicle.model}`, '').trim() || '',
    vehicleDescription: vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim() || 'Vehicle Information',
    vin: vehicle.vin || session.certificateData?.vin || session.car?.vin || '',
    mileage: vehicle.mileage || session.certificateData?.mileage || '',
    color: vehicle.color || '',
    offerAmount: finalPrice,
    validUntil: validUntil,
    storeName: dealer.name || acceptedBid.dealerName || 'Authorized Dealer',
    storeAddress: dealer.address || acceptedBid.dealerLocation || '',
    storeCity: vehicle.city || session.certificateData?.vehicle?.city || '',
    storePhone: dealer.phone || acceptedBid.dealer_phone || acceptedBid.phone || '',
    contactName: dealer.name || acceptedBid.dealerName || acceptedBid.salesManager || 'Sales Manager',
    contactPhone: dealer.phone || acceptedBid.dealer_phone || acceptedBid.phone || '',
    appraisalDate: session.certificateData?.date || 
                   acceptedBid.acceptedDate || 
                   session.date_created || 
                   session.created_at ||
                   new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    appraisalNumber: session.id ? String(session.id) : '',
    customerName: customerName,
    customerAddress: customerAddress,
    features: vehicle.features || [],
    conditions: vehicle.conditions || {},
    taxSavings: 0,
    comments: 'THANKS FOR USING AMACAR REVERSE BIDDING',
    keys: '2 or more',
    additionalEquipment: 'Standard equipment included'
  };
}

// Example usage function
export function downloadCertificate(data) {
  const doc = generateCertificatePDF(data);
  doc.save(`amacar_${data.certificateType}_offer_${data.verificationCode || Date.now()}.pdf`);
}

// Wrapper function for backward compatibility
export async function generateCertificatePDFFromSession(session, userData = null) {
  try {
    const certificateData = mapSessionToCertificateData(session, userData);
    const doc = generateCertificatePDF(certificateData);
    doc.save(`Amacar_Certificate_${session.id || 'AMC-2025-001234'}.pdf`);
    return true;
  } catch (e) {
    console.error('Certificate generation failed:', e);
    return false;
  }
}

// Export for direct use
export default generateCertificatePDF;