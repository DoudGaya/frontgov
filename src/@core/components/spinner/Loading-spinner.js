import classnames from "classnames";

const ComponentSpinner = ({ className }) => {
  return (
    <div
      className={classnames("fallback-spinner", {
        [className]: className,
      })}
    >
      <div className="loading">
        <div className="effect-1 effects"/>
        <div className="effect-2 effects"/>
        <div className="effect-3 effects"/>
      </div>
    </div>
  );
};

export default ComponentSpinner;
