import { useState } from "react";
import Spinner from "../components/ui/Spinner";

function useSpinner() {
  const [loading, setLoading] = useState(false);

  const spinner = () => <Spinner />;

  return { spinner, setLoading, loading };
}

export { useSpinner };
