import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: false,
};
const toaster = {
  success: (msg) => toast.success(msg, options),
  error: (msg) => toast.error(msg, options),
  warning: (msg) => toast.warning(msg, options),
  errorwithcallback: (msg, callback) => {
    let option = options;
    option.onClose = callback;
    toast.error(msg, option);
  },
};

export default toaster;
