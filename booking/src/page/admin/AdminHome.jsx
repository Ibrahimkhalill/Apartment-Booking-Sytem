import { useEffect, useState } from "react";
import Sidebar from "../../component/admin/Sidebar";
import axiosInstance from "../../component/axioxinstance";

const AdminHome = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/get-all-calculatioin/");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Sidebar>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-start justify-start gap-3">
        <div className=" h-[30vh] border  bg-blue-800 rounded-md text-white flex flex-col items-center justify-center gap-3">
          <img
            className="w-[80px] h-[80px] "
            src="https://cdn.ostad.app/public/upload/2023-05-27T08-52-03.886Z-Image.png"
            alt="Course Image"
          />
          <p className="text-white text-lg font-medium">Total Room ({data.total_rooms})</p>
        </div>
        <div className=" h-[30vh] border flex flex-col items-center justify-center gap-3 bg-green-800 rounded-md">
          <img
            className="w-[80px] h-[80px] "
            src="https://cdn-icons-png.flaticon.com/512/10337/10337440.png"
            alt="Course Image"
          />
          <p className="text-white text-lg font-medium">
            Today Reservation ({data.reservations_today})
          </p>
        </div>
        <div className=" h-[30vh] border flex flex-col items-center justify-center gap-3 bg-yellow-800 rounded-md">
          <img
            className="w-[80px] h-[80px] "
            src="/images/customer.png"
            alt="Course Image"
          />
          <p className="text-white text-lg font-medium">Total Customer ({data.distinct_customers})</p>
        </div>
        <div className=" h-[30vh] border flex flex-col items-center justify-center gap-3 bg-cyan-800 rounded-md">
          <img
            className="w-[80px] h-[80px] "
            src="https://cdn-icons-png.flaticon.com/512/4599/4599706.png"
            alt="Course Image"
          />
          <p className="text-white text-lg font-medium">Total Eraning ({data.total_amount})</p>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminHome;
