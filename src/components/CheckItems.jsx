import axios from "axios";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";


/* eslint-disable react/prop-types */
const CheckItems = ({ itemData, handleProgress ,deleteCheckItem, idCard}) => {
  const [checked, setChecked] = useState(itemData.state === "complete" ? true : false);


  const updateCheckItemState = async ( checkItemId, state) => {
    // console.log(idCard);
    try {

      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(`https://api.trello.com/1/cards/${idCard}/checkItem/${checkItemId}?key=${import.meta.env.VITE_APP_KES}&token=${import.meta.env.VITE_APP_TOKEN}&state=${state}`);

      // console.log(response.data); 
    } catch (error) {
      console.error('Error updating checkItem state:', error);
    }
  };

  function handleItemState() {
    const newCheckedState = !checked;
    setChecked(newCheckedState);

    const newState = newCheckedState ? "complete" : "incomplete";

    updateCheckItemState(itemData.id , newState)

    let newData = { ...itemData, state: newCheckedState ? "complete" : "incomplete" };

    // console.log(newData);

    handleProgress(newData);
  }

  return (
    <div className="check_item flex items-center justify-between my-1 w-full">
      <input
        type="checkbox"
        className="w-[10%]"
        onChange={handleItemState}
        checked={checked} 
      />
      <p className={`w-[70%] ${checked ? "line-through" : ""}`}>{itemData.name}</p>
      <span className="w-[20%] cursor-pointer" onClick={()=>deleteCheckItem(itemData.id)}><RiDeleteBin6Line />
      </span>
    </div>
  );
};

export default CheckItems;
