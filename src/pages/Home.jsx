import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Home = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardName, setBoardName] = useState("");
  const navigate = useNavigate();

  // const arr = [1, 2, 3, 4, 5];

  const createNewBoard = async (event) => {
    event.preventDefault();
    if (!boardName.trim()) {
      return;
    }

    try {
      console.log(boardName);
      const response = await axios.post(
        `https://api.trello.com/1/boards/?name=${boardName}&key=${import.meta.env.VITE_APP_KES}&token=${import.meta.env.VITE_APP_TOKEN}`
      );

      console.log("Board created successfully:", response.data);
      setBoardName("");
      navigate(`/boards/:${response.data.id}`);

      // alert(`Board "${response.data.name}" created successfully!`);
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      createNewBoard(event);
    }
  };

  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/members/me/boards?fields=name,url,prefs&key=${
            import.meta.env.VITE_APP_KES
          }&token=${import.meta.env.VITE_APP_TOKEN}`
        );

        console.log(response.data);

        setBoards(response.data);
        setLoading(false);


      } catch (error) {
        console.log(error.message);
      }
    }

    fetchBoards();
  }, []);

  // console.log(boards);

  return (
    <>
      <main className="home w-full bg-fixed min-h-[93vh] ">
        <div className="content max-w-[1220px] mx-auto px-3 w-full py-5">
          <div className="wrapper">
            <h1 className="text-lg sm:text-3xl font-semibold">Boards</h1>

            <section className="boards_wrapper flex flex-wrap justify-start gap-5 px-5 py-10">
              {loading
                ? new Array(10).fill(null).map((ele, index) => {
                    return (
                      <Skeleton
                        className=" w-[250px] h-[140px] rounded-md bg-slate-100"
                        key={index}
                      />
                    );
                  })
                : boards.map((ele) => {
                    return (
                      <Link to={`/boards/${ele.id}`} key={ele.id}>
                        <div className="board_card relative w-[250px] h-[120px] shadow-lg">
                          <span className="absolute left-2 top-2 text-white text-xl font-bold">
                            {ele.name}
                          </span>
                          <img
                            className="w-full object-cover rounded-md h-full"
                            src={ele.prefs?.["backgroundImageScaled"]?.[2]?.["url"] || "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/320x480/19b35237aec1ad2628f138eeef1e1284/photo-1678811116814-26372fcfef1b.webp"}
                            alt=""
                            draggable={false}
                          />
                        </div>
                      </Link>
                    );
                  })}

              {!loading && (
                <>
                  <div className="board_card w-[250px] h-[120px] bg-slate-300 rounded-md grid place-items-center">
                    <Popover>
                      <PopoverTrigger className="text-white text-xl font-bold text-center">
                        Create New Board
                      </PopoverTrigger>
                      <PopoverContent>
                        <form>
                          <input
                            type="text"
                            placeholder="Name of the board"
                            className="w-full p-2 border rounded-md"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </form>
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
