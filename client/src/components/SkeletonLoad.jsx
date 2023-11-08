import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoad = (props) => {
  return (
    <>
      {props.loading ? (
        <Skeleton
          count={props.count}
          height={props.height}
          width={props.width}
          margin={props.margin}
        />
      ) : (
        props.children
      )}
    </>
  );
};

export default SkeletonLoad;
