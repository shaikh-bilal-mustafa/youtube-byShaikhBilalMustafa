export default function pay(){

  const upiId = "8830811955@upi"; // change if needed
  const name = "Bilal";
  const phoneNumber = "8830811955";
  const upiLink = `upi://pay?pa=${upiId}&pn=${name}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">💸 Send Payment</h1>
        <p className="text-gray-500 mb-6"> PhonePe</p>

        {/* QR Code */}
        <div className="mb-6">
          <img src={qrUrl} alt="QR Code" className="mx-auto rounded-xl" />
          <p className="text-sm text-gray-400 mt-2">Scan & Pay</p>
        </div>
        {/*pay on numner */}
        <div className="bg-gray-50 p-4 rounded-xl mb-3">
          <p className="text-gray-600">PhonePe Number</p>
          <a href={`tel:${phoneNumber}`} className="text-lg font-semibold text-blue-600">
            {phoneNumber}
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-4">Secure payment via UPI</p>
      </div>
    </div>
  );
}
