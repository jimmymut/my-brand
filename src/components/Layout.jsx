import Header from "./Header";

export default function Layout({ children, isHome = false }) {
  return (
    <>
      <Header
        isHome={isHome}
      />
      {children}
    </>
  );
}
