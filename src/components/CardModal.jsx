/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import axios from "axios";
import { useEffect, useState } from "react";
import CheckList from "./CheckList";
import { Button } from "./ui/button";

const CardModal = ({ showModal, onClose, cardId }) => {
  // console.log(cardId);
  const [checkList, setCheckList] = useState([]);
  const [checkListName , setCheckListName] = useState("");
  const [showPopOver , setShowPopOver] = useState(false);

  async function deleteCheckList(...args){
    const [id] = args;

    if(!id && id.trim() === "") return;

    const newCheckList = checkList.filter((ele)=>{
      return ele.id !== id;
    })

    try{

      await axios.delete(`https://api.trello.com/1/checklists/${id}?key=${
              import.meta.env.VITE_APP_KES
            }&token=${import.meta.env.VITE_APP_TOKEN}`);
      // console.log(response);
      setCheckList(newCheckList);

    }catch(error){
      console.log(error.message);
    }


  }

  async function handleAddCheckList(){

    if(checkListName.trim() === ""){
      return;
    }


    try {

      const response = await axios.post(`https://api.trello.com/1/checklists?idCard=${cardId.id}&name=${checkListName}&key=${
              import.meta.env.VITE_APP_KES
            }&token=${import.meta.env.VITE_APP_TOKEN}`);
      // console.log(response.data);
      setCheckListName("");
      setShowPopOver(!showPopOver);
      const newCheckList = [...checkList , response.data];
      setCheckList(newCheckList);
      
    } catch (error) {
      console.log(error.message);
    }

  }

  // Fetch checklists for the card
  useEffect(() => {
    if (showModal && cardId) {
      async function fetchChecklists() {
        try {
          const response = await axios.get(
            `https://api.trello.com/1/cards/${cardId.id}/checklists?key=${
              import.meta.env.VITE_APP_KES
            }&token=${import.meta.env.VITE_APP_TOKEN}`
          );
          setCheckList(response.data);
        } catch (error) {
          console.log(error.message);
        }
      }
      fetchChecklists();
    }
  }, [cardId, showModal]);

  if (cardId.id === "") return;

  // console.log(checkList);

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] h-[600px] w-full" aria-labelledby="checkItems">
        <DialogHeader>
          <DialogTitle className="text-left uppercase text-[24px]">{cardId.name}</DialogTitle>
          <div className="w-full h-full flex items-center pt-5 overflow-hidden flex-col-reverse sm:flex-row justify-between">
            <div className="left w-5/6  h-[450px] overflow-y-auto">
              {checkList &&
                checkList.map((ele) => {
                  return <CheckList key={ele?.id} checkListData={ele} deleteCheckList={deleteCheckList}/>;
                })}
            </div>
            <div className="right w-full sm:w-1/6 sm:border-l-2 sm:h-full px-3 ">
              <Popover isOpen={showPopOver} onClose={() => setShowPopOver(false)} >
                <PopoverTrigger>
                  {" "}
                  <p className="cursor-pointer border-2 shadow-md rounded-md p-2 text-center mx-2">
                    CheckList
                  </p>
                </PopoverTrigger>
                <PopoverContent>
                <input
              type="text"
              className="w-full p-2"
              placeholder="Add CheckList..."
              value={checkListName}
              onChange={(e) => setCheckListName(e.target.value)}
            />
                  <Button
                className="bg-blue-800 text-white py-1 mt-2"
                onClick={handleAddCheckList}
              >
                Add
              </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
