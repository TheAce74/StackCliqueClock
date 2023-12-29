import Loader from "../components/layout/Loader";
import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

function AppContextProvider({ children }) {
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState({});
  const [info, setInfo] = useState({
    clock_in_time: [],
    clock_out_time: [],
    id: "",
    image: null,
    username: "",
  });

  const value = {
    loader,
    setLoader,
    user,
    setUser,
    info,
    setInfo,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {loader && <Loader />}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export default AppContextProvider;
