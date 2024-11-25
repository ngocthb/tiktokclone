import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Provider } from "react-redux";
import store from "../../store/store";
import { Outlet } from "react-router-dom";

function DefaultLayout() {
  return (
    <>
      <Provider store={store}>
        <Header />
        <div className="grid grid-cols-5 ">
          <div
            className="col-span-1 p-2 overflow-y-scroll"
            style={{ height: "88vh" }}
          >
            <Sidebar />
          </div>
          <div className="col-span-4 p-2 overflow-y-scroll">
            <Outlet />
          </div>
        </div>
      </Provider>
    </>
  );
}

export default DefaultLayout;
