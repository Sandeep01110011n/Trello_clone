import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-900 backdrop-blur-md border border-white/20 py-2 px-4 shadow-lg flex items-center h-[7vh]">

    <Link to={"/"}>
      <button className="text-white p-2 border-2 rounded-md">Boards</button>
    </Link>

      <span className=" w-[100px] h-full ml-[45%] grid place-items-center">
        <img src="https://trello.com/assets/d947df93bc055849898e.gif" alt="" />
      </span>

    </nav>
  );
};

export default Navbar;
