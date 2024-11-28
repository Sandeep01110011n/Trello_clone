/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RxCross2 } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineArchive } from "react-icons/md";

const List = ({ list_data, handleArchive ,handleModal}) => {
  const [card, setCard] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardName, setCardName] = useState("");

  function handleShow() {
    setShowAddCard(!showAddCard);
  }

  function handleEdit(...args) {
    const [cardDetails] = args;
    handleModal(cardDetails)
  }

  async function handleDeleteCard(id) {
    // console.log(id);

    const newData = card.filter((ele) => {
      return ele.id !== id;
    });

    setCard(newData);

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.delete(
        `https://api.trello.com/1/cards/${id}?key=${
          import.meta.env.VITE_APP_KES
        }&token=${import.meta.env.VITE_APP_TOKEN}`
      );

      // console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleAddCard() {
    if (cardName.trim() === "") {
      setShowAddCard(!showAddCard);
      return;
    }

    try {
      const response = await axios.post(
        `https://api.trello.com/1/cards?name=${cardName}&idList=${
          list_data?.id
        }&key=${import.meta.env.VITE_APP_KES}&token=${
          import.meta.env.VITE_APP_TOKEN
        }`
      );
      // console.log(response.data);

      const newList = [...card, response.data];
      setCard(newList);

      setShowAddCard(!showAddCard);
      setCardName("");
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    async function fetchListData() {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/lists/${list_data.id}/cards?key=${
            import.meta.env.VITE_APP_KES
          }&token=${import.meta.env.VITE_APP_TOKEN}`
        );
        // console.log(response.data);
        setCard(response.data);
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchListData();
  }, [list_data.id]);

  // console.log(card);

  return (
    <>
      <Card className="min-w-[400px] bg-[#f1f2f4] outline-none border-0 h-max p-2 " >
        <CardHeader>
          <CardTitle className="flex items-center justify-between" draggable={false}>
            {list_data?.name}{" "}
            <span
              className="cursor-pointer"
              onClick={() => handleArchive(list_data?.id)}
            >
              <MdOutlineArchive />
            </span>
          </CardTitle>
        </CardHeader>
        {card.length !== 0 ? (
          card.map((ele) => {
            return (
              <CardContent key={ele.id} className="cursor-pointer">
                <div className="bg-white px-3 py-2 rounded-2xl flex items-center justify-between group">
                  {ele.name}{" "}
                  <p className="flex gap-1 opacity-0 group-hover:opacity-100">
                    <span>
                      <CiEdit onClick={()=> handleEdit(ele)} />
                    </span>
                    <span onClick={() => handleDeleteCard(ele.id)}>
                      <RiDeleteBin6Line />
                    </span>
                  </p>
                </div>
              </CardContent>
            );
          })
        ) : (
          <span></span>
        )}
        {showAddCard ? (
          <CardFooter className="cursor-pointer rounded-full flex flex-col">
            <input
              type="text"
              className="w-full block p-2"
              placeholder="Add Card..."
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />

            <div className="action_btn flex items-center justify-between mt-2 block-flex w-full">
              <Button
                className="bg-blue-800 text-white py-1 "
                onClick={handleAddCard}
              >
                Add
              </Button>
              <span className="cursor-pointer text-xl" onClick={handleShow}>
                <RxCross2 />
              </span>
            </div>
          </CardFooter>
        ) : (
          <CardFooter
            className="cursor-pointer hover:bg-black/10 py-2 rounded-full"
            onClick={handleShow}
          >
            <p className="flex items-center text-lg">
              <span className="mr-3 text-2xl ">
                <CiCirclePlus />
              </span>
              Add Card
            </p>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default List;
