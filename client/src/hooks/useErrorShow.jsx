import { useDispatch, useSelector } from "react-redux";
import { addErrors, dropError } from "state/uiSlice";

export default function useErrorShow() {
  const dispatch = useDispatch();
  const { duration } = useSelector((state) => state.ui.errors);

  const showError = (errorText) => {
    const errorId = crypto.randomUUID();
    dispatch(
      addErrors({
        error: {
          id: errorId,
          text: errorText,
        },
      })
    );
    setTimeout(() => {
      dispatch(dropError({ errorId }));
    }, duration);
  };

  return { showError };
}
