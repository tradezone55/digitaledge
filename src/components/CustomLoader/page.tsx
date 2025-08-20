import Logo from "../ui/Logo";


const CustomLoader = () => {
  return (
    <section className=" bg-gray-800 font-inter w-full min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <Logo />
      </div>
    </section>
  );
};

export default CustomLoader;
