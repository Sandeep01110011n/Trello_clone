import List from "@/components/List";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import CardModal from "@/components/CardModal";
import { Skeleton } from "@/components/ui/skeleton";

const Board = () => {
  const [boardData, setBoardData] = useState({});
  const [list, setList] = useState([]);
  const [showAddList, setShowAddList] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [listName, setListName] = useState("");

  // console.log(params.boardId);

  function showList() {
    setShowAddList(!showAddList);
  }

  function handleCardId(...args) {
    const [details] = args;
    // setCardId(id);
    setCardDetails(details);
    setShowModal(true);
  }

  async function handleArchiveList(id) {
    // console.log(id);

    const newList = list.filter((ele) => {
      return ele.id !== id;
    });

    try {
      const response = await axios.put(
        `https://api.trello.com/1/lists/${id}/closed?value=true&key=${
          import.meta.env.VITE_APP_KES
        }&token=${import.meta.env.VITE_APP_TOKEN}`
      );

      if (response.status === 200) {
        // console.log('List archived successfully:', response.data);
        setList(newList);
      } else {
        console.error("Failed to archive the list", response);
      }
    } catch (error) {
      console.error("Error archiving list:", error.message);
    }
  }

  async function handleAddList() {
    // console.log(listName);

    if (listName.trim() === "") {
      setShowAddList(!showAddList);
      return;
    }

    try {
      const response = await axios.post(
        `https://api.trello.com/1/lists?name=${listName}&idBoard=${
          params.boardId
        }&key=${import.meta.env.VITE_APP_KES}&token=${
          import.meta.env.VITE_APP_TOKEN
        }`
      );

      // console.log(response.data);
      setList([...list, response.data]);
      setShowAddList(false);
      setListName("");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function fetchList(data) {
    const response = await axios.get(
      `https://api.trello.com/1/boards/${data.id}/lists?key=${
        import.meta.env.VITE_APP_KES
      }&token=${import.meta.env.VITE_APP_TOKEN}`
    );
    // console.log(response.data);
    setLoading(false);
    setList(response.data);
  }

  useEffect(() => {
    function fetchBoards() {
      // console.log(params.boardId.slice(1));
      let board_id = params.boardId;
      if (board_id[0] === ":") {
        board_id = board_id.slice(1);
      }
      axios
        .get(
          `https://api.trello.com/1/boards/${board_id}?key=${
            import.meta.env.VITE_APP_KES
          }&token=${import.meta.env.VITE_APP_TOKEN}`
        )
        .then((res) => {
          setBoardData(res.data);
          fetchList(res.data);
        });
    }

    fetchBoards();
  }, [params.boardId]);

  // console.log(boardData);

  return (
    <main
      className="board w-full bg-fixed min-h-[93vh] bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${
          boardData.prefs?.backgroundImageScaled?.[7]?.url ||
          "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/1282x1920/19b35237aec1ad2628f138eeef1e1284/photo-1678811116814-26372fcfef1b.webp"
        })`,
      }}
    >
      <h1 className="w-full bg-black/30 text-white text-2xl font-semibold px-5 py-3">
        {boardData.name}
      </h1>
      <div className="wrapper mx-auto px-10 w-full py-5 overflow-x-scroll flex gap-4 h-[85vh] no-scrollbar">
        {loading
          ? new Array(5).fill(null).map((ele, index) => {
              return (
                <Skeleton
                  className=" min-w-[400px] odd:h-[240px] even:h-[340px] rounded-md bg-slate-100"
                  key={index}
                />
              );
            })
          : list.length > 0 &&
            list.map((ele) => {
              return (
                <List
                  key={ele.id}
                  list_data={ele}
                  handleArchive={handleArchiveList}
                  handleModal={handleCardId}
                />
              );
            })}

        {showAddList ? (
          <div className="show min-w-[300px] bg-[#f1f2f4] hover:bg-[#f1f2f4] outline-none border-0 h-max py-2 px-4 rounded-md">
            <input
              type="text"
              className="w-full py-2 px-3 rounded-full outline-none"
              placeholder="Add List..."
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
            <div className="action_btn flex items-center justify-between mt-2">
              <Button
                className="bg-blue-800 text-white py-1 "
                onClick={handleAddList}
              >
                Add
              </Button>
              <span className="cursor-pointer" onClick={showList}>
                <RxCross2 />
              </span>
            </div>
          </div>
        ) : (
          <div
            className="add_list min-w-[300px] bg-[#f1f2f4]/40 hover:bg-[#f1f2f4] outline-none border-0 h-max py-2 px-4 rounded-full"
            onClick={showList}
          >
            <div className="message_list flex items-center cursor-pointer">
              <span className="mr-3">
                <FaPlus />{" "}
              </span>
              Add new list
            </div>
          </div>
        )}
      </div>
      <div className="modal">
        <CardModal
          showModal={showModal}
          onClose={() => setShowModal(!showModal)}
          cardId={cardDetails}
        />
      </div>
    </main>
  );
};

export default Board;
