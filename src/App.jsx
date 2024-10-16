import "./App.css";
import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/Home";
import Footer from "./component/Footer";
import AvilableRoom from "./page/AvilableRoom";
import Checkout from "./page/Checkout";
import Admincheckout from "./page/admin/Checkout";
import Contact from "./page/Contact";
import About from "./page/About";
import Room from "./page/Room";
import { Provider, useSelector } from "react-redux";
import store from "./component/store";
import Confirmation from "./page/Confirmation";
import AdminConfirmation from "./page/admin/Confirmation";
import QueryGuard from "./component/QueryGard";
import NotfoundPage from "./page/NotfoundPage";
import ScrollToTop from "./component/ScrollToTop";
import AdminHome from "./page/admin/AdminHome";
import ViewReservation from "./page/admin/ViewReservation";
import ViewRoom from "./page/admin/ViewRoom";
import AddRoom from "./page/admin/AddRoom";
import EditRoom from "./page/admin/EditRoom";
import AddReservation from "./page/admin/AddReservation";
import RoomDeatils from "./page/RoomDeatils";
import Login from "./component/admin/Login";
import Registration from "./component/admin/Registration";
import Profile from "./page/admin/Profile";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* <Navbar /> */}
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<NotfoundPage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/sign-up" element={<Registration />} />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/available_room"
            element={
              <QueryGuard
                requiredParams={[
                  "placeId",
                  "checkInDate",
                  "checkOutDate",
                  "room",
                ]}
              >
                <>
                  <Navbar />
                  <AvilableRoom />
                  <Footer />
                </>
              </QueryGuard>
            }
          />
          <Route
            path="/checkout/"
            element={
              <QueryGuard requiredParams={["prebookingId"]}>
                <>
                  <Navbar />
                  <Checkout />
                  <Footer />
                </>
              </QueryGuard>
            }
          />
          <Route
            path="/admin/checkout/"
            element={
              <ProtectedRoute
                component={
                  <QueryGuard requiredParams={["prebookingId"]}>
                    <Navbar />
                    <Admincheckout />
                    <Footer />
                  </QueryGuard>
                }
              />
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/room"
            element={
              <>
                <Navbar />
                <Room />
                <Footer />
              </>
            }
          />
          <Route
            path="/room/room-details/:id"
            element={
              <>
                <Navbar />
                <RoomDeatils />
                <Footer />
              </>
            }
          />
          <Route
            path="/booking/confirmation"
            element={
              <>
                <Navbar />
                <Confirmation />
                <Footer />
              </>
            }
          />
          <Route
            path="/admin/room/booking/confirmation"
            element={<AdminConfirmation />}
          />
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute component={<AdminHome />} />}
          />
          <Route
            path="/admin/view/reservation"
            element={<ProtectedRoute component={<ViewReservation />} />}
          />
          <Route
            path="/admin/view/room"
            element={<ProtectedRoute component={<ViewRoom />} />}
          />
          <Route
            path="/admin/add/room"
            element={<ProtectedRoute component={<AddRoom />} />}
          />
          <Route
            path="/admin/edit/room/:id"
            element={<ProtectedRoute component={<EditRoom />} />}
          />
          <Route
            path="/admin/add/reservation"
            element={<ProtectedRoute component={<AddReservation />} />}
          />
          <Route
            path="/admin/profile"
            element={<ProtectedRoute component={<Profile />} />}
          />
        </Routes>

        {/*  */}
      </BrowserRouter>
    </Provider>
  );
}

const ProtectedRoute = ({ component }) => {
  const isLoggedIn = useSelector((state) => state.authentication.isLoggedIn);
  return isLoggedIn ? component : <Navigate to="/admin/login" replace />;
};

export default App;
