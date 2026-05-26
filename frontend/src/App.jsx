import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "./api";
import AnalyticsCharts from "./components/AnalyticsCharts";

function App() {
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");

  const [page, setPage] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    method: "Credit Card",
  });

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [bookingData, setBookingData] = useState({
    carId: "",
    customerId: "",
    startDate: "",
    endDate: "",
  });

  const [recommendationForm, setRecommendationForm] = useState({
    maxBudgetPerDay: "",
    passengers: "",
    durationDays: "",
    weather: "",
    tripPurpose: "Business",
  });

  const [recommendedCars, setRecommendedCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    driverLicenseNumber: "",
  });

  const [maintenanceData, setMaintenanceData] = useState({
    carId: "",
    description: "",
    cost: "",
    serviceDate: "",
  });

  const emptyCar = {
    brand: "",
    model: "",
    category: "",
    fuelType: "",
    transmission: "",
    year: "",
    pricePerDay: "",
    seats: "",
    performanceScore: "",
    status: "AVAILABLE",
  };

  const [newCar, setNewCar] = useState(emptyCar);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCars();
      fetchCustomers();
      fetchBookings();
      fetchMaintenanceRecords();
    }
  }, [isAuthenticated]);

  const fetchCars = async () => {
    const res = await api.get("/cars");
    setCars(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  const fetchBookings = async () => {
    const res = await api.get("/bookings");
    setBookings(res.data);
  };

  const fetchMaintenanceRecords = async () => {
    const res = await api.get("/maintenance");
    setMaintenanceRecords(res.data);
  };

  const convertCarNumbers = (car) => ({
    ...car,
    year: Number(car.year),
    pricePerDay: Number(car.pricePerDay),
    seats: Number(car.seats),
    performanceScore: Number(car.performanceScore),
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        username: loginData.username,
        password: loginData.password,
      });

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      setLoginError("");
    } catch (err) {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setLoginData({
      username: "",
      password: "",
    });
    setPage("dashboard");
  };

  const handleChange = (e) => {
    setNewCar({
      ...newCar,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditingCar({
      ...editingCar,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    await api.post("/cars", convertCarNumbers(newCar));
    setShowForm(false);
    setNewCar(emptyCar);
    fetchCars();
  };

  const handleEditCar = async (e) => {
    e.preventDefault();
    await api.put(`/cars/${editingCar.id}`, convertCarNumbers(editingCar));
    setEditingCar(null);
    fetchCars();
  };

  const handleDeleteCar = async (id) => {
    await api.delete(`/cars/${id}`);
    fetchCars();
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    await api.post(
      `/bookings?carId=${bookingData.carId}&customerId=${bookingData.customerId}`,
      {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      }
    );

    setBookingData({
      carId: "",
      customerId: "",
      startDate: "",
      endDate: "",
    });

    fetchBookings();
    fetchCars();

    alert("Booking created successfully");
  };

  const handleRecommendationChange = (e) => {
    setRecommendationForm({
      ...recommendationForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleGetRecommendations = async (e) => {
    e.preventDefault();

    const res = await api.get("/recommendations", {
      params: {
        maxBudgetPerDay: recommendationForm.maxBudgetPerDay,
        passengers: recommendationForm.passengers,
        durationDays: recommendationForm.durationDays,
        weather: recommendationForm.weather,
      },
    });

    let results = res.data || [];

    if (recommendationForm.tripPurpose === "Family") {
      results = [...results].sort((a, b) => Number(b.seats || 0) - Number(a.seats || 0));
    }

    if (recommendationForm.tripPurpose === "Luxury") {
      results = [...results].sort(
        (a, b) => Number(b.performanceScore || 0) - Number(a.performanceScore || 0)
      );
    }

    if (recommendationForm.tripPurpose === "Budget") {
      results = [...results].sort(
        (a, b) => Number(a.pricePerDay || 0) - Number(b.pricePerDay || 0)
      );
    }

    setRecommendedCars(results);
  };

  const handleBookRecommendedCar = (car) => {
    setBookingData({
      ...bookingData,
      carId: String(car.id),
    });
    setPage("bookings");
  };

  const handleCustomerChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    await api.post("/customers", customerData);

    setCustomerData({
      fullName: "",
      email: "",
      phoneNumber: "",
      driverLicenseNumber: "",
    });

    fetchCustomers();

    alert("Customer added successfully");
  };

  const handleMaintenanceChange = (e) => {
    setMaintenanceData({
      ...maintenanceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateMaintenance = async (e) => {
    e.preventDefault();

    await api.post(`/maintenance?carId=${maintenanceData.carId}`, {
      description: maintenanceData.description,
      cost: Number(maintenanceData.cost),
      serviceDate: maintenanceData.serviceDate,
    });

    setMaintenanceData({
      carId: "",
      description: "",
      cost: "",
      serviceDate: "",
    });

    fetchMaintenanceRecords();
    fetchCars();

    alert("Maintenance record created");
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const openPaymentPage = (booking) => {
    setPaymentBooking(booking);
    setPaymentSuccess(false);
    setPaymentData({
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      method: "Credit Card",
    });
    setPage("payment");
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentSuccess(true);
  };

  const handlePrintReceipt = () => {
    const receiptWindow = window.open("", "_blank");

    receiptWindow.document.write(`
      <html>
        <head>
          <title>DRIVE X Payment Receipt</title>
          <style>
            body {
              font-family: Arial;
              background: #0b1120;
              color: white;
              padding: 40px;
            }
            h1 { color: #d4af37; font-size: 42px; }
            .card {
              background: #111827;
              border-radius: 16px;
              padding: 24px;
              margin-top: 24px;
            }
            p { font-size: 18px; }
            .gold { color: #f7d77a; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>DRIVE X Payment Receipt</h1>
          <div class="card">
            <p><b>Customer:</b> ${paymentBooking?.customer?.fullName || ""}</p>
            <p><b>Car:</b> ${paymentBooking?.car?.brand || ""} ${paymentBooking?.car?.model || ""}</p>
            <p><b>Rental Dates:</b> ${paymentBooking?.startDate || ""} → ${paymentBooking?.endDate || ""}</p>
            <p><b>Payment Method:</b> ${paymentData.method}</p>
            <p class="gold"><b>Total Paid:</b> $${paymentBooking?.totalPrice || 0}</p>
            <p><b>Status:</b> Paid Successfully</p>
          </div>
        </body>
      </html>
    `);

    receiptWindow.document.close();
    receiptWindow.print();
  };

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted successfully. DRIVE X will contact you soon.");
    setContactData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const availableCars = cars.filter((car) => car.status === "AVAILABLE").length;
  const rentedCars = cars.filter((car) => car.status === "RENTED").length;
  const maintenanceCars = cars.filter((car) => car.status === "MAINTENANCE").length;

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalPrice || 0),
    0
  );

  const totalMaintenanceCost = maintenanceRecords.reduce(
    (sum, record) => sum + Number(record.cost || 0),
    0
  );

  const filteredCars = cars.filter((car) => {
    const matchesSearch = `${car.brand} ${car.model} ${car.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || car.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const fleetUtilization =
    cars.length === 0 ? 0 : Math.round((rentedCars / cars.length) * 100);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-10"
        >
          <h1 className="text-5xl font-serif text-[#d4af37] mb-2 text-center">
            DRIVE X
          </h1>

          <p className="text-gray-400 text-center mb-8">
            Luxury Fleet Intelligence
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              placeholder="Username"
              className="input w-full"
              required
            />

            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Password"
              className="input w-full"
              required
            />

            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}

            <button className="gold-btn w-full">Login</button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-500 text-center">
            admin / admin123
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <aside className="w-64 border-r border-white/10 bg-black/40 p-6 hidden md:flex flex-col">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-10">DRIVE X</h1>

        <nav className="space-y-3">
          <button onClick={() => setPage("dashboard")} className="nav-btn">
            Dashboard
          </button>

          <button onClick={() => setPage("bookings")} className="nav-btn">
            Bookings
          </button>

          <button onClick={() => setPage("ai")} className="nav-btn">
            AI Recommendations
          </button>

          <button onClick={() => setPage("payment")} className="nav-btn">
            Payments
          </button>

          <button onClick={() => setPage("analytics")} className="nav-btn">
            Analytics
          </button>

          <button onClick={() => setPage("customers")} className="nav-btn">
            Customers
          </button>

          <button onClick={() => setPage("maintenance")} className="nav-btn">
            Maintenance
          </button>

          <button onClick={() => setPage("contact")} className="nav-btn">
            Contact
          </button>

          <button onClick={handleLogout} className="nav-btn text-red-400">
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {page === "dashboard" && (
          <>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-6xl font-serif">Luxury Fleet</h2>
                <p className="text-gray-400 mt-3">
                  Spring Boot + React Management System
                </p>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="bg-[#d4af37] text-black px-6 py-4 rounded-2xl font-bold"
              >
                + Add Car
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
              <LuxuryCard title="Total Cars" value={cars.length} subtitle="Fleet size" />
              <LuxuryCard title="Available" value={availableCars} subtitle="Ready to rent" />
              <LuxuryCard title="Rented" value={rentedCars} subtitle="Active bookings" />
              <LuxuryCard title="Maintenance" value={maintenanceCars} subtitle="Under service" />
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10"
                >
                  <h3 className="text-3xl mb-6 text-[#f7d77a]">Add Vehicle</h3>

                  <form onSubmit={handleAddCar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      "brand",
                      "model",
                      "category",
                      "fuelType",
                      "transmission",
                      "year",
                      "pricePerDay",
                      "seats",
                      "performanceScore",
                    ].map((field) => (
                      <input
                        key={field}
                        name={field}
                        value={newCar[field]}
                        onChange={handleChange}
                        placeholder={field}
                        className="input"
                        required
                      />
                    ))}

                    <select
                      name="status"
                      value={newCar.status}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="RENTED">RENTED</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>

                    <button className="gold-btn">Save</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input
                type="text"
                placeholder="Search brand, model, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input flex-1"
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input md:w-64"
              >
                <option value="ALL">All Categories</option>

                {[...new Set(cars.map((car) => car.category))].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <CarGrid
              cars={filteredCars}
              onEdit={setEditingCar}
              onDelete={handleDeleteCar}
              onView={setSelectedCar}
            />
          </>
        )}

        {page === "bookings" && (
          <>
            <h2 className="text-6xl font-serif mb-10">Booking System</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Create Booking</h3>

                <form onSubmit={handleCreateBooking} className="space-y-4">
                  <select
                    name="carId"
                    value={bookingData.carId}
                    onChange={handleBookingChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Car</option>
                    {cars
                      .filter((car) => car.status === "AVAILABLE")
                      .map((car) => (
                        <option key={car.id} value={car.id}>
                          {car.brand} {car.model}
                        </option>
                      ))}
                  </select>

                  <select
                    name="customerId"
                    value={bookingData.customerId}
                    onChange={handleBookingChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.fullName}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleBookingChange}
                    className="input w-full"
                    required
                  />

                  <input
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleBookingChange}
                    className="input w-full"
                    required
                  />

                  <button className="gold-btn w-full">Create Booking</button>
                </form>
              </div>

              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Recent Bookings</h3>

                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-white/10 rounded-2xl p-4">
                      <h4 className="text-xl font-bold">
                        {booking.car?.brand} {booking.car?.model}
                      </h4>

                      <p className="text-gray-400 mt-2">
                        Customer: {booking.customer?.fullName}
                      </p>

                      <p className="text-gray-400">
                        {booking.startDate} → {booking.endDate}
                      </p>

                      <p className="text-[#f7d77a] mt-2 text-xl">
                        ${booking.totalPrice}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 items-center">
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          {booking.status}
                        </span>

                        <button
                          onClick={() => openPaymentPage(booking)}
                          className="bg-[#d4af37] text-black px-4 py-2 rounded-xl font-bold text-sm"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {page === "ai" && (
          <>
            <h2 className="text-6xl font-serif mb-4">AI Recommendations</h2>

            <p className="text-gray-400 mb-10 max-w-2xl">
              Get smart car suggestions based on budget, passengers, trip duration,
              weather conditions, and trip purpose.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">
                  Recommendation Inputs
                </h3>

                <form onSubmit={handleGetRecommendations} className="space-y-4">
                  <input
                    name="maxBudgetPerDay"
                    value={recommendationForm.maxBudgetPerDay}
                    onChange={handleRecommendationChange}
                    placeholder="Max Budget Per Day"
                    className="input w-full"
                    required
                  />

                  <input
                    name="passengers"
                    value={recommendationForm.passengers}
                    onChange={handleRecommendationChange}
                    placeholder="Passengers"
                    className="input w-full"
                    required
                  />

                  <input
                    name="durationDays"
                    value={recommendationForm.durationDays}
                    onChange={handleRecommendationChange}
                    placeholder="Duration Days"
                    className="input w-full"
                    required
                  />

                  <input
                    name="weather"
                    value={recommendationForm.weather}
                    onChange={handleRecommendationChange}
                    placeholder="Weather e.g. rain, sunny"
                    className="input w-full"
                  />

                  <select
                    name="tripPurpose"
                    value={recommendationForm.tripPurpose}
                    onChange={handleRecommendationChange}
                    className="input w-full"
                  >
                    <option value="Business">Business Trip</option>
                    <option value="Family">Family Trip</option>
                    <option value="Luxury">Luxury Experience</option>
                    <option value="Budget">Budget Friendly</option>
                  </select>

                  <button className="gold-btn w-full">
                    Get AI Recommendations
                  </button>
                </form>
              </div>

              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">
                  Recommended Cars
                </h3>

                {recommendedCars.length === 0 ? (
                  <p className="text-gray-400">
                    No recommendations yet. Fill the form and click the button.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recommendedCars.map((car) => {
                      const reasons = [];

                      if (
                        Number(car.pricePerDay) <=
                        Number(recommendationForm.maxBudgetPerDay)
                      ) {
                        reasons.push("Fits the selected daily budget");
                      }

                      if (Number(car.seats) >= Number(recommendationForm.passengers)) {
                        reasons.push("Has enough passenger seats");
                      }

                      if (
                        recommendationForm.weather.toLowerCase().includes("rain") &&
                        car.category.toLowerCase().includes("suv")
                      ) {
                        reasons.push("SUV is suitable for rainy weather");
                      }

                      if (recommendationForm.tripPurpose === "Family") {
                        reasons.push("Suitable for family travel and passenger comfort");
                      }

                      if (recommendationForm.tripPurpose === "Luxury") {
                        reasons.push("Prioritized for luxury and performance score");
                      }

                      if (recommendationForm.tripPurpose === "Budget") {
                        reasons.push("Sorted to show lower daily rental cost first");
                      }

                      if (recommendationForm.tripPurpose === "Business") {
                        reasons.push("Good option for professional/business use");
                      }

                      if (car.fuelType?.toLowerCase().includes("electric")) {
                        reasons.push("Efficient electric option");
                      }

                      if (car.performanceScore) {
                        reasons.push(`Performance score: ${car.performanceScore}`);
                      }

                      return (
                        <div
                          key={car.id}
                          className="border border-[#d4af37]/30 bg-white/5 rounded-3xl overflow-hidden"
                        >
                          <img
                            src={getCarImage(car)}
                            alt={car.model}
                            className="h-56 w-full object-cover"
                          />

                          <div className="p-5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-3xl font-bold">
                                  {car.brand} {car.model}
                                </h4>

                                <p className="text-gray-400 mt-2">
                                  {car.category} • {car.fuelType} • {car.seats} seats
                                </p>
                              </div>

                              <span className="bg-[#d4af37] text-black px-3 py-1 rounded-full text-xs font-bold">
                                AI Match
                              </span>
                            </div>

                            <p className="text-[#f7d77a] text-3xl font-bold mt-5">
                              ${car.pricePerDay}/day
                            </p>

                            <div className="mt-5 bg-black/30 rounded-2xl p-4">
                              <p className="text-[#d4af37] font-bold mb-2">
                                Why recommended?
                              </p>

                              <ul className="space-y-1 text-gray-300 text-sm">
                                {reasons.length > 0 ? (
                                  reasons.map((reason, index) => (
                                    <li key={index}>✓ {reason}</li>
                                  ))
                                ) : (
                                  <li>✓ Matches your selected preferences</li>
                                )}
                              </ul>
                            </div>

                            <button
                              onClick={() => handleBookRecommendedCar(car)}
                              className="gold-btn w-full mt-5"
                            >
                              Book This Car
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {page === "payment" && (
          <>
            <h2 className="text-6xl font-serif mb-4">Payment Center</h2>

            <p className="text-gray-400 mb-10 max-w-3xl">
              Process rental payments and generate printable receipts for confirmed bookings.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Select Booking</h3>

                {bookings.length === 0 ? (
                  <p className="text-gray-400">No bookings available for payment.</p>
                ) : (
                  <div className="space-y-4 max-h-[620px] overflow-y-auto">
                    {bookings.map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => openPaymentPage(booking)}
                        className={`w-full text-left border rounded-2xl p-4 transition ${
                          paymentBooking?.id === booking.id
                            ? "border-[#d4af37] bg-[#d4af37]/10"
                            : "border-white/10 bg-white/5 hover:border-[#d4af37]/40"
                        }`}
                      >
                        <h4 className="text-xl font-bold">
                          {booking.car?.brand} {booking.car?.model}
                        </h4>

                        <p className="text-gray-400 mt-2">
                          Customer: {booking.customer?.fullName}
                        </p>

                        <p className="text-gray-400">
                          {booking.startDate} → {booking.endDate}
                        </p>

                        <p className="text-[#f7d77a] text-2xl mt-2">
                          ${booking.totalPrice}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Payment Details</h3>

                {!paymentBooking ? (
                  <p className="text-gray-400">
                    Select a booking from the left side or click Pay Now from the Bookings page.
                  </p>
                ) : paymentSuccess ? (
                  <div className="space-y-5">
                    <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6">
                      <h4 className="text-3xl font-bold text-green-300">
                        Payment Successful
                      </h4>

                      <p className="text-gray-300 mt-3">
                        Receipt generated for {paymentBooking.customer?.fullName}.
                      </p>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-5 space-y-2">
                      <p>
                        <span className="text-gray-400">Car:</span>{" "}
                        {paymentBooking.car?.brand} {paymentBooking.car?.model}
                      </p>

                      <p>
                        <span className="text-gray-400">Amount:</span>{" "}
                        <span className="text-[#f7d77a] font-bold">
                          ${paymentBooking.totalPrice}
                        </span>
                      </p>

                      <p>
                        <span className="text-gray-400">Method:</span>{" "}
                        {paymentData.method}
                      </p>
                    </div>

                    <button onClick={handlePrintReceipt} className="gold-btn w-full">
                      Print Receipt
                    </button>

                    <button
                      onClick={() => {
                        setPaymentSuccess(false);
                        setPaymentBooking(null);
                      }}
                      className="border border-white/10 hover:bg-white/10 py-4 rounded-2xl font-bold w-full"
                    >
                      New Payment
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="bg-black/30 rounded-2xl p-5 mb-6">
                      <h4 className="text-2xl font-bold">
                        {paymentBooking.car?.brand} {paymentBooking.car?.model}
                      </h4>

                      <p className="text-gray-400 mt-2">
                        Customer: {paymentBooking.customer?.fullName}
                      </p>

                      <p className="text-[#f7d77a] text-3xl mt-3 font-bold">
                        ${paymentBooking.totalPrice}
                      </p>
                    </div>

                    <select
                      name="method"
                      value={paymentData.method}
                      onChange={handlePaymentChange}
                      className="input w-full"
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>

                    <input
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      placeholder="Cardholder Name"
                      className="input w-full"
                      required={paymentData.method !== "Cash"}
                    />

                    <input
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="Card Number"
                      className="input w-full"
                      required={paymentData.method !== "Cash"}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="expiry"
                        value={paymentData.expiry}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        className="input w-full"
                        required={paymentData.method !== "Cash"}
                      />

                      <input
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        placeholder="CVV"
                        className="input w-full"
                        required={paymentData.method !== "Cash"}
                      />
                    </div>

                    <button className="gold-btn w-full">
                      Confirm Payment
                    </button>
                  </form>
                )}
              </div>
            </div>
          </>
        )}

        {page === "analytics" && (
          <>
            <h2 className="text-6xl font-serif mb-4">Fleet Analytics</h2>

            <p className="text-gray-400 mb-10">
              Real-time analytics and business intelligence for your luxury rental fleet.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
              <LuxuryCard
                title="Total Revenue"
                value={`$${totalRevenue}`}
                subtitle="Business income"
              />

              <LuxuryCard
                title="Bookings"
                value={bookings.length}
                subtitle="Total reservations"
              />

              <LuxuryCard
                title="Maintenance Cost"
                value={`$${totalMaintenanceCost}`}
                subtitle="Service expenses"
              />

              <LuxuryCard
                title="Utilization"
                value={`${fleetUtilization}%`}
                subtitle="Rented fleet rate"
              />
            </div>

            <div className="mb-8">
              <button
                onClick={() => {
                  const reportWindow = window.open("", "_blank");

                  reportWindow.document.write(`
                    <html>
                      <head>
                        <title>DRIVE X Business Report</title>

                        <style>
                          body {
                            font-family: Arial;
                            background: #0b1120;
                            color: white;
                            padding: 40px;
                          }

                          h1 {
                            color: #d4af37;
                            font-size: 42px;
                          }

                          h2 {
                            color: #f7d77a;
                            margin-top: 40px;
                          }

                          .card {
                            background: #111827;
                            border-radius: 16px;
                            padding: 20px;
                            margin-bottom: 20px;
                          }

                          table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                          }

                          th, td {
                            border: 1px solid #333;
                            padding: 12px;
                            text-align: left;
                          }

                          th {
                            background: #d4af37;
                            color: black;
                          }
                        </style>
                      </head>

                      <body>
                        <h1>DRIVE X Business Report</h1>

                        <div class="card">
                          <h2>Business Overview</h2>

                          <p>Total Cars: ${cars.length}</p>
                          <p>Total Customers: ${customers.length}</p>
                          <p>Total Bookings: ${bookings.length}</p>
                          <p>Total Revenue: $${totalRevenue}</p>
                          <p>Maintenance Cost: $${totalMaintenanceCost}</p>
                          <p>Fleet Utilization: ${fleetUtilization}%</p>
                        </div>

                        <h2>Bookings</h2>

                        <table>
                          <tr>
                            <th>Customer</th>
                            <th>Car</th>
                            <th>Price</th>
                            <th>Status</th>
                          </tr>

                          ${bookings
                            .map(
                              (booking) => `
                                <tr>
                                  <td>${booking.customer?.fullName || ""}</td>
                                  <td>${booking.car?.brand || ""} ${booking.car?.model || ""}</td>
                                  <td>$${booking.totalPrice}</td>
                                  <td>${booking.status}</td>
                                </tr>
                              `
                            )
                            .join("")}
                        </table>

                        <h2>Maintenance Records</h2>

                        <table>
                          <tr>
                            <th>Car</th>
                            <th>Description</th>
                            <th>Cost</th>
                          </tr>

                          ${maintenanceRecords
                            .map(
                              (record) => `
                                <tr>
                                  <td>${record.car?.brand || ""} ${record.car?.model || ""}</td>
                                  <td>${record.description}</td>
                                  <td>$${record.cost}</td>
                                </tr>
                              `
                            )
                            .join("")}
                        </table>
                      </body>
                    </html>
                  `);

                  reportWindow.document.close();
                  reportWindow.print();
                }}
                className="bg-[#d4af37] text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition"
              >
                Generate Business Report
              </button>
            </div>

            <AnalyticsCharts
              cars={cars}
              bookings={bookings}
              maintenanceRecords={maintenanceRecords}
            />
          </>
        )}

        {page === "customers" && (
          <>
            <h2 className="text-6xl font-serif mb-4">Customer Management</h2>

            <p className="text-gray-400 mb-10">
              Manage customer accounts, license information, and booking activity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
              <LuxuryCard
                title="Total Customers"
                value={customers.length}
                subtitle="Registered clients"
              />

              <LuxuryCard
                title="Bookings"
                value={bookings.length}
                subtitle="Customer reservations"
              />

              <LuxuryCard
                title="Active Rentals"
                value={rentedCars}
                subtitle="Currently rented"
              />

              <LuxuryCard
                title="Fleet Revenue"
                value={`$${totalRevenue}`}
                subtitle="Total income"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Add Customer</h3>

                <form onSubmit={handleCreateCustomer} className="space-y-4">
                  <input
                    name="fullName"
                    value={customerData.fullName}
                    onChange={handleCustomerChange}
                    placeholder="Full Name"
                    className="input w-full"
                    required
                  />

                  <input
                    name="email"
                    type="email"
                    value={customerData.email}
                    onChange={handleCustomerChange}
                    placeholder="Email"
                    className="input w-full"
                    required
                  />

                  <input
                    name="phoneNumber"
                    value={customerData.phoneNumber}
                    onChange={handleCustomerChange}
                    placeholder="Phone Number"
                    className="input w-full"
                    required
                  />

                  <input
                    name="driverLicenseNumber"
                    value={customerData.driverLicenseNumber}
                    onChange={handleCustomerChange}
                    placeholder="Driver License Number"
                    className="input w-full"
                    required
                  />

                  <button className="gold-btn w-full">Add Customer</button>
                </form>
              </div>

              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Customer List</h3>

                <div className="space-y-4 max-h-[650px] overflow-y-auto">
                  {customers.length === 0 ? (
                    <p className="text-gray-400">
                      No customers yet. Add the first customer using the form.
                    </p>
                  ) : (
                    customers.map((customer) => {
                      const customerBookings = bookings.filter(
                        (booking) => booking.customer?.id === customer.id
                      ).length;

                      return (
                        <div
                          key={customer.id}
                          className="border border-white/10 rounded-2xl p-5"
                        >
                          <div className="flex justify-between gap-4">
                            <div>
                              <h4 className="text-2xl font-bold">
                                {customer.fullName}
                              </h4>

                              <p className="text-gray-400 mt-2">
                                {customer.email}
                              </p>

                              <p className="text-gray-400">
                                {customer.phoneNumber}
                              </p>

                              <p className="text-[#d4af37] mt-3">
                                License: {customer.driverLicenseNumber}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-3xl font-bold text-[#f7d77a]">
                                {customerBookings}
                              </p>

                              <p className="text-gray-400 text-sm">bookings</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {page === "maintenance" && (
          <>
            <h2 className="text-6xl font-serif mb-4">Maintenance Management</h2>

            <p className="text-gray-400 mb-10">
              Track vehicle servicing, repair costs, and maintenance history.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
              <LuxuryCard title="Records" value={maintenanceRecords.length} subtitle="Total services" />
              <LuxuryCard title="Cost" value={`$${totalMaintenanceCost}`} subtitle="Maintenance expenses" />
              <LuxuryCard title="Cars in Service" value={maintenanceCars} subtitle="Currently unavailable" />
              <LuxuryCard title="Available Cars" value={availableCars} subtitle="Ready fleet" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">
                  Create Maintenance Record
                </h3>

                <form onSubmit={handleCreateMaintenance} className="space-y-4">
                  <select
                    name="carId"
                    value={maintenanceData.carId}
                    onChange={handleMaintenanceChange}
                    className="input w-full"
                    required
                  >
                    <option value="">Select Car</option>

                    {cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.brand} {car.model}
                      </option>
                    ))}
                  </select>

                  <input
                    name="description"
                    value={maintenanceData.description}
                    onChange={handleMaintenanceChange}
                    placeholder="Maintenance description"
                    className="input w-full"
                    required
                  />

                  <input
                    name="cost"
                    value={maintenanceData.cost}
                    onChange={handleMaintenanceChange}
                    placeholder="Maintenance cost"
                    className="input w-full"
                    required
                  />

                  <input
                    type="date"
                    name="serviceDate"
                    value={maintenanceData.serviceDate}
                    onChange={handleMaintenanceChange}
                    className="input w-full"
                    required
                  />

                  <button className="gold-btn w-full">Save Maintenance Record</button>
                </form>
              </div>

              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Maintenance History</h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {maintenanceRecords.length === 0 ? (
                    <p className="text-gray-400">No maintenance records yet.</p>
                  ) : (
                    maintenanceRecords.map((record) => (
                      <div
                        key={record.id}
                        className="border border-white/10 rounded-2xl p-4"
                      >
                        <h4 className="text-2xl font-bold">
                          {record.car?.brand} {record.car?.model}
                        </h4>

                        <p className="text-gray-400 mt-2">{record.description}</p>

                        <div className="flex justify-between mt-4">
                          <p className="text-[#f7d77a] text-xl">${record.cost}</p>

                          <p className="text-gray-400">{record.serviceDate}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {page === "contact" && (
          <>
            <h2 className="text-6xl font-serif mb-4">Contact DRIVE X</h2>

            <p className="text-gray-400 mb-10 max-w-3xl">
              Customer support and company contact information for rental inquiries,
              booking help, and service requests.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Send Message</h3>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input
                    name="name"
                    value={contactData.name}
                    onChange={handleContactChange}
                    placeholder="Full Name"
                    className="input w-full"
                    required
                  />

                  <input
                    name="email"
                    type="email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    placeholder="Email Address"
                    className="input w-full"
                    required
                  />

                  <input
                    name="subject"
                    value={contactData.subject}
                    onChange={handleContactChange}
                    placeholder="Subject"
                    className="input w-full"
                    required
                  />

                  <textarea
                    name="message"
                    value={contactData.message}
                    onChange={handleContactChange}
                    placeholder="Message"
                    className="input w-full min-h-[160px]"
                    required
                  />

                  <button className="gold-btn w-full">Submit Message</button>
                </form>
              </div>

              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">Company Information</h3>

                <div className="space-y-5">
                  <div className="border border-white/10 rounded-2xl p-5 bg-white/5">
                    <p className="text-gray-400">Phone</p>
                    <h4 className="text-2xl mt-1">+965 2222 4455</h4>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-5 bg-white/5">
                    <p className="text-gray-400">Email</p>
                    <h4 className="text-2xl mt-1">support@drivex.com</h4>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-5 bg-white/5">
                    <p className="text-gray-400">Location</p>
                    <h4 className="text-2xl mt-1">Kuwait City, Kuwait</h4>
                  </div>

                  <div className="border border-[#d4af37]/30 rounded-2xl p-5 bg-[#d4af37]/10">
                    <p className="text-[#f7d77a] font-bold">Support Hours</p>
                    <p className="text-gray-300 mt-2">
                      Sunday - Thursday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-300">Friday - Saturday: Emergency support only</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <AnimatePresence>
          {editingCar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="w-full max-w-4xl rounded-3xl border border-[#d4af37]/30 bg-[#070b14] p-8"
              >
                <h3 className="text-4xl font-serif text-[#f7d77a] mb-6">
                  Edit Vehicle
                </h3>

                <form onSubmit={handleEditCar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    "brand",
                    "model",
                    "category",
                    "fuelType",
                    "transmission",
                    "year",
                    "pricePerDay",
                    "seats",
                    "performanceScore",
                  ].map((field) => (
                    <input
                      key={field}
                      name={field}
                      value={editingCar[field]}
                      onChange={handleEditChange}
                      placeholder={field}
                      className="input"
                      required
                    />
                  ))}

                  <select
                    name="status"
                    value={editingCar.status}
                    onChange={handleEditChange}
                    className="input"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RENTED">RENTED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>

                  <button className="gold-btn">Save Changes</button>

                  <button
                    type="button"
                    onClick={() => setEditingCar(null)}
                    className="border border-white/10 hover:bg-white/10 py-4 rounded-2xl font-bold"
                  >
                    Cancel
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {selectedCar && (
        <div
          onClick={() => setSelectedCar(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b1120] border border-white/10 rounded-3xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 shadow-2xl"
          >
            <img
              src={getCarImage(selectedCar)}
              alt={selectedCar.model}
              className="h-full w-full object-cover"
            />

            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-5xl font-bold">{selectedCar.brand}</h2>

                    <p className="text-gray-400 text-xl mt-2">
                      {selectedCar.model}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCar(null)}
                    className="text-3xl text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Category</p>
                    <h3 className="text-xl mt-1">{selectedCar.category}</h3>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Fuel</p>
                    <h3 className="text-xl mt-1">{selectedCar.fuelType}</h3>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Seats</p>
                    <h3 className="text-xl mt-1">{selectedCar.seats}</h3>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Status</p>
                    <h3 className="text-xl mt-1">{selectedCar.status}</h3>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Transmission</p>
                    <h3 className="text-xl mt-1">{selectedCar.transmission}</h3>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm">Year</p>
                    <h3 className="text-xl mt-1">{selectedCar.year}</h3>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Rental Price</p>

                  <h2 className="text-5xl font-bold text-[#d4af37]">
                    ${selectedCar.pricePerDay}
                  </h2>

                  <p className="text-gray-400 mt-1">per day</p>
                </div>

                <button
                  onClick={() => {
                    setBookingData({
                      ...bookingData,
                      carId: String(selectedCar.id),
                    });
                    setSelectedCar(null);
                    setPage("bookings");
                  }}
                  className="bg-[#d4af37] hover:bg-[#e5c158] transition text-black px-8 py-4 rounded-2xl font-bold text-lg"
                >
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CarGrid({ cars, onEdit, onDelete, onView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {cars.map((car) => (
        <div
          key={car.id}
          onClick={() => onView(car)}
          className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden cursor-pointer hover:scale-[1.02] hover:border-[#d4af37]/40 transition"
        >
          <img
            src={getCarImage(car)}
            alt={car.model}
            className="h-64 w-full object-cover"
          />

          <div className="p-6">
            <h3 className="text-3xl font-bold">{car.brand}</h3>

            <p className="text-gray-400">{car.model}</p>

            <div className="mt-5 space-y-2">
              <p>Category: {car.category}</p>
              <p>Fuel: {car.fuelType}</p>
              <p>Seats: {car.seats}</p>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-4xl text-[#f7d77a]">${car.pricePerDay}</h2>

              <span className={`px-3 py-1 rounded-full text-xs ${statusStyle(car.status)}`}>
                {car.status}
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(car);
                }}
                className="flex-1 bg-[#d4af37] text-black py-3 rounded-2xl font-bold"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(car.id);
                }}
                className="flex-1 border border-red-500/30 py-3 rounded-2xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LuxuryCard({ title, value, subtitle }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-gray-400">{title}</p>
      <h3 className="text-5xl font-bold mt-3">{value}</h3>
      <p className="text-[#d4af37] mt-4">{subtitle}</p>
    </div>
  );
}

function statusStyle(status) {
  if (status === "AVAILABLE") return "bg-green-500/20 text-green-300";
  if (status === "RENTED") return "bg-blue-500/20 text-blue-300";
  return "bg-orange-500/20 text-orange-300";
}

function getCarImage(car) {
  const name = `${car.brand} ${car.model}`.toLowerCase();

  if (name.includes("mercedes") || name.includes("amg")) {
    return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("bmw") || name.includes("x5")) {
    return "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("range rover") || name.includes("velar")) {
    return "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("porsche") || name.includes("911")) {
    return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("tesla")) {
    return "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("audi")) {
    return "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("toyota") || name.includes("corolla")) {
    return "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("hyundai") || name.includes("tucson")) {
    return "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop";
  }

  return "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop";
}

export default App;
