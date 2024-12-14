
const Logo = ({ className }) => {
  return (
    <div className={`owner-sum ${className}`}>
      <img className="owner-profile" src="/profile.png" alt="owner profile pic" />
      <p>Jimmy's website</p>
    </div>
  );
};

export default Logo;
