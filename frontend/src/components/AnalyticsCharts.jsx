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
  LineChart,
  Line,
} from "recharts";

function AnalyticsCharts({ cars, bookings, maintenanceRecords }) {
  const availableCars = cars.filter((car) => car.status === "AVAILABLE").length;
  const rentedCars = cars.filter((car) => car.status === "RENTED").length;
  const maintenanceCars = cars.filter((car) => car.status === "MAINTENANCE").length;

  const fleetData = [
    { name: "Available", value: availableCars },
    { name: "Rented", value: rentedCars },
    { name: "Maintenance", value: maintenanceCars },
  ];

  const revenueData = bookings.map((booking, index) => ({
    name: `B${index + 1}`,
    revenue: Number(booking.totalPrice || 0),
  }));

  const maintenanceData = maintenanceRecords.map((record, index) => ({
    name: `M${index + 1}`,
    cost: Number(record.cost || 0),
  }));

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="panel h-[430px]">
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

      <div className="panel h-[430px]">
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

      <div className="panel h-[430px] lg:col-span-2">
        <h3 className="text-3xl mb-6 text-[#f7d77a]">
          Maintenance Cost Trend
        </h3>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={maintenanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#d4af37"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsCharts;