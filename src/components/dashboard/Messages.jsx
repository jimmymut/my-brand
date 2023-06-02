// import Loader from "../Loader";
import { useState } from "react";
import delIcon from "../../images/image 9.svg"
import { toast } from "react-toastify";
import Loader from "../Loader";

const Messages = ({messages, setMessages}) => {
  const [loading, setLoading] = useState(false);

  const deleteMessage = async (id) =>{
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_BASE_URL}/messages/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((response) => {
        setLoading(false);
        if (response.status === 204) {
          const newMessages = messages.filter(message => message._id !== id);
          setMessages(newMessages);
          toast.success("message deleted");
        } else if (response.status === 401) {
          toast.error("You are not logged in");
        } else if (response.status === 403) {
          toast.error("Forbiden, you are not admin");
        } else {
          toast.error("Deleting message failed");
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error(error.message);
      });
  }
  return (
    <div id="all-messages">
      {messages? <table id="tableMessages">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Message</th>
            <th>Date</th>
            <th>Del</th>
          </tr>
        </thead>
        <tbody>
           {messages.map((msg) => (
            <tr key={msg._id}>
              <td>{msg.name}</td>
              <td>{msg.email}</td>
              <td>{msg.phone}</td>
              <td>{msg.message}</td>
              <td>{new Date(msg.createdAt).toLocaleString()}</td>
              <td>
                {loading? <Loader className="loader"/>:<img src={delIcon} alt="" className="message-delete-class" onClick={()=>deleteMessage(msg._id)}/>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>:
        <p className="empty">There is no any message here yet!</p>}
    </div>
  );
};

export default Messages;
