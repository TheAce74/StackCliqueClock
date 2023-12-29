import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import { useDisplayActivity } from "../../hooks/useDisplayActivity";

function Attendances() {
  const { setUser, setLoader, info } = useAppContext();
  const navigate = useNavigate();
  const { displayInfo } = useDisplayActivity();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session);
        setLoader(false);
      } else {
        navigate("/");
      }
    };
    getSession();
  }, []);

  return (
    <motion.section
      className="container-xl p-md-4 p-3"
      key="attendances"
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className="mb-3">Attendances</h1>

      {displayInfo(info.clock_in_time, info.clock_out_time).length !== 0 ? (
        <div className="table-responsive mb-2">
          <table className="table table-striped table-bordered">
            <thead>
              <th scope="col" className="ps-2">
                Action
              </th>
              <th scope="col" className="ps-2">
                Date
              </th>
              <th scope="col" className="ps-2">
                Time
              </th>
            </thead>
            <tbody>
              {displayInfo(info.clock_in_time, info.clock_out_time).map(
                ({ action, dateString, timeString }, index) => (
                  <tr key={index}>
                    <td>{action}</td>
                    <td>{dateString}</td>
                    <td>{timeString}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-4 fs-5">No Clocking Activity Yet</p>
      )}

      <Link to="/dashboard">
        <Button>Dashboard</Button>
      </Link>
    </motion.section>
  );
}
export default Attendances;
