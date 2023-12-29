import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import {
  BiSolidPencil,
  BiLink,
  BiLinkExternal,
  BiTask,
  BiCalendarStar,
} from "react-icons/bi";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { useAuthentication } from "../../hooks/useAuthentication";
import Swal from "sweetalert2";
import { checkLargest } from "../../utils/retrieveInfo";
import { useDisplayActivity } from "../../hooks/useDisplayActivity";
import Modal from "react-modal";
import { useSpinner } from "../../hooks/useSpinner";

function Dashboard() {
  const { setUser, setLoader, user, setInfo, info } = useAppContext();
  const navigate = useNavigate();
  const { logout } = useAuthentication();
  const [date, setDate] = useState(new Date());
  const { displayInfo } = useDisplayActivity();
  const [imageSrc, setImageSrc] = useState(info.image);
  const imageRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { spinner, setLoading, loading } = useSpinner();

  Modal.setAppElement("#root");

  const getData = async () => {
    const { data: profile } = await supabase.from("profiles").select("*");
    if (profile.length !== 0) {
      setInfo(profile[0]);
    }
  };

  const compareDates = (datum) => {
    return date.getDay() === new Date(datum).getDay();
  };

  const canCheckIn = () => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (compareDates(info.clock_in_time[0])) {
      return true;
    } else if (hours === 8) {
      return minutes > 30;
    }
    return true;
  };

  const canCheckOut = () => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (compareDates(info.clock_out_time[0])) {
      return true;
    } else if (hours === 16) {
      return minutes < 30;
    }
    return true;
  };

  const checkIn = async () => {
    const date = new Date();
    const { error } = await supabase
      .from("profiles")
      .update({ clock_in_time: [date, ...info.clock_in_time] })
      .eq("id", info.id);
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "Try again",
        confirmButtonColor: "#f27474",
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: "You have successfully clocked in",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      getData();
    }
  };

  const checkOut = async () => {
    const date = new Date();
    const { error } = await supabase
      .from("profiles")
      .update({ clock_out_time: [date, ...info.clock_out_time] })
      .eq("id", info.id);
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "Try again",
        confirmButtonColor: "#f27474",
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: "You have successfully clocked out",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      getData();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    const image = imageRef.current.files[0];
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`${info.id}/avatar`, image, {
        cacheControl: "3600",
        upsert: true,
      });
    if (data) {
      Swal.fire({
        title: "Success!",
        text: "You have successfully updated your avatar",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Try again",
        confirmButtonColor: "#f27474",
      });
    }
    setLoading(false);
    setModalIsOpen(false);
  };

  const validFileType = (file) => {
    const fileTypes = ["image/png", "image/jpeg", "image/jpg"];
    return fileTypes.includes(file.type);
  };

  const returnFileSize = (file) => {
    return file.size;
  };

  const handleChange = () => {
    const image = imageRef.current.files[0];
    if (validFileType(image) && returnFileSize(image) <= 3145728) {
      setImageSrc(URL.createObjectURL(image));
    } else if (!validFileType(image)) {
      Swal.fire({
        title: "Invalid File Type",
        text: "Only png, jpeg and jpg file types are accepted",
        icon: "error",
        confirmButtonText: "Try again",
        confirmButtonColor: "#f27474",
      });
      imageRef.current.value = "";
    } else {
      Swal.fire({
        title: "File Too Large",
        text: "Image size must be at most 3MB",
        icon: "error",
        confirmButtonText: "Try again",
        confirmButtonColor: "#f27474",
      });
      imageRef.current.value = "";
    }
  };

  const getMedia = async () => {
    const { data } = await supabase.storage.from("avatars").list(info.id, {
      limit: 1,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
    if (data && info.id !== "") {
      setInfo((prevInfo) => {
        return {
          ...prevInfo,
          image: `https://cnkzhrjwoqofeltxhvjp.supabase.co/storage/v1/object/public/avatars/${info.id}/avatar`,
        };
      });
      setImageSrc(
        `https://cnkzhrjwoqofeltxhvjp.supabase.co/storage/v1/object/public/avatars/${info.id}/avatar`
      );
    }
  };

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

    setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => {
      getData();
    };
  }, []);

  useEffect(() => {
    getMedia();
  }, [info.id]);

  return (
    <motion.section
      className="dashboard container-xl p-md-4 p-3"
      key="dashboard"
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className="user">
            <span aria-hidden="true">
              {imageSrc ? (
                <img src={imageSrc} alt="profile picture" />
              ) : (
                <span aria-hidden="true">
                  {user?.user?.user_metadata?.username
                    ?.split("_")[0][0]
                    ?.toUpperCase()}
                </span>
              )}
              <button onClick={() => setModalIsOpen(true)}>
                <BiSolidPencil />
              </button>
            </span>
          </div>
          <h2 className="fs-4">
            {user?.user?.user_metadata?.username
              ?.split("_")
              ?.map((item) => `${item[0].toUpperCase()}${item.slice(1)}`)
              ?.join(" ")}
          </h2>
        </div>
        <Button onClick={logout}>Log out</Button>
      </div>
      <h1 className="mt-4">Dashboard</h1>
      <p>
        Don&apos;t forget that clocking in starts from 8:30am and ends by 9:00am
        every week day. Clocking out starts from 4:30pm and ends by 5:00pm, so
        endeavour to do both.
      </p>
      <div className="row">
        <div className="col-lg-3 col-md-4 col-6 py-2 px-2">
          <div className="bg-dark text-white rounded h-100 p-3 position-relative">
            <div className="d-flex justify-content-between align-items-baseline">
              <h3>Clock In</h3>
              <BiLink className="fs-2 pt-1" />
            </div>
            <p className="pt-2 pb-0 mt-4 mb-0">Starts at 8:30</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-6 py-2 px-2">
          <div className="bg-dark text-white rounded h-100 p-3 position-relative">
            <div className="d-flex justify-content-between align-items-baseline">
              <h3>Clock Out</h3>
              <BiLinkExternal className="fs-2 pt-1" />
            </div>
            <p className="pt-2 pb-0 mt-4 mb-0">Starts at 16:30</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-6 py-2 px-2">
          <div className="bg-dark text-white rounded h-100 p-3 position-relative">
            <div className="d-flex justify-content-between align-items-baseline">
              <h3 className="text-capitalize">
                {user?.user?.user_metadata?.role}
              </h3>
              <BiTask className="fs-2 pt-1" />
            </div>
            <p className="pt-2 pb-0 mt-4 mb-0">Role</p>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 col-6 py-2 px-2">
          <div className="bg-dark text-white rounded h-100 p-3 position-relative">
            <div className="d-flex justify-content-between align-items-baseline">
              <h3>
                <span>
                  {checkLargest(
                    info.clock_in_time.length,
                    info.clock_out_time.length
                  )}
                </span>{" "}
                Day(s)
              </h3>
              <BiCalendarStar className="fs-2 pt-1" />
            </div>
            <p className="pt-2 pb-0 mt-4 mb-0">Total Attended</p>
          </div>
        </div>
      </div>
      <h2 className="mt-4 mb-3">Actions</h2>
      <div className="row">
        <div className="col-md-3 col-5">
          <Button
            className="w-100 py-3"
            disabled={canCheckIn()}
            onClick={checkIn}
          >
            Check In
          </Button>
        </div>
        <div className="col-md-3 col-5">
          <Button
            className="w-100 py-3"
            disabled={canCheckOut()}
            onClick={checkOut}
          >
            Check Out
          </Button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-baseline">
        <h2 className="pt-2 mt-4 mb-3">Your Attendances</h2>
        <Link
          to="/attendances"
          className="link-dark text-decoration-none fw-bold"
        >
          See more
        </Link>
      </div>
      <div className="mb-5">
        {displayInfo(info.clock_in_time, info.clock_out_time).length !== 0 ? (
          displayInfo(info.clock_in_time, info.clock_out_time)
            .slice(0, 10)
            .map(({ action, dateString, timeString }, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center border border-2 p-3 rounded-4 pb-0 mb-3"
              >
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <div className="fs-2 p-1 text-dark bg-light rounded mb-3">
                    <BiLink />
                  </div>
                  <div>
                    <h4 className="fs-5">{action}</h4>
                    <p>{dateString}</p>
                  </div>
                </div>
                <div className="mb-3">{timeString}</div>
              </div>
            ))
        ) : (
          <p className="text-center mt-4 fs-5">No Clocking Activity Yet</p>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
          overlay: {
            backgroundColor: "var(--clr-neutral-600)",
          },
        }}
      >
        <h2>Upload Photo</h2>
        <form onSubmit={handleUpload}>
          <input
            type="file"
            className="file"
            required
            ref={imageRef}
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleChange}
          />
          <Button type="submit" disabled={loading}>
            {!loading ? <span>Submit</span> : spinner()}
          </Button>
        </form>
      </Modal>
    </motion.section>
  );
}
export default Dashboard;
