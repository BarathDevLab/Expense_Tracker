
import axios from "axios";
import { useEffect, useState } from "react";
export const TranscationItemsListLimited = ({}) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfRows = 5; // Number of rows to display per page
  const refresh = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/getTranscationList`)
      .then((res) => {
        // Assuming res.data is the transaction list
        setTransactions(res.data); // Update the transactions state with the fetched data
        // You can set the transactions state here if needed
      })
      .catch((err) => {
        console.error("Error fetching transaction list:", err);
      });
  };
  useEffect(() => {
    refresh();
  }, []);
  const HanleDelete = (id) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/deleteTranscationList`, {
        data: { id: id },
      })
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        refresh();
        // Optionally, you can refresh the transaction list here
      });
  };
  return (
    <div className="Transactiom--con">
      {transactions
        .slice((currentPage - 1) * numberOfRows, currentPage * numberOfRows)
        .map((list, index) => (
          <div className="Transactiom--table" key={index}>
            <div className="trans-item">
              <div className="Trans-info">
                <div className="trans-title">
                  <h3>{list.name}</h3>
                  <h3 className={`type ${list.type}`}>{list.type}</h3>
                </div>
                <div className="tans-desc">
                  <h3>{list.desc}</h3>
                  <h3>24/02/2000</h3>{" "}
                  {/* You can replace this with list.date */}
                </div>
              </div>
              <div className="trans-amount">
                <p>{list.amount}</p>
              </div>
              <div className="action-btns">
                <i className="fa-solid fa-pen-to-square edit"></i>
                <i
                  className="fa-solid fa-trash del"
                  onClick={() => HanleDelete(list._id)}
                ></i>
              </div>
            </div>
          </div>
        ))}
        <div>
            <button onClick={()=> setCurrentPage(
currentPage > 1 ? currentPage - 1 : 1
            )}>
                previous
            </button>
            <button onClick={()=> setCurrentPage(
currentPage < Math.ceil(transactions.length / numberOfRows ) ? currentPage + 1 : currentPage
            )}>
                next
            </button>
        </div>
    </div>
  );
};
