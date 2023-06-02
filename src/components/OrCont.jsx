const OrCont = ({ lineClassName, classNam }) => {
  return (
    <div className={classNam || "or-cont"}>
      <div className={lineClassName || "line"}></div>
      <div className="word">OR</div>
      <div className={lineClassName || "line"}></div>
    </div>
  );
};

export default OrCont;
