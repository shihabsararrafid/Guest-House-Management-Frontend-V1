import dayjs from 'dayjs';
// import html2pdf from 'html2pdf.js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function downloadHTMLReceipt(booking: any) {
	const formatDate = (date: string) => dayjs(date).format('DD MMM YYYY hh:mm a');

	const receiptHTML = `
    <html>
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', sans-serif;
                max-width: 800px;
                margin: 20px auto;
                padding: 40px;
                background-color: #f8f9fa;
                color: #1a1a1a;
                line-height: 1.6;
            }
            .receipt-container {
                background: white;
                padding: 48px;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            }
            .header {
                text-align: center;
                margin-bottom: 48px;
                padding-bottom: 24px;
                border-bottom: 2px solid #f0f0f0;
            }
            .logo {
                font-family: 'Playfair Display', serif;
                font-size: 32px;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 16px;
                letter-spacing: -0.02em;
            }
            .booking-id {
                color: #666;
                font-size: 0.95em;
                font-weight: 500;
                margin-top: 8px;
            }
            .section {
                margin: 36px 0;
                padding: 24px;
                border-radius: 12px;
                background: #fafafa;
                border: 1px solid #f0f0f0;
            }
            .section h2 {
                color: #1a1a1a;
                font-size: 1.25em;
                font-weight: 600;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 1px solid #eee;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .row {
                display: flex;
                justify-content: space-between;
                margin: 12px 0;
                padding: 6px 0;
                font-size: 0.95em;
            }
            .row span:first-child {
                color: #666;
                font-weight: 500;
            }
            .row span:last-child {
                font-weight: 600;
                color: #1a1a1a;
            }
            .total {
                font-weight: 600;
                font-size: 1.2em;
                margin-top: 24px;
                padding-top: 24px;
                border-top: 2px solid #eee;
            }
            .total span:last-child {
                color: #2563eb;
            }
            .highlight {
                background-color: #f8faff;
                padding: 20px;
                border-radius: 10px;
                margin: 12px 0;
                border: 1px solid #e5e9ff;
            }
            .status {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.9em;
                font-weight: 500;
            }
            .status.paid {
                background-color: #ecfdf5;
                color: #059669;
            }
            .status.completed {
                background-color: #eff6ff;
                color: #2563eb;
            }
            .footer {
                text-align: center;
                margin-top: 48px;
                padding-top: 24px;
                border-top: 2px solid #f0f0f0;
            }
            .footer p {
                color: #666;
                font-size: 0.95em;
                margin: 8px 0;
            }
            .contact-info {
                text-align: center;
                font-size: 0.9em;
                color: #666;
                margin-top: 24px;
                background: #fafafa;
                padding: 20px;
                border-radius: 12px;
            }
            .contact-info p {
                margin: 8px 0;
            }
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                .receipt-container {
                    box-shadow: none;
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <div class="logo">RUET GUEST HOUSE</div>
                <h1 style="font-weight: 600; font-size: 1.5em; margin: 16px 0;">Booking Receipt</h1>
                <div class="booking-id">Booking ID: ${booking.id}</div>
                <div style="color: #666; margin-top: 8px;">Date: ${formatDate(booking.createdAt)}</div>
            </div>

            <div class="section">
                <h2>📅 Stay Details</h2>
                <div class="highlight">
                    <div class="row">
                        <span>Check-in</span>
                        <span>${formatDate(booking.checkIn)}</span>
                    </div>
                    <div class="row">
                        <span>Check-out</span>
                        <span>${formatDate(booking.checkOut)}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>🛏️ Room Details</h2>
                ${booking.rooms
									.map(
										(room) => `
                    <div class="highlight">
                        <div class="row">
                            <span>Room Number</span>
                            <span>${room.room.roomNumber}</span>
                        </div>
                        <div class="row">
                            <span>Rate per Night</span>
                            <span>${room.pricePerNight.toLocaleString()} BDT</span>
                        </div>
                        <div class="row">
                            <span>Number of Guests</span>
                            <span>${room.numberOfGuests}</span>
                        </div>
                    </div>
                `
									)
									.join('')}
            </div>

            <div class="section">
                <h2>💳 Payment Details</h2>
                <div class="row">
                    <span>Total Amount</span>
                    <span>${booking.totalPrice.toLocaleString()} BDT</span>
                </div>
                ${
									booking.discount > 0
										? `
                    <div class="row">
                        <span>Discount (${booking.discountType})</span>
                        <span>-${booking.discount.toLocaleString()} BDT</span>
                    </div>
                `
										: ''
								}
                <div class="row total">
                    <span>Final Amount</span>
                    <span>${booking.totalPriceWithDiscount.toLocaleString()} BDT</span>
                </div>
                <div class="row">
                    <span>Payment Status</span>
                    <span class="status paid">${booking.isPaid ? 'Paid' : 'Pending'}</span>
                </div>
            </div>

            ${
							booking.transaction && booking.transaction[0]
								? `
                <div class="section">
                    <h2>🧾 Transaction Details</h2>
                    <div class="row">
                        <span>Transaction ID</span>
                        <span>${booking.transaction[0].id}</span>
                    </div>
                    <div class="row">
                        <span>Payment Date</span>
                        <span>${formatDate(booking.transaction[0].createdAt)}</span>
                    </div>
                    <div class="row">
                        <span>Status</span>
                        <span class="status completed">${booking.transaction[0].status}</span>
                    </div>
                    ${
											booking.transaction[0].last4
												? `
                        <div class="row">
                            <span>Card</span>
                            <span>**** **** **** ${booking.transaction[0].last4}</span>
                        </div>
                    `
												: ''
										}
                </div>
            `
								: ''
						}

            <div class="footer">
                <p>Thank you for choosing Ruet Guest House!</p>
                <div class="contact-info">
                    <p>📍 Talaimari, Rajshahi 6100, Rajshahi</p>
                    <p>📞 +1 234 567 890 | 📧 admin@rafid.com</p>
                </div>
            </div>
        </div>
    </body>
    </html>
`;
	// const container = document.createElement('div');
	// container.innerHTML = receiptHTML;
	// document.body.appendChild(container);

	// // PDF options
	// const options = {
	// 	margin: [10, 10],
	// 	filename: `booking-receipt-${booking.id}.pdf`,
	// 	image: { type: 'jpeg', quality: 0.98 },
	// 	html2canvas: {
	// 		scale: 2,
	// 		letterRendering: true,
	// 		useCORS: true,
	// 		logging: false
	// 	},
	// 	jsPDF: {
	// 		unit: 'mm',
	// 		format: 'a4',
	// 		orientation: 'portrait'
	// 	},
	// 	pagebreak: { mode: 'avoid-all' }
	// };

	// // Generate PDF
	// html2pdf()
	// 	.from(container)
	// 	.set(options)
	// 	.save()
	// 	.then(() => {
	// 		// Clean up
	// 		document.body.removeChild(container);
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error generating PDF:', error);
	// 		document.body.removeChild(container);
	// 	});
	// Create a new window/tab with the receipt HTML
	const receiptWindow = window.open('', '_blank');
	if (receiptWindow) {
		receiptWindow.document.write(receiptHTML);
		receiptWindow.document.close();
	} else {
		// If popup is blocked, create a temporary iframe
		const iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		document.body.appendChild(iframe);
		const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
		if (iframeDocument) {
			iframeDocument.write(receiptHTML);
			iframeDocument.close();
		}
		// Clean up iframe after 5 seconds (giving time for PDF generation)
		setTimeout(() => {
			document.body.removeChild(iframe);
		}, 5000);
	}
}
