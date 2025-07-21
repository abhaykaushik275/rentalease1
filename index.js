import React, { useState, useEffect } from "react";

export default function App() {
  const [step, setStep] = useState(0); // 0: Customer Info, 1: Rental Selection, 2: Booking History
  const [bookings, setBookings] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    mobile: "",
    date: "",
    time: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const enteredPassword = prompt("Enter password to access the app:");
    if (enteredPassword === "9845194758") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Access denied.");
    }
  }, []);

  if (!isAuthenticated) return null;

  const handleChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    if (
      customerDetails.name &&
      customerDetails.address &&
      customerDetails.mobile &&
      customerDetails.date &&
      customerDetails.time
    ) {
      setStep(1);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">RentalEase</h1>
          <nav className="space-x-4 hidden md:flex">
            <button onClick={() => setStep(0)} className="hover:underline">
              Customer Info
            </button>
            <button
              onClick={() => step >= 1 && setStep(1)}
              className={step >= 1 ? "hover:underline" : "opacity-50"}
            >
              Rent Items
            </button>
            <button onClick={() => setStep(2)} className="hover:underline">
              Booking History
            </button>
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {step === 0 && (
          <CustomerInfoForm {...{ customerDetails, handleChange, handleContinue }} />
        )}
        {step === 1 && (
          <RentalSelection
            customerDetails={customerDetails}
            onCheckout={(booking) => {
              setBookings([...bookings, booking]);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <BookingHistory bookings={bookings} onBack={() => setStep(1)} />
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          &copy; {new Date().getFullYear()} RentalEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// Step 0: Customer Info Form
function CustomerInfoForm({ customerDetails, handleChange, handleContinue }) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Details</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={customerDetails.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={customerDetails.address}
            onChange={handleChange}
            placeholder="Delivery Address"
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={customerDetails.mobile}
            onChange={handleChange}
            placeholder="Your Mobile Number"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Required</label>
            <input
              type="date"
              name="date"
              value={customerDetails.date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Required</label>
            <select
              name="time"
              value={customerDetails.time}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Time</option>
              {Array.from({ length: 21 }, (_, i) => {
                const hour = Math.floor(i / 2) + 9;
                const minutes = i % 2 === 0 ? "00" : "30";
                const displayHour = hour > 12 ? hour - 12 : hour;
                const period = hour >= 12 ? "PM" : "AM";
                return (
                  <option key={`${hour}-${minutes}`} value={`${displayHour}:${minutes} ${period}`}>
                    {`${displayHour}:${minutes} ${period}`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={handleContinue}
          className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Continue to Rent Items
        </button>
      </form>
    </div>
  );
}

// Step 1: Rental Item Selection
function RentalSelection({ customerDetails, onCheckout }) {
  const [activeTab, setActiveTab] = useState("Shamiyana");
  const [cart, setCart] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [finalRate, setFinalRate] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [transportRate, setTransportRate] = useState(200);
  const [shamiyanaDimensions, setShamiyanaDimensions] = useState({ a: "", b: "" });
  const [stageTableDimensions, setStageTableDimensions] = useState({ a: "", b: "" });

  const itemsData = {
    Shamiyana: [
      { name: "Non-Waterproof", price: 8, areaBased: true },
      { name: "Pagoda", price: 15, areaBased: true },
      { name: "Zinc Sheet", price: 25, areaBased: true },
    ],
    Tables: [
      { name: "Plain Table", price: 80 },
      { name: "Table with Frill", price: 200 },
    ],
    "Stage Tables": [{ name: "Without Matt", price: 16, areaBased: true }],
    Chairs: [
      { name: "Plain Armless Chair", price: 8 },
      { name: "Plain Chair with Arm", price: 20 },
      { name: "Frill Armless Chair", price: 20 },
    ],
    Carpets: [
      { name: "Standard Carpet", price: 200 },
      { name: "New Carpet", price: 400 },
    ],
    Drums: [{ name: "Drum", price: 100 }],
    "Homma Kunda": [
      { name: "Small Homma Kunda", price: 200 },
      { name: "Medium Homma Kunda", price: 300 },
      { name: "Large Homma Kunda", price: 400 },
    ],
    "Banquet Chairs": [{ name: "Banquet Chair", price: 50 }],
    "Grand Chairs": [
      { name: "Single Grand Chair", price: 300 },
      { name: "Double Grand Chair", price: 600 },
      { name: "Special Sofa", price: 2000 },
      { name: "Steel 3-Seater", price: 800 },
      { name: "Leather 3-Seater", price: 1000 },
    ],
    Sidewalls: [
      { name: "6ft Sidewall", price: 300 },
      { name: "8ft Sidewall", price: 400 },
    ],
    Matts: [
      { name: "New Matt", price: 4 },
      { name: "Medium Matt", price: 3 },
      { name: "Old Matt", price: 2 },
    ],
    "Wash Basins": [{ name: "Wash Basin", price: 200 }],
    "Suffing Dish": [{ name: "Suffing Dish", price: 100 }],
    "Step Carrier": [{ name: "Step Carrier", price: 325 }],
    Carriers: [
      { name: "Small Carrier", price: 100 },
      { name: "Medium Carrier", price: 125 },
      { name: "Large Carrier", price: 150 },
    ],
    "AK Plate": [{ name: "AK Plate", price: 4 }],
    "Steel Spoon": [{ name: "Steel Spoon", price: 2 }],
  };

  const getTotalPrice = () => {
    const baseTotal = Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return baseTotal + transportRate;
  };

  const getNetTotal = () => {
    return Math.max((finalRate || getTotalPrice()) - advanceAmount, 0);
  };

  const handleAddToCart = (item) => {
    if (item.areaBased) {
      setSelectedItem(item);
    } else {
      setCart((prevCart) => {
        const key = `${item.name}-${item.price}`;
        return {
          ...prevCart,
          [key]: {
            ...item,
            quantity: (prevCart[key]?.quantity || 0) + 1,
          },
        };
      });
    }
  };

  const confirmAddToCart = () => {
    const { name, price } = selectedItem;
    let a, b;

    if (name.includes("Shamiyana")) {
      a = parseFloat(shamiyanaDimensions.a);
      b = parseFloat(shamiyanaDimensions.b);
    } else if (name.includes("Stage Table")) {
      a = parseFloat(stageTableDimensions.a);
      b = parseFloat(stageTableDimensions.b);
    }

    if (!a || !b || isNaN(a) || isNaN(b)) {
      alert("Please enter valid dimensions.");
      return;
    }

    const calculatedPrice = price * a * b;
    const key = `${name}-${calculatedPrice}-${Date.now()}`;

    setCart((prevCart) => ({
      ...prevCart,
      [key]: {
        name,
        price: calculatedPrice,
        quantity: 1,
        area: `${a}x${b}`,
      },
    }));

    setSelectedItem(null);
    setShamiyanaDimensions({ a: "", b: "" });
    setStageTableDimensions({ a: "", b: "" });
  };

  const removeFromCart = (itemName) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[itemName];
      return newCart;
    });
  };

  const handleFinalRateChange = (e) => {
    setFinalRate(parseFloat(e.target.value) || 0);
  };

  const handleAdvanceChange = (e) => {
    setAdvanceAmount(parseFloat(e.target.value) || 0);
  };

  const handleTransportRateChange = (e) => {
    setTransportRate(parseFloat(e.target.value) || 0);
  };

  const handleProceed = () => {
    const booking = {
      customer: customerDetails,
      cart: { ...cart },
      transportRate,
      finalRate: finalRate || getTotalPrice(),
      advancePaid: advanceAmount,
      balanceDue: getNetTotal(),
      timestamp: new Date().toLocaleString(),
    };
    onCheckout(booking);
  };

  return (
    <>
      <nav className="mb-6 overflow-x-auto whitespace-nowrap space-x-2 bg-white rounded-lg shadow p-2">
        <button
          onClick={() => setStep(0)}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
        >
          ← Back to Customer Info
        </button>
        {Object.keys(itemsData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === category
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsData[activeTab].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-indigo-600 font-bold mt-1">
                    ₹{item.price}{" "}
                    {["Shamiyana", "Stage Tables"].includes(activeTab)
                      ? "/ sq.ft"
                      : ""}
                  </p>
                </div>
                <img
                  src={`https://picsum.photos/seed/ ${index}/200/300`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for area-based items */}
      {selectedItem?.areaBased && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">Enter Dimensions (in ft)</h3>
            <p className="mb-2">
              <span className="font-medium">Item:</span> {selectedItem.name}
            </p>
            <p className="mb-4">
              <span className="font-medium">Price:</span> ₹{selectedItem.price} per sq.ft
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dimA" className="block text-sm font-medium">
                  Length (a)
                </label>
                <input
                  id="dimA"
                  type="number"
                  min="1"
                  value={
                    selectedItem.name.includes("Shamiyana")
                      ? shamiyanaDimensions.a
                      : stageTableDimensions.a
                  }
                  onChange={(e) => {
                    if (selectedItem.name.includes("Shamiyana")) {
                      setShamiyanaDimensions({ ...shamiyanaDimensions, a: e.target.value });
                    } else {
                      setStageTableDimensions({ ...stageTableDimensions, a: e.target.value });
                    }
                  }}
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                />
              </div>
              <div>
                <label htmlFor="dimB" className="block text-sm font-medium">
                  Width (b)
                </label>
                <input
                  id="dimB"
                  type="number"
                  min="1"
                  value={
                    selectedItem.name.includes("Shamiyana")
                      ? shamiyanaDimensions.b
                      : stageTableDimensions.b
                  }
                  onChange={(e) => {
                    if (selectedItem.name.includes("Shamiyana")) {
                      setShamiyanaDimensions({ ...shamiyanaDimensions, b: e.target.value });
                    } else {
                      setStageTableDimensions({ ...stageTableDimensions, b: e.target.value });
                    }
                  }}
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={confirmAddToCart}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${
          Object.keys(cart).length > 0 ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={() => setCart({})}
              className="text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          {Object.keys(cart).length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {Object.values(cart).map((item, index) => (
                  <li key={index} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} x {item.quantity}
                          {item.area ? ` (${item.area})` : ""}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                        <button
                          onClick={() => removeFromCart(`${item.name}-${item.price}`)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <p className="font-medium">Customer:</p>
                <p>{customerDetails.name}</p>
                <p>{customerDetails.address}</p>
                <p>{customerDetails.mobile}</p>
                <p>
                  On {customerDetails.date} at {customerDetails.time}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal:</span>
                  <span>₹{getTotalPrice() - transportRate}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <label htmlFor="transportRate">Transport Fee:</label>
                  <input
                    id="transportRate"
                    type="number"
                    value={transportRate}
                    onChange={handleTransportRateChange}
                    className="w-20 border border-gray-300 rounded-md p-1"
                  />
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Final Rate (Editable)
                  </label>
                  <input
                    type="number"
                    value={finalRate || getTotalPrice()}
                    onChange={handleFinalRateChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Advance Paid</label>
                  <input
                    type="number"
                    value={advanceAmount}
                    onChange={handleAdvanceChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Balance Due</label>
                  <p className="font-semibold text-green-600">₹{getNetTotal()}</p>
                </div>
                <button
                  onClick={handleProceed}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Proceed to Booking
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Step 2: Booking History
function BookingHistory({ bookings, onBack }) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Booking History</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <p>
                <strong>Customer:</strong> {booking.customer.name}
              </p>
              <p>
                <strong>Address:</strong> {booking.customer.address}
              </p>
              <p>
                <strong>Date:</strong> {booking.customer.date}, Time: {booking.customer.time}
              </p>
              <p>
                <strong>Timestamp:</strong> {booking.timestamp}
              </p>
              <div className="mt-2">
                <strong>Items:</strong>
                <ul className="list-disc ml-5">
                  {Object.values(booking.cart).map((item, i) => (
                    <li key={i}>
                      {item.name} x {item.quantity} @ ₹{item.price} = ₹
                      {item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Transport Fee:</strong> ₹{booking.transportRate}
              </p>
              <p>
                <strong>Total:</strong> ₹{booking.finalRate}
              </p>
              <p>
                <strong>Advance Paid:</strong> ₹{booking.advancePaid}
              </p>
              <p>
                <strong>Balance Due:</strong> ₹{booking.balanceDue}
              </p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onBack}
        className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Back to Rent Items
      </button>
    </div>
  );
}
