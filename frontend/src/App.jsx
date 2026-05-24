import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newCar, setNewCar] = useState({
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
  });

  const fetchCars = () => {
    axios
      .get("http://localhost:8080/api/cars")
      .then((response) => setCars(response.data))
      .catch((error) => console.error("Error fetching cars:", error));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleChange = (e) => {
    setNewCar({
      ...newCar,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();

    const carToSend = {
      ...newCar,
      year: Number(newCar.year),
      pricePerDay: Number(newCar.pricePerDay),
      seats: Number(newCar.seats),
      performanceScore: Number(newCar.performanceScore),
    };

    await axios.post("http://localhost:8080/api/cars", carToSend);

    setShowForm(false);
    setNewCar({
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
    });

    fetchCars();
  };

  const availableCars = cars.filter((car) => car.status === "AVAILABLE").length;
  const maintenanceCars = cars.filter((car) => car.status === "MAINTENANCE").length;
  const rentedCars = cars.filter((car) => car.status === "RENTED").length;

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b2f12_0%,transparent_35%),radial-gradient(circle_at_bottom_left,#0b3b55_0%,transparent_30%)]"></div>
      <div className="absolute inset-0 opacity-30 moving-lights"></div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="w-72 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6 hidden md:flex flex-col justify-between">
          <div>
            <div className="mb-12">
              <h1 className="text-3xl font-serif tracking-widest text-[#d4af37]">
                DRIVE X
              </h1>
              <p className="text-sm text-gray-400 mt-1">Luxury Car Management</p>
            </div>

            <nav className="space-y-3">
              {[
                "Dashboard",
                "Cars",
                "Bookings",
                "Customers",
                "Maintenance",
                "AI Recommendations",
                "Analytics",
                "Settings",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`px-5 py-3 rounded-2xl cursor-pointer transition ${
                    index === 0
                      ? "bg-[#d4af37]/20 text-[#f7d77a] border border-[#d4af37]/40"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>

          <div className="rounded-3xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-5">
            <p className="text-sm text-gray-300">System Status</p>
            <h3 className="text-xl font-bold mt-2 text-[#f7d77a]">Operational</h3>
            <p className="text-xs text-gray-400 mt-2">
              Backend and live fleet data connected.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <p className="text-[#d4af37] tracking-[0.3em] text-sm uppercase">
                Premium Fleet Intelligence
              </p>
              <h2 className="text-4xl md:text-6xl font-serif mt-3">
                Luxury Car Rental System
              </h2>
              <p className="text-gray-400 mt-4 max-w-2xl">
                Manage availability, bookings, fleet condition, and smart vehicle
                recommendations from one elegant control center.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-[#d4af37] text-black px-6 py-4 rounded-2xl font-bold shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:bg-[#f7d77a] transition"
            >
              + Add New Car
            </button>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
            <LuxuryCard title="Total Cars" value={cars.length} subtitle="Fleet size" />
            <LuxuryCard title="Available" value={availableCars} subtitle="Ready to rent" />
            <LuxuryCard title="Rented" value={rentedCars} subtitle="Currently active" />
            <LuxuryCard title="Maintenance" value={maintenanceCars} subtitle="Under service" />
          </section>

          {showForm && (
            <section className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 mb-8 shadow-2xl">
              <h3 className="text-2xl font-serif text-[#f7d77a] mb-5">Add New Luxury Vehicle</h3>

              <form onSubmit={handleAddCar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LuxuryInput name="brand" value={newCar.brand} onChange={handleChange} placeholder="Brand" />
                <LuxuryInput name="model" value={newCar.model} onChange={handleChange} placeholder="Model" />
                <LuxuryInput name="category" value={newCar.category} onChange={handleChange} placeholder="Category" />
                <LuxuryInput name="fuelType" value={newCar.fuelType} onChange={handleChange} placeholder="Fuel Type" />
                <LuxuryInput name="transmission" value={newCar.transmission} onChange={handleChange} placeholder="Transmission" />
                <LuxuryInput name="year" value={newCar.year} onChange={handleChange} placeholder="Year" type="number" />
                <LuxuryInput name="pricePerDay" value={newCar.pricePerDay} onChange={handleChange} placeholder="Price Per Day" type="number" />
                <LuxuryInput name="seats" value={newCar.seats} onChange={handleChange} placeholder="Seats" type="number" />
                <LuxuryInput name="performanceScore" value={newCar.performanceScore} onChange={handleChange} placeholder="Performance Score" type="number" step="0.1" />

                <select
                  name="status"
                  value={newCar.status}
                  onChange={handleChange}
                  className="bg-black/40 border border-white/10 text-white p-4 rounded-2xl outline-none focus:border-[#d4af37]"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RENTED">RENTED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>

                <div className="md:col-span-3 flex gap-3 mt-2">
                  <button type="submit" className="bg-[#d4af37] text-black px-6 py-3 rounded-2xl font-bold">
                    Save Car
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-2xl font-serif text-[#f7d77a]">Fleet Overview</h3>
                  <p className="text-gray-400 text-sm">Live data from Spring Boot API</p>
                </div>
                <span className="text-xs border border-[#d4af37]/40 text-[#f7d77a] px-3 py-1 rounded-full">
                  LIVE
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Seats</th>
                      <th className="p-3">Daily Rate</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">
                          <p className="font-bold">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-400">{car.fuelType} · {car.transmission}</p>
                        </td>
                        <td className="p-3">{car.category}</td>
                        <td className="p-3">{car.seats}</td>
                        <td className="p-3 text-[#f7d77a]">${car.pricePerDay}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle(car.status)}`}>
                            {car.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6">
              <h3 className="text-2xl font-serif text-[#f7d77a] mb-4">
                Smart Recommendations
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                The system can suggest vehicles based on budget, passengers, trip type,
                weather, and fleet performance.
              </p>

              <div className="space-y-4">
                {cars.slice(0, 3).map((car) => (
                  <div key={car.id} className="rounded-2xl bg-black/30 border border-white/10 p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-bold">{car.brand} {car.model}</p>
                        <p className="text-xs text-gray-400">{car.category}</p>
                      </div>
                      <span className="text-[#d4af37] font-bold">★ {car.performanceScore}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Recommended for comfort, availability, and fleet performance.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function LuxuryCard({ title, value, subtitle }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl hover:border-[#d4af37]/50 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-4xl font-bold mt-3 text-white">{value}</h3>
      <p className="text-[#d4af37] text-sm mt-3">{subtitle}</p>
    </div>
  );
}

function LuxuryInput({ name, value, onChange, placeholder, type = "text", step }) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      step={step}
      className="bg-black/40 border border-white/10 text-white placeholder-gray-500 p-4 rounded-2xl outline-none focus:border-[#d4af37]"
      required
    />
  );
}

function statusStyle(status) {
  if (status === "AVAILABLE") return "bg-green-500/20 text-green-300";
  if (status === "RENTED") return "bg-blue-500/20 text-blue-300";
  if (status === "MAINTENANCE") return "bg-orange-500/20 text-orange-300";
  return "bg-gray-500/20 text-gray-300";
}

export default App;