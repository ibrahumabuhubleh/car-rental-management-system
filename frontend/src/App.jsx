import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "./api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function App() {
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  const [page, setPage] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

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
  });

  const [recommendedCars, setRecommendedCars] = useState([]);

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
    fetchCars();
    fetchCustomers();
    fetchBookings();
    fetchMaintenanceRecords();
  }, []);

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

    setRecommendedCars(res.data);
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

  const fleetUtilization =
    cars.length === 0 ? 0 : Math.round((rentedCars / cars.length) * 100);

  const fleetData = [
    { name: "Available", value: availableCars },
    { name: "Rented", value: rentedCars },
    { name: "Maintenance", value: maintenanceCars },
  ];

  const revenueData = bookings.map((booking, index) => ({
    name: `Booking ${index + 1}`,
    revenue: Number(booking.totalPrice || 0),
  }));

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <aside className="w-64 border-r border-white/10 bg-black/40 p-6 hidden md:flex flex-col">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-10">
          DRIVE X
        </h1>

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

          <button onClick={() => setPage("analytics")} className="nav-btn">
            Analytics
          </button>

          <button onClick={() => setPage("maintenance")} className="nav-btn">
            Maintenance
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

            <CarGrid cars={cars} onEdit={setEditingCar} onDelete={handleDeleteCar} />
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

                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">
                        {booking.status}
                      </span>
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
              and weather conditions.
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
                    {recommendedCars.map((car) => (
                      <div key={car.id} className="border border-white/10 rounded-2xl p-4">
                        <h4 className="text-2xl font-bold">
                          {car.brand} {car.model}
                        </h4>

                        <p className="text-gray-400 mt-2">
                          {car.category} • {car.fuelType} • {car.seats} seats
                        </p>

                        <div className="flex justify-between mt-4">
                          <p className="text-[#f7d77a] text-2xl">
                            ${car.pricePerDay}/day
                          </p>

                          <p className="text-[#d4af37]">
                            Score: {car.performanceScore}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {page === "analytics" && (
          <>
            <h2 className="text-6xl font-serif mb-4">Fleet Analytics</h2>

            <p className="text-gray-400 mb-10">
              Revenue, bookings, fleet status, and utilization insights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
              <LuxuryCard title="Total Revenue" value={`$${totalRevenue}`} subtitle="Business income" />
              <LuxuryCard title="Bookings" value={bookings.length} subtitle="Total reservations" />
              <LuxuryCard title="Maintenance Cost" value={`$${totalMaintenanceCost}`} subtitle="Service expenses" />
              <LuxuryCard title="Utilization" value={`${fleetUtilization}%`} subtitle="Rented fleet rate" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="panel h-[450px]">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">
                  Fleet Status Distribution
                </h3>

                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie data={fleetData} dataKey="value" nameKey="name" outerRadius={130} label>
                      {fleetData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="panel h-[450px]">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">
                  Booking Revenue
                </h3>

                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#d4af37" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {page === "maintenance" && (
          <>
            <h2 className="text-6xl font-serif mb-4">
              Maintenance Management
            </h2>

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

                  <button className="gold-btn w-full">
                    Save Maintenance Record
                  </button>
                </form>
              </div>

              <div className="panel">
                <h3 className="text-3xl mb-6 text-[#f7d77a]">
                  Maintenance History
                </h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {maintenanceRecords.length === 0 ? (
                    <p className="text-gray-400">
                      No maintenance records yet.
                    </p>
                  ) : (
                    maintenanceRecords.map((record) => (
                      <div
                        key={record.id}
                        className="border border-white/10 rounded-2xl p-4"
                      >
                        <h4 className="text-2xl font-bold">
                          {record.car?.brand} {record.car?.model}
                        </h4>

                        <p className="text-gray-400 mt-2">
                          {record.description}
                        </p>

                        <div className="flex justify-between mt-4">
                          <p className="text-[#f7d77a] text-xl">
                            ${record.cost}
                          </p>

                          <p className="text-gray-400">
                            {record.serviceDate}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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
    </div>
  );
}

function CarGrid({ cars, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {cars.map((car) => (
        <div key={car.id} className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <img src={getCarImage(car)} alt={car.model} className="h-64 w-full object-cover" />

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
                onClick={() => onEdit(car)}
                className="flex-1 bg-[#d4af37] text-black py-3 rounded-2xl font-bold"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(car.id)}
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

  if (name.includes("mercedes")) {
    return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop";
  }

  if (name.includes("hyundai") || car.category === "SUV") {
    return "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop";
  }

  return "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop";
}

export default App;