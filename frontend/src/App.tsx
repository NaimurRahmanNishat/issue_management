// src/App.tsx

import { Outlet } from "react-router-dom";
import Header from "./components/shared/Header";
import HeaderTop from "./components/shared/HeaderTop";
import Footer from "./components/shared/Footer";
import { ToastContainer } from "react-toastify";

const App = () => {

  return (
    <div>
      <HeaderTop />
      <Header />
      <main className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 xl:px-0">
        <Outlet />
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
