import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function useLoadNextBatch(totalPageCount) {
  const [pageNum, setPageNum] = useState(1);
  const feedIsNotFull = pageNum < totalPageCount;

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (!inView) return () => {};

    const interval = setInterval(() => {
      if (inView && feedIsNotFull) {
        setPageNum((prev) => (prev += 1));
      }
    }, 250);

    return () => clearInterval(interval);
  }, [inView, feedIsNotFull]);

  return { ref, pageNum };
}
