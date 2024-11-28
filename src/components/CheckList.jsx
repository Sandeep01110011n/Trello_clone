/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react";
import CheckItems from "./CheckItems";
import axios from "axios";
import { Button } from "./ui/button";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";



const CheckList = ({checkListData , deleteCheckList})=>{



    const [checkItems , setCheckItems] = useState( []);
    const [progress , setProgress] = useState(0);
    const [portion , setPortion] = useState(0);
    const [showAddCheckItem , setShowAddCheckItem]  = useState(false);
    const [checkItemName , setCheckItemName] = useState("");

    function handleProgress(data) {
        let newProgress = progress;
    
        if (data.state === "complete") {
          newProgress += portion;
        }
        else if (data.state === "incomplete") {
          newProgress -= portion;
        }

        if( newProgress >= 97) newProgress = 100;
        
        else if( newProgress < 0) newProgress = 0;
    
        setProgress(newProgress);
    }

    function showList(){
        setShowAddCheckItem(!showAddCheckItem);
    }

    async function handleAddCheckItem(){

        if( checkItemName.trim() === ""){
            setCheckItemName("");
            setShowAddCheckItem(!showAddCheckItem);
            return;
        }


        try{

            const response = await axios.post(`https://api.trello.com/1/checklists/${checkListData?.id}/checkItems?name=${checkItemName}&key=${
              import.meta.env.VITE_APP_KES
            }&token=${import.meta.env.VITE_APP_TOKEN}`);

            const newCheckItems = [...checkItems , response.data];
            setCheckItems(newCheckItems);
            setCheckItemName("");
            const part = Math.ceil(100/newCheckItems.length);
            setPortion(part);
            loadProgress(newCheckItems , part);

        }
        catch(error){
            console.log(error.message);
        }
    }
    

   async function deleteCheckItem(item_id){

        if(item_id.trim() === "") return;

        const updatedItems = checkItems.filter((ele)=>{
           return ele.id !== item_id;
        })

        try {

            const response = await axios.delete(`https://api.trello.com/1/checklists/${checkListData.id}/checkItems/${item_id}?key=${
              import.meta.env.VITE_APP_KES
            }&token=${import.meta.env.VITE_APP_TOKEN}`);

            setCheckItems(updatedItems);
            const part = Math.ceil(100/updatedItems.length);
            setPortion(part);
            loadProgress(updatedItems , part);
            
        } catch (error) {
            console.log(error.message);
        }
    }

    function loadProgress(itemsData , part){

        // console.log(portion , progress);

        const initialProgress = itemsData.reduce((acc ,ele)=>{

            if(ele.state === "complete"){
                acc += part;
            }

            return acc;
        },0);

        // console.log(initialProgress);
        
        setProgress(initialProgress);

    }


    useEffect(()=>{

        async function fetchCheckItems(){

            try {
    
                const response = await axios.get(`https://api.trello.com/1/checklists/${checkListData.id}/checkItems?key=${
                  import.meta.env.VITE_APP_KES
                }&token=${import.meta.env.VITE_APP_TOKEN}`);
                // console.log(response.data);
                setCheckItems(response.data);
                const part = Math.ceil(100/response.data.length);
                setPortion(part);
                loadProgress(response.data , part);

                
            } catch (error) {
                console.log(error.message);
            }
        }

        fetchCheckItems();

    },[checkListData.id])

    // console.log(checkListData);

    return(

        <div className="checklist mb-2 w-full sm:w-5/6 border-b-2 pb-2 last-of-type:border-b-0">
            <div className="checklist_heading flex items-center justify-between">

            <h1 className="font-semibold text-[20px] capitalize my-2">{checkListData.name}</h1>
            <span className="inline-block text-sm border-2 rounded-md py-1 px-2 cursor-pointer" onClick={()=>deleteCheckList(checkListData.id)}>Delete</span>
            </div>

            <div className="progress_count flex items-center gap-2">
                <span>{progress}%</span>
            <Progress value={progress} className=" h-2"/>
            </div>

            {
                checkItems.length > 0 && checkItems.map((ele)=>{
                    return <CheckItems key={ele.id} itemData = {ele} handleProgress = {handleProgress} deleteCheckItem={deleteCheckItem} idCard = {checkListData.idCard}/>
                })
            }
            <div className="add_checkItem w-5/6">
            {showAddCheckItem ? (
          <div className="show w-full bg-[#f1f2f4] hover:bg-[#f1f2f4] outline-none border-0 h-max py-2 px-4 rounded-md">
            <input
              type="text"
              className="w-full p-2"
              placeholder="Add List..."
              value={checkItemName}
              onChange={(e) => setCheckItemName(e.target.value)}
            />
            <div className="action_btn flex items-center justify-between mt-2">
              <Button
                className="bg-blue-800 text-white py-1 "
                onClick={handleAddCheckItem}
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
            className="add_list w-full bg-[#f1f2f4]/40 hover:bg-[#f1f2f4] outline-none border-0 h-max py-1 px-4 rounded-full mt-2"
            onClick={showList}
          >
            <div className="message_list flex items-center cursor-pointer text-sm text-nowrap">
              <span className="mr-3">
                <FaPlus />{" "}
              </span>
              Add CheckItem...
            </div>
          </div>
        )}
            </div>

        </div>

    )
}

export default CheckList;